

from rest_framework import routers
from .views import (
    CatEstadoEvalViewSet,
    EjercicioViewSet,
    CatTipoEvalViewSet,
    ConfigTeoricaViewSet,
    EvaluacionesViewSet,
    EvaluacionAlumnoDetailViewSet,
)

app_name = 'evaluaciones'

router = routers.DefaultRouter()
router.register(r'estados', CatEstadoEvalViewSet, basename='evaluaciones_estados')
router.register(r'tipos', CatTipoEvalViewSet, basename='evaluaciones_tipos')
router.register(r'config-teorica', ConfigTeoricaViewSet, basename='config_teorica')
router.register(r'ejercicios', EjercicioViewSet, basename='ejercicios')
router.register(r'alumnos', EvaluacionAlumnoDetailViewSet, basename='evaluaciones_alumnos')
router.register(r'', EvaluacionesViewSet, basename='evaluaciones')

urlpatterns = router.urls
