from rest_framework import routers
from .views import AlumnoConsultaViewSet, SexoViewSet, AlumnoCRUDViewSet

app_name = 'alumnos'

router = routers.DefaultRouter()
router.register(r'alumnos', AlumnoConsultaViewSet, basename='alumnos')
router.register(r'alumnos-adm', AlumnoCRUDViewSet, basename='alumnos-admin')
router.register(r'sexos', SexoViewSet, basename='sexos')

urlpatterns = router.urls
