import datetime
import time
import xml.etree.ElementTree as ET
from datetime import timedelta

import requests
from django.core.management.base import BaseCommand
from django.db import transaction

from project import models


class Command(BaseCommand):
    help = "Загрузка данных о валютах за дату"

    def add_arguments(self, parser):
        parser.add_argument(
            "-s",
            "--date_start",
            type=str,
            help="Дата начала",
            default=None,
            required=False,
        )
        parser.add_argument(
            "-e",
            "--date_end",
            type=str,
            help="Дата конца",
            default=None,
            required=False,
        )

    def handle(self, *args, **options):
        date_start = options["date_start"]
        date_end = options["date_end"]
        work = LoadСurrency(date_start, date_end)
        work.load_date()


class LoadСurrency:

    _bae_url = "http://www.cbr.ru/scripts/"
    _timeout = 10
    _sleep = 1
    date_end = None
    date_start = None

    def __init__(self, date_start=None, date_end=None):
        tmp_date_start = self._parse_date_actual(date_start)
        if not tmp_date_start:
            tmp_date_start = datetime.date.today()
        self.date_start = tmp_date_start
        if not date_end:
            return
        tmp_date_end = self._parse_date_actual(date_end)

        if not tmp_date_end:
            return
        self.date_end = tmp_date_end
        if self.date_end < self.date_start:
            raise Exception("Ошибка! Начальная дата больше чем конечная")

    @transaction.atomic
    def load_date(self):
        self.__load_currency()
        if self.date_end and self.date_end == self.date_start:
            self.date_action = self.date_start
            self.__load_day()
        elif self.date_end:
            self.__load_rage()
        else:
            self.__load_day()

    def _get_url_rage(self):
        return self._get_url("XML_dynamic.asp")

    def _get_url_dayly(self):
        return self._get_url("XML_daily.asp")

    def _get_url_currency(self):
        return self._get_url("XML_valFull.asp")

    def _get_url(self, method):
        return f"{self._bae_url}{method}"

    def __load_currency(self):
        xml_res, dict_res = self.__load_data(
            self._get_url_currency(), {"d": "0"}
        )
        self._parse_data_currency(dict_res)
        self.currency_list = {
            v.code: {"obj": v, "code": v.rq_code}
            for v in models.Сurrency.objects.all()
        }
        print("parse currency complete")

    def __load_rage(self):
        num_days = (self.date_end - self.date_start).days + 1
        cnt_cur = len(self.currency_list.keys())
        if num_days < cnt_cur:
            print("stratygy: one day - all valute")
            self.__load_days_strategy(num_days)
        else:
            print("stratygy: rage day - one valute")
            self.__load_rage_strategy()

    def __load_rage_strategy(self):
        url = self._get_url_rage()
        for id, cur in self.currency_list.items():
            param = {
                "date_req1": self.date_start.strftime("%d/%m/%Y"),
                "date_req2": self.date_end.strftime("%d/%m/%Y"),
                "VAL_NM_RQ": cur["code"],
            }
            xml_res, dict_res = self.__load_data(url, param)
            if not dict_res or not dict_res["Record"]:
                print(f"{cur['code']} not data")
                continue
            self._parse_data_rage(cur["obj"], dict_res)
            print(f"{cur['code']} rage parse complete")

    def _parse_data_rage(self, currency, data):
        records = data["Record"]
        records.reverse()
        for num, dt in enumerate(records):
            date_rec = self.date_start - datetime.timedelta(days=num)
            val = self._parse_num(dt["Value"])
            if not val:
                print("warring! uncorrect value")
                continue
            models.ExcRates.objects.get_or_create(
                date_status=date_rec,
                currency=currency,
                defaults={"value": val},
            )

    def __load_days_strategy(self, num_days):
        for single_date in (
            self.date_start + timedelta(n) for n in range(num_days)
        ):
            self.__load_day(single_date)

    def __load_day(self, dt_action=None):
        self.date_action = dt_action if dt_action else self.date_start
        url = self._get_url_dayly()
        param = {"date_req": self.date_action.strftime("%d/%m/%Y")}
        xml_res, dict_res = self.__load_data(url, param)
        self._check_date_actual(xml_res)
        self._parse_data_day(dict_res)
        print(f"parse day {self.date_action} complete")

    def __load_data(self, url, param):
        time.sleep(self._sleep)
        xml_res = None
        dict_res = {}
        try:
            res = requests.get(url, params=param, timeout=self._timeout)
            res.raise_for_status()
            xml_res = ET.fromstring(res.content)
            dict_res = self.xml_to_dict(xml_res)
        except Exception as e:
            print(f"err parse url: {str(e)}")
        finally:
            if not dict_res:
                dict_res = None
            return xml_res, dict_res

    def _check_date_actual(self, xml_res):
        self.record_date = self.date_action
        tmp_date = self._parse_date_actual(xml_res.attrib["Date"])
        if tmp_date:
            self.record_date = tmp_date
        if self.record_date != self.date_action:
            print(f"warring! coorect xml date {tmp_date}")

    def _parse_date_actual(self, actual_date, frm="%d.%m.%Y"):
        try:
            return datetime.datetime.strptime(actual_date, frm).date()
        except Exception:
            pass

    def _parse_data_day(self, data):
        for dt in data["Valute"]:
            currency = self._create_valute(dt)
            if not currency:
                continue
            self._create_curse(dt, currency)

    def _parse_data_currency(self, data):
        for dt in data["Item"]:
            self._create_new_valute(dt)

    def _create_curse(self, dt, currency):
        val = self._parse_num(dt["Value"])
        if not val:
            print("warring! uncorrect value")
            return
        models.ExcRates.objects.get_or_create(
            date_status=self.record_date,
            currency=currency,
            defaults={"value": val},
        )

    def _create_new_valute(self, dt):
        if not dt["ISO_Char_Code"]:
            print("err parse currency: not code")
            return
        try:
            models.Сurrency.objects.get_or_create(
                code=dt["ISO_Num_Code"],
                defaults={
                    "name": dt["ISO_Char_Code"],
                    "title": dt["Name"],
                    "rq_code": dt["ParentCode"].strip(),
                },
            )

        except Exception as e:
            print(f"err parse currency: {str(e)}")

    def _create_valute(self, dt):
        code = dt["NumCode"]
        if code in self.currency_list:
            return self.currency_list[code]["obj"]
        valute = None
        try:
            valute = models.Сurrency.objects.create(
                code=dt["NumCode"], name=dt["CharCode"], title=dt["Name"]
            )
        except Exception as e:
            print(f"err create currency: {str(e)} {dt}")
        finally:
            return valute

    def _parse_num(self, data):
        try:
            data = data.replace(",", ".")
            return float(data)
        except Exception:
            pass

    def xml_to_dict(self, element):
        result = {}
        for child in element:
            value = self.xml_to_dict(child) if len(child) else child.text
            key = child.tag
            if key not in result:
                result[key] = value
                continue
            if not isinstance(result[key], list):
                result[key] = [result[key]]
            result[key].append(value)
        return result
