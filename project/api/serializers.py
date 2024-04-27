from rest_framework import serializers

from project import models


class СurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Сurrency
        fields = "__all__"


class ExcRatesSerializer(serializers.HyperlinkedModelSerializer):
    # currency = СurrencySerializer(many=False, read_only=True)
    currency = serializers.StringRelatedField(many=False, read_only=True)

    class Meta:
        model = models.ExcRates
        fields = ["gid", "currency", "value", "date_status"]
