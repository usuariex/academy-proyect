
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/evaluations/', include('evaluations.urls', namespace='evaluations')),
    path('api/students/', include('students.urls', namespace='students')),
    path("reports/", include("reports.urls", namespace="reports")),
    path("api/users/", include("users.urls")),
]
