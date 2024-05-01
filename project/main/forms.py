from django import forms
from django_select2 import forms as select2_forms

from project import models


class ModelSelect2Widget(select2_forms.ModelSelect2Widget):
    """Класс для фильрации данных select2"""

    def build_attrs(self, *args, **kwargs) -> dict:
        """Метод для формирования атрибутов

        Наводим красоту, ставим тему, и ограничения

        Returns
        -------
        dict
            набор атрибутов элемента
        """
        attrs = super().build_attrs(*args, **kwargs)
        attrs["data-minimum-input-length"] = 0
        attrs["data-allow-clear"] = "true"
        attrs["data-placeholder"] = ""
        attrs["data-theme"] = "bootstrap-5"
        attrs["autocomplete"] = "off"
        attrs["data-language"] = "ru"
        attrs["lang"] = "ru"
        attrs["data-ajax--delay"] = 1500
        return attrs


class FormFilterMain(forms.Form):

    currency = forms.ModelChoiceField(
        required=False,
        label="Валюта",
        empty_label="не выбрано",
        queryset=models.Сurrency.objects.all().order_by("title"),
        widget=ModelSelect2Widget(
            queryset=models.Сurrency.objects.all().order_by("title"),
            model=models.Сurrency,
            search_fields=["title__icontains"],
        ),
    )

    date_status = forms.DateField(
        required=False,
        label="Дата",
        widget=forms.DateInput(
            attrs={
                "autocomplete": "off",
                "data-type": "date",
            }
        ),
    )
    currency_chart = forms.ModelChoiceField(
        required=False,
        label="Валюта",
        empty_label="не выбрано",
        queryset=models.Сurrency.objects.all().order_by("title"),
        widget=ModelSelect2Widget(
            queryset=models.Сurrency.objects.all().order_by("title"),
            model=models.Сurrency,
            search_fields=["title__icontains"],
        ),
    )
