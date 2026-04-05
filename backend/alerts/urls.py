from django.urls import path
from .views import CreateAlertView, ListAlertsView

urlpatterns = [
    path('', CreateAlertView.as_view(), name='create-alert'),
    path('<str:code>/', ListAlertsView.as_view(), name='list-alerts'),
]
