
from rest_framework.decorators import action
from rest_framework.response import Response
from statistics import mean, median
from rest_framework import viewsets
from academy.settings import UMBRAL_APROBACION
from .models import CatEstadoEval, EvaluacionTeorica, CatTipoEval, Ejercicio, ConfigTeorica, Evaluacion, EvaluacionAlumno,  EvalConfigTeorica, EvaluacionFisica
from .serializers import CatEstadoEvalSerializer, EvaluationTeoricaSerializer, CatTipoEvalSerializer, EjercicioSerializer, ConfigTeoricaSerializer,  EvaluationStudentSerializer, EvaluationStudentDetailSerializer, EvaluationConfigTheorySerializer, EvaluationSerializer, EvaluationFisicaSerializer
from rest_framework import permissions
from rest_framework.pagination import PageNumberPagination


class CatEstadoEvalViewSet(viewsets.ModelViewSet):
    queryset = CatEstadoEval.objects.all()
    serializer_class = CatEstadoEvalSerializer


class CatTipoEvalViewSet(viewsets.ModelViewSet):
    queryset = CatTipoEval.objects.all()
    serializer_class = CatTipoEvalSerializer


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer


class ConfigTeoricaViewSet(viewsets.ModelViewSet):
    queryset = ConfigTeorica.objects.all()
    serializer_class = ConfigTeoricaSerializer


class EvaluationStudentPagination(PageNumberPagination):
    page_size_query_param = 'limit'
    page_query_param = 'page'
    page_size = 100


class EvaluationStudentDetailViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    pagination_class = EvaluationStudentPagination

    def get_queryset(self):
        evaluation_id = self.request.query_params.get('evaluationId')
        filter_param = self.request.query_params.get('filter', 'all')
        search = self.request.query_params.get('search', '')

        qs = EvaluacionAlumno.objects.select_related('alumno', 'evaluacion')

        if evaluation_id:
            qs = qs.filter(evaluacion_id=int(evaluation_id))

        if filter_param == 'sinCalificar':
            qs = qs.filter(calificacion_final__isnull=True)
        elif filter_param == 'calificados':
            qs = qs.filter(calificacion_final__isnull=False)
        elif filter_param == 'desaprobados':
            qs = qs.filter(calificacion_final__lt=UMBRAL_APROBACION)
        elif filter_param == 'aprobados':
            qs = qs.filter(calificacion_final__gte=UMBRAL_APROBACION)

        if search:
            qs = qs.filter(alumno__nombres__icontains=search)

        return qs.order_by('alumno__nombres')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EvaluationStudentSerializer
            """ return EvaluationStudentDetailSerializer """
        return EvaluationStudentSerializer


class EvaluationConfigTheoryViewSet(viewsets.ModelViewSet):
    queryset = EvalConfigTeorica.objects.all()
    serializer_class = EvaluationConfigTheorySerializer


# -------------------------------------------------------------------------------------------------
class EvaluationStudentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EvaluationStudentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        evaluation_id = self.request.query_params.get('evaluationId')
        qs = EvaluacionAlumno.objects.select_related('evaluacion', 'alumno')
        if evaluation_id:
            qs = qs.filter(evaluacion_id=evaluation_id)
        return qs


class EvaluacionesViewSet(viewsets.ModelViewSet):
    queryset = Evaluacion.objects.all()
    queryset = Evaluacion.objects.select_related('tipo', 'estado')
    serializer_class = EvaluationSerializer


# ""#$""


class EvaluationTeoricaViewSet(viewsets.ModelViewSet):
    queryset = EvaluacionTeorica.objects.select_related('evaluacion_alumno')
    serializer_class = EvaluationTeoricaSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        student_eval_id = self.request.query_params.get('studentEvaluationId')
        qs = super().get_queryset()
        if student_eval_id:
            qs = qs.filter(evaluacion_alumno_id=student_eval_id)
        return qs


class EvaluationFisicaViewSet(viewsets.ModelViewSet):
    queryset = EvaluacionFisica.objects.select_related(
        'evaluacion_alumno', 'ejercicio')
    serializer_class = EvaluationFisicaSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        student_eval_id = self.request.query_params.get('studentEvaluationId')
        qs = super().get_queryset()
        if student_eval_id:
            qs = qs.filter(evaluacion_alumno_id=student_eval_id)
        return qs


{
    "id": 77,
    "code": "2025-1205-EFI-000001",
    "name": "2025-1205-EFI-01",
    "description": "prueva 1",
    "typeId": 1,
    "typeName": "Fisica",
    "statusId": 3,
    "statusName": "Completada",
    "createdAt": "2025-12-05T06:50:40.776843Z",
    "plannedDate": "2025-12-23"
}


class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluacion.objects.select_related('tipo', 'estado')
    serializer_class = EvaluationSerializer

    @action(detail=True, methods=['get'], url_path='resumen')
    def resumen(self, request, pk=None):
        evaluacion = self.get_object()
        alumnos = EvaluacionAlumno.objects.filter(evaluacion_id=pk)

        # recolectar calificaciones según tipo
        calificaciones = []
        for a in alumnos:
            if evaluacion.tipo.tipo_nombre == "Teorica":
                nota = EvaluacionTeorica.objects.filter(
                    evaluacion_alumno=a
                ).values_list('calificacion', flat=True).first()
            elif evaluacion.tipo.tipo_nombre == "Fisica":
                nota = EvaluacionFisica.objects.filter(
                    evaluacion_alumno=a
                ).values_list('calificacion', flat=True).first()
            else:
                nota = None
            if nota is not None:
                calificaciones.append(float(nota))

        # métricas básicas
        total = alumnos.count()
        aprobados = sum(1 for a in alumnos if a.get_status() == "aprobado")
        desaprobados = sum(
            1 for a in alumnos if a.get_status() == "desaprobado")
        sin_calificar = sum(
            1 for a in alumnos if a.get_status() == "sinCalificar")

        # distribución de notas
        grade_distribution = {
            "0-10": sum(1 for g in calificaciones if g <= 10),
            "11-15": sum(1 for g in calificaciones if 11 <= g <= 15),
            "16-20": sum(1 for g in calificaciones if g >= 16),
        }

        # distribución de estados en porcentaje
        status_distribution = {
            "approved": round((aprobados / total) * 100, 2) if total else 0,
            "failed": round((desaprobados / total) * 100, 2) if total else 0,
            "ungraded": round((sin_calificar / total) * 100, 2) if total else 0,
        }

        return Response({
            "evaluationId": evaluacion.evaluacion_id,
            "evaluationName": evaluacion.nombre,
            "evaluationType": evaluacion.tipo.tipo_nombre,
            "plannedDate": evaluacion.fecha_planificada,
            "statusName": evaluacion.estado.estado_nombre,
            "totalStudents": total,
            "approved": aprobados,
            "failed": desaprobados,
            "ungraded": sin_calificar,
            "averageGrade": mean(calificaciones) if calificaciones else None,
            "maxGrade": max(calificaciones) if calificaciones else None,
            "minGrade": min(calificaciones) if calificaciones else None,
            "medianGrade": median(calificaciones) if calificaciones else None,
            "gradeDistribution": grade_distribution,
            "statusDistribution": status_distribution,
        })
