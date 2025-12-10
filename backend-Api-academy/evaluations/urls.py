

from rest_framework import routers
from .views import (
    EvaluationStatusViewSet,
    ExerciseViewSet,
    EvaluationTypeViewSet,
    TheoryConfigViewSet,
    EvaluationViewSet,
    TheoryEvaluationConfigViewSet,
    EvaluationStudentViewSet,
    TheoryEvaluationViewSet,
    PhysicalEvaluationViewSet
)

app_name = 'evaluations'

router = routers.DefaultRouter()
router.register(r'status', EvaluationStatusViewSet,
                basename='evaluation-status')
router.register(r'types', EvaluationTypeViewSet, basename='evaluation-type')
router.register(r'config', TheoryEvaluationConfigViewSet,
                basename='theory-evaluation-config')

router.register(r'theory-config', TheoryConfigViewSet,
                basename='theory-config')


# PATCH http://127.0.0.1:8000/api/evaluations/theory/update-by-student/
router.register(r'theory', TheoryEvaluationViewSet,
                basename='theory-evaluation')
router.register(r'physical', PhysicalEvaluationViewSet,
                basename='physical-evaluation')


# listar evaluaciones lista principal crud y resumen
# /api/evaluations/554541/
# GET /api/evaluations/<id>/summary/
router.register(r'base', EvaluationViewSet, basename='evaluation')

router.register(r'exercises', ExerciseViewSet, basename='exercise')

router.register(r'', EvaluationStudentViewSet,
                basename='evaluation-student')


urlpatterns = router.urls
