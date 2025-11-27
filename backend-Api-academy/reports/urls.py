

from django.urls import path
from .views import AcademicReportView

app_name = "reports"

urlpatterns = [
    path("academic/", AcademicReportView.as_view(), name="academic-report"),
]