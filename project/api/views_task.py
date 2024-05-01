import datetime
from typing import Optional

from django.forms.models import model_to_dict
from django.http import HttpRequest, JsonResponse
from django.views.generic import View

from project import models, tasks


class BaseCustom(View):
    """Базовый класс с общими методами

    Attributes
    ----------

    Methods
    -------
    parse_date_format()
        парсинг даты из строки, возвращает сроку
    parse_date()
        парсинг даты из строки, возвращает дату
    """

    def parse_date_format(self, dt: str) -> Optional[str]:
        """Метод для конвертации даты

        Parameters
        ----------
        dt: str
            дата

        Returns
        -------
        str
            дата строкой в формате
        """
        try:
            return (
                datetime.datetime.strptime(dt, "%Y-%m-%d")
                .date()
                .strftime("%d.%m.%Y")
            )
        except Exception:
            pass

    def parse_date(self, dt: str) -> Optional[str]:
        """Метод для конвертации даты

        Parameters
        ----------
        dt: str
            дата

        Returns
        -------
        str
            дата строкой в формате
        """
        try:
            return datetime.datetime.strptime(dt, "%Y-%m-%d").date()
        except Exception:
            pass


class GetCurencyData(BaseCustom):
    """Класс для запуска задач

    Attributes
    ----------

    Methods
    -------
    post()
        проверка параметрв, запуск задачи на загрузку данных

    """

    def get(
        self, request: HttpRequest, *args: dict, **kwargs: dict
    ) -> JsonResponse:
        """Метод для отправки данных о валютах

        Parameters
        ----------
        request: HttpRequest
            объект запроса

        Returns
        -------
        JsonResponse
            json с данными
        """
        pk = request.GET.get("currency")
        date_start = self.parse_date(request.GET.get("date_start"))
        date_end = self.parse_date(request.GET.get("date_end"))
        if not pk or not pk.isdigit() or not date_start or not date_end:
            return JsonResponse(
                {"status": False, "msg": "Ошибка входных параметров"}
            )

        cur = models.Сurrency.objects.filter(pk=pk).first()
        if not cur:
            return JsonResponse({"status": False, "msg": "Валюта не найдена"})
        data = cur.currency.filter(
            date_status__range=(date_start, date_end)
        ).order_by("date_status")
        res = [{"date": val.date_status, "value": val.value} for val in data]
        return JsonResponse(
            {"status": True, "data": res, "info": model_to_dict(cur)}
        )


class CreateTascLoadData(BaseCustom):
    """Класс для запуска задач

    Attributes
    ----------

    Methods
    -------
    post()
        проверка параметрв, запуск задачи на загрузку данных

    """

    def post(
        self, request: HttpRequest, *args: dict, **kwargs: dict
    ) -> JsonResponse:
        """Запуск задачи

        Parameters
        ----------
        request: HttpRequest
            объект запроса клиента

        Returns
        -------
        HttpResponse
            объект ответа сервера, json
        """
        date_start = self.parse_date_format(request.POST.get("date_start"))
        date_end = self.parse_date_format(request.POST.get("date_end"))
        if not date_start or not date_end:
            return JsonResponse(
                {"status": False, "msg": "Не указан диапазон дат"}
            )

        res = {"status": True}
        try:
            tasks.load_data_web.delay(date_start, date_end)
        except Exception as e:
            print(f"err: {str(e)}")
            res = {
                "status": False,
                "msg": "Ошибка при выполнении. Обратитесь к администратору",
            }
        finally:
            return JsonResponse(res)
