from rest_framework import viewsets

from project import models

from .serializers import ExcRatesSerializer


class ExcRatesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = models.ExcRates.objects.all().order_by("-date_status")
    serializer_class = ExcRatesSerializer
