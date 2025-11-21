from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import CatEstadoEval, CatTipoEval, Ejercicio, ConfigTeorica, Evaluacion
from .serializers import CatEstadoEvalSerializer, CatTipoEvalSerializer, EjercicioSerializer, ConfigTeoricaSerializer, EvaluacionSerializer

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