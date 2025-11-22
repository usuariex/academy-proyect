from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from academy.settings import UMBRAL_APROBACION
from .models import CatEstadoEval, CatTipoEval, Ejercicio, ConfigTeorica, Evaluacion, EvaluacionAlumno
from .serializers import CatEstadoEvalSerializer, CatTipoEvalSerializer, EjercicioSerializer, ConfigTeoricaSerializer, EvaluacionSerializer, EvaluacionAlumnoDetailSerializer, EvaluacionAlumnoSerializer
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


class EvaluacionAlumnoPagination(PageNumberPagination):
    page_size_query_param = 'limit'
    page_query_param = 'page'
    page_size = 100




class EvaluacionAlumnoDetailViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    pagination_class = EvaluacionAlumnoPagination

    def get_queryset(self):
        evaluacion_id = self.request.query_params.get('evaluacionId')
        filtro = self.request.query_params.get('filtro', 'todos')
        search = self.request.query_params.get('search', '')

        qs = EvaluacionAlumno.objects.select_related('alumno', 'evaluacion')

        if evaluacion_id:
            qs = qs.filter(evaluacion_id=int(evaluacion_id))

        if filtro == 'sinCalificar':
            qs = qs.filter(calificacion_final__isnull=True)
        elif filtro == 'calificados':
            qs = qs.filter(calificacion_final__isnull=False)
        elif filtro == 'desaprobados':
            qs = qs.filter(calificacion_final__lt=UMBRAL_APROBACION)
        elif filtro == 'aprobados':
            qs = qs.filter(calificacion_final__gte=UMBRAL_APROBACION)

        if search:
            qs = qs.filter(alumno__nombre__icontains=search)

        return qs.order_by('alumno__nombres')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EvaluacionAlumnoDetailSerializer
        return EvaluacionAlumnoSerializer


