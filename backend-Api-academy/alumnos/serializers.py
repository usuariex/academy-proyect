from rest_framework import serializers
from .models import Alumno, Sexo


class AlumnoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumno
        fields = '__all__'
        read_only_fields = ('alumno_id', 'fecha_registro')



class SexoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='sexo_id', read_only=True)
    nombre = serializers.CharField(source='sexo_nombre')
    class Meta:
        model = Sexo
        fields = ['id', 'nombre']