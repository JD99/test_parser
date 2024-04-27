from django.db import models


class ExcRates(models.Model):
    gid = models.AutoField(primary_key=True)
    value = models.FloatField()
    date_status = models.DateField()
    currency = models.ForeignKey(
        "Сurrency",
        models.DO_NOTHING,
    )

    class Meta:
        db_table = "exc_rates"
        verbose_name = "Курс валюты"
        verbose_name_plural = "Курсы валют"

    def __str__(self) -> str:
        return self.currency


class Сurrency(models.Model):
    gid = models.AutoField(primary_key=True)
    name = models.CharField(max_length=250)
    title = models.CharField(max_length=250)
    code = models.CharField(max_length=250)
    rq_code = models.CharField(max_length=250)

    class Meta:
        db_table = "currency"
        verbose_name = "Валюта"
        verbose_name_plural = "Валюты"

    def __str__(self) -> str:
        return self.title
