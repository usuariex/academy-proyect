from rest_framework import viewsets, permissions
from .models import Student, Gender
from .serializers import StudentSerializer, GenderSerializer, StudentDetailSerializer
from rest_framework.decorators import action
from rest_framework.response import Response


class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = StudentSerializer
    lookup_field = "uuid"
    lookup_url_kwarg = "uuid"

    def get_queryset(self):
        queryset = Student.objects.all()
        is_active = self.request.query_params.get('isActive')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset


class StudentQueryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        evaluacion_id = self.request.query_params.get('evaluacionId')
        filtro = self.request.query_params.get('filtro', 'todos')
        search = self.request.query_params.get('search', '')

        qs = Student.objects.all()
        if evaluacion_id:
            qs = qs.filter(evaluacion_id=evaluacion_id)

        if filtro == 'sinCalificar':
            qs = qs.filter(nota__isnull=True)
        elif filtro == 'calificados':
            qs = qs.filter(nota__isnull=False)
        elif filtro == 'desaprobados':
            qs = qs.filter(nota__lt=11)

        if search:
            qs = qs.filter(first_name__icontains=search)

        return qs

    @action(detail=False, methods=['get'])
    def metricas(self, request):
        evaluacion_id = request.query_params.get('evaluacionId')
        students = Student.objects.filter(evaluacion_id=evaluacion_id)

        return Response({
            "sinCalificar": students.filter(nota__isnull=True).count(),
            "calificados": students.filter(nota__isnull=False).count(),
            "desaprobados": students.filter(nota__lt=11).count()
        })


class GenderViewSet(viewsets.ModelViewSet):
    queryset = Gender.objects.all()
    serializer_class = GenderSerializer


class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentDetailSerializer
    lookup_field = "uuid"
    lookup_url_kwarg = "uuid"
