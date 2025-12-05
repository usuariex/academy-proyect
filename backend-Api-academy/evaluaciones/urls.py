

from rest_framework import routers
from .views import (
    CatEstadoEvalViewSet,
    ExerciseViewSet,
    CatTipoEvalViewSet,
    ConfigTeoricaViewSet,
    EvaluationViewSet,
    EvaluationStudentDetailViewSet,
    EvaluationConfigTheoryViewSet,
    EvaluationStudentViewSet,
    EvaluationTeoricaViewSet,
    EvaluationFisicaViewSet
)

app_name = 'evaluaciones'

router = routers.DefaultRouter()
router.register(r'estados', CatEstadoEvalViewSet, basename='evaluaciones_estados')
router.register(r'tipos', CatTipoEvalViewSet, basename='evaluaciones_tipos')
router.register(r'config-teorica', ConfigTeoricaViewSet, basename='config_teorica')
router.register(r'ejercicios', ExerciseViewSet, basename='ejercicios')
router.register(r'alumnos/info', EvaluationStudentDetailViewSet, basename='evaluaciones_alumnos_informacion')
router.register(r'configuracion', EvaluationConfigTheoryViewSet, basename='evaluaciones_config')
router.register(r'alumnos/admin', EvaluationStudentViewSet, basename='alumnos_crud')        #GET /api/evaluaciones/alumnos/?evaluationId=5
router.register(r'teoricas', EvaluationTeoricaViewSet, basename='evaluaciones-teoricas')   ### /api/evaluaciones/teoricas/?studentEvaluationId=123
router.register(r'fisicas', EvaluationFisicaViewSet, basename='evaluaciones-fisicas')      ## /api/evaluaciones/fisicas/?studentEvaluationId=123
router.register(r'', EvaluationViewSet, basename='evaluaciones')                           #  http://127.0.0.1:8000/api/evaluaciones/1/resumen/

urlpatterns = router.urls
