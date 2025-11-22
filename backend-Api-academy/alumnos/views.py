

from rest_framework import viewsets, permissions
from .models import Alumno,Sexo
from .serializers import AlumnoSerializer, SexoSerializer
from rest_framework.decorators import action
from rest_framework.response import Response




class AlumnoCRUDViewSet(viewsets.ModelViewSet):
    queryset = Alumno.objects.all()
    permission_classes = [permissions.AllowAny]  
    serializer_class = AlumnoSerializer



class AlumnoConsultaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AlumnoSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        evaluacion_id = self.request.query_params.get('evaluacionId')
        filtro = self.request.query_params.get('filtro', 'todos')
        search = self.request.query_params.get('search', '')

        qs = Alumno.objects.all()
        if evaluacion_id:
            qs = qs.filter(evaluacion_id=evaluacion_id)

        if filtro == 'sinCalificar':
            qs = qs.filter(nota__isnull=True)
        elif filtro == 'calificados':
            qs = qs.filter(nota__isnull=False)
        elif filtro == 'desaprobados':
            qs = qs.filter(nota__lt=11)

        if search:
            qs = qs.filter(nombres__icontains=search)

        return qs

    @action(detail=False, methods=['get'])
    def metricas(self, request):
        evaluacion_id = request.query_params.get('evaluacionId')
        alumnos = Alumno.objects.filter(evaluacion_id=evaluacion_id)

        return Response({
            "sinCalificar": alumnos.filter(nota__isnull=True).count(),
            "calificados": alumnos.filter(nota__isnull=False).count(),
            "desaprobados": alumnos.filter(nota__lt=11).count()
        })





class SexoViewSet(viewsets.ModelViewSet):
    queryset = Sexo.objects.all()
    serializer_class = SexoSerializer



