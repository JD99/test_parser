from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.generic import View

from . import forms


class MainPaigeView(View):
    """Класс для отображения главной страницы

    Attributes
    ----------

    Methods
    -------
    get()
        Отрисовка шаблона страницы

    """

    def get(self, request: HttpRequest, *args, **kwargs) -> HttpResponse:
        """Страница отображения списка валют

        Parameters
        ----------
        request: HttpRequest
            объект запроса клиента

        Returns
        -------
        HttpResponse
            объект ответа сервера, html страница
        """
        return render(
            request, "main.page.html", {"form_currency": forms.FormFilterMain}
        )
