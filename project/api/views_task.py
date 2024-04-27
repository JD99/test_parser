import datetime

from django.http import HttpRequest, JsonResponse
from django.views.generic import View

from project import tasks


class CreateTascLoadData(View):
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
        date_start = self.__parse_date(request.POST.get("date_start"))
        date_end = self.__parse_date(request.POST.get("date_end"))
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

    def __parse_date(self, dt: str) -> str:
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
