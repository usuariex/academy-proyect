from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from academy.settings import UMBRAL_APROBACION
from .models import CatEstadoEval, CatTipoEval, Ejercicio, ConfigTeorica, Evaluacion, EvaluacionAlumno, SessionFisica, EvalConfigTeorica
from .serializers import CatEstadoEvalSerializer, CatTipoEvalSerializer, EjercicioSerializer, ConfigTeoricaSerializer, SessionPhysicalSerializer, EvaluacionSerializer, EvaluationStudentSerializer, EvaluationStudentDetailSerializer, EvaluationConfigTheorySerializer
from rest_framework import permissions
from rest_framework.pagination import PageNumberPagination


class CatEstadoEvalViewSet(viewsets.ModelViewSet):
    queryset = CatEstadoEval.objects.all()
    serializer_class = CatEstadoEvalSerializer


class CatTipoEvalViewSet(viewsets.ModelViewSet):                   
    queryset = CatTipoEval.objects.all()
    serializer_class = CatTipoEvalSerializer


class EjercicioViewSet(viewsets.ModelViewSet):
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer


class ConfigTeoricaViewSet(viewsets.ModelViewSet):
    queryset = ConfigTeorica.objects.all()
    serializer_class = ConfigTeoricaSerializer


class EvaluacionesViewSet(viewsets.ModelViewSet):
    queryset = Evaluacion.objects.all()
    serializer_class = EvaluacionSerializer


class EvaluationAlumnoViewSet(viewsets.ModelViewSet):
    queryset = EvaluacionAlumno.objects.all()
    serializer_class = EvaluationStudentSerializer


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
            return EvaluationStudentDetailSerializer
        return EvaluationStudentSerializer



class SessionPhysicalViewSet(viewsets.ModelViewSet):
    queryset = SessionFisica.objects.all()
    serializer_class = SessionPhysicalSerializer


class EvaluationConfigTheoryViewSet(viewsets.ModelViewSet):
    queryset = EvalConfigTeorica.objects.all()
    serializer_class = EvaluationConfigTheorySerializer