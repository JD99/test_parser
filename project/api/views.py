from rest_framework import viewsets
from rest_framework_datatables.django_filters.backends import (
    DatatablesFilterBackend,
)

from project import models

from .serializers import ExcRatesFilter, ExcRatesSerializer


class ExcRatesViewSet(viewsets.ModelViewSet):
    """Класс для отображения сериализатора

    Attributes
    ----------

    Methods
    -------

    """

    queryset = models.ExcRates.objects.all().order_by("-date_status")
    serializer_class = ExcRatesSerializer
    filter_backends = (DatatablesFilterBackend,)
    filterset_class = ExcRatesFilter
