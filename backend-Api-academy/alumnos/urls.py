from rest_framework import routers
from .views import StudentQueryViewSet, SexoViewSet, StudentViewSet, StudentProfileViewSet

app_name = 'alumnos'

router = routers.DefaultRouter()
router.register(r'filtrar', StudentQueryViewSet, basename='alumnos')
router.register(r'sexos', SexoViewSet, basename='sexos')
router.register(r'perfiles', StudentProfileViewSet, basename='perfiles')
router.register(r'', StudentViewSet, basename='alumnos-crud')

urlpatterns = router.urls
