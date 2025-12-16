
from rest_framework import routers
from .views import (
    EvaluationStatusViewSet,
    ExerciseViewSet,
    EvaluationTypeViewSet,
    TheoryConfigViewSet,
    EvaluationViewSet,
    TheoryEvaluationConfigViewSet,
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

router.register(r'exercises', ExerciseViewSet, basename='exercise')

# listar evaluaciones lista principal crud y resumen
# /api/evaluations/base/{code}/
# /api/evaluations/base/{code}/summary/

# /api/evaluations/{code}/students/
router.register(r'', EvaluationViewSet, basename='evaluation')


urlpatterns = router.urls
