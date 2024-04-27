from django.urls import path

from . import views

urlpatterns = [
    path(r"", views.MainPaigeView.as_view()),
]
