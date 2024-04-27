from project.celery import app
from project.management.commands.load_currency import LoadСurrency


@app.task
def load_data() -> None:
    """Задача для обновления данных

    Загружает данные по валютам на текущую дату

    Parameters
    ----------

    Returns
    -------

    """
    work = LoadСurrency()
    work.load_date()


@app.task
def load_data_web(date_start: str, date_end: str) -> None:
    """Задача для обновления данных

    Загружает данные по валютам на указанный диапазон дат

    Parameters
    ----------
        date_start: str
            дата начала
        date_end: str
            дата конца
    Returns
    -------

    """
    work = LoadСurrency(date_start, date_end)
    work.load_date()
