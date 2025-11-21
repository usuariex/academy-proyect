from rest_framework import routers
from .views import CatEstadoEvalViewSet, EjercicioViewSet, CatTipoEvalViewSet, ConfigTeoricaViewSet, EvaluacionesViewSet

app_name = 'evaluaciones'

router = routers.DefaultRouter()

router.register(r'evaluaciones/estados', CatEstadoEvalViewSet, basename='evaluaciones_estados')
router.register(r'evaluaciones/tipos', CatTipoEvalViewSet, basename='evaluaciones_tipos')
router.register(r'config-teorica', ConfigTeoricaViewSet, basename='config-teorica')
router.register(r'ejercicios', EjercicioViewSet, basename='ejercicios')
router.register(r'evaluaciones', EvaluacionesViewSet, basename='evaluaciones')

urlpatterns = router.urls
