from django.urls import include, path
from rest_framework import routers

from . import views, views_task

router = routers.DefaultRouter()
router.register(r"exc-rates", views.ExcRatesViewSet)

urlpatterns = [
    path(r"get-valute-curs/", views_task.GetCurencyData.as_view()),
    path(r"create-tasc/", views_task.CreateTascLoadData.as_view()),
    path("", include(router.urls)),
]
