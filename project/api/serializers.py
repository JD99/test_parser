from django_filters import filters
from rest_framework import serializers
from rest_framework_datatables.django_filters.filterset import (
    DatatablesFilterSet,
)

from project import models


class ExcRatesSerializer(serializers.HyperlinkedModelSerializer):
    """Сериализатор курса валют

    Attributes
    ----------

    Methods
    -------

    """

    currency = serializers.StringRelatedField(many=False, read_only=True)
    currency__pk = serializers.SerializerMethodField()
    date_status = serializers.DateField(format="%d.%m.%Y")

    def get_currency__pk(self, obj):
        return obj.currency.pk

    class Meta:
        model = models.ExcRates
        fields = ["gid", "currency", "currency__pk", "value", "date_status"]


class ExcRatesFilter(DatatablesFilterSet):
    """Сериализатор фильтра курса валют

    Attributes
    ----------

    Methods
    -------

    """

    currency = filters.NumberFilter(lookup_expr="exact")
    date_status = filters.DateFilter()

    class Meta:
        model = models.ExcRates
        fields = "__all__"
