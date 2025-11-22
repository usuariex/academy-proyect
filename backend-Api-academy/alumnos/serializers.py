from rest_framework import serializers
from .models import Alumno, Sexo


class AlumnoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='alumno_id', read_only=True)   
    class Meta:
        model = Alumno
        fields = ['id', 'nombres', 'nombre_completo', 'fecha_nacimiento', 'sexo', 'email', 'celular', 'estado', 'peso', 'estatura', 'dni', 'activo', 'fecha_registro']


class SexoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='sexo_id', read_only=True)
    nombre = serializers.CharField(source='sexo_nombre')
    class Meta:
        model = Sexo
        fields = ['id', 'nombre']