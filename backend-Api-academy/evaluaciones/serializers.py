import rest_framework.serializers as serializers
from academy.settings import UMBRAL_APROBACION
from .models import CatEstadoEval, Evaluacion, CatEstadoEval, CatTipoEval, Ejercicio, ConfigTeorica, EvaluacionAlumno
import django.conf as settings


class CatEstadoEvalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='estado_id', read_only=True)
    nombre = serializers.CharField(source='estado_nombre')
    class Meta:
        model = CatEstadoEval
        fields = ['id', 'nombre']


class CatTipoEvalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='tipo_id', read_only=True)
    nombre = serializers.CharField(source='tipo_nombre')
    class Meta:
        model = CatTipoEval
        fields = '__all__'


class EjercicioSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='ejercicio_id', read_only=True)
    nombre = serializers.CharField(source='ejercicio_nombre')
    class Meta:
        model = Ejercicio
        fields = '__all__'

class ConfigTeoricaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='config_id', read_only=True)
    nombre = serializers.CharField(source='config_nombre')
    class Meta:
        model = ConfigTeorica
        fields = '__all__'

class EvaluacionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='evaluacion_id', read_only=True)
    class Meta:
        model = Evaluacion
        fields = 'id', 'fecha_planificada', 'descripcion', 'tipo', 'estado'



class EvaluacionAlumnoSerializer(serializers.ModelSerializer):

    nombres = serializers.CharField(source='alumno.nombres', read_only=True)
    estado = serializers.SerializerMethodField()
    nombre_completo = serializers.CharField(source='alumno.nombre_completo')

    class Meta:
        model = EvaluacionAlumno
        fields = [
            'evaluacion_alumno_id',
            'evaluacion_id',
            'alumno_id',
            'nombres',
            'nombre_completo',
            'calificacion_final',
            'estado'
        ]


    def get_estado(self, obj):
       
        if obj.calificacion_final is None:
            return "sinCalificar"
        elif obj.calificacion_final < UMBRAL_APROBACION:
            return "desaprobado"
        else:
            return "aprobado"



class EvaluacionAlumnoDetailSerializer(serializers.ModelSerializer):
    alumno_id = serializers.IntegerField(source='alumno.alumno_id')
    nombres = serializers.CharField(source='alumno.nombres')
    nombre_completo = serializers.CharField(source='alumno.nombre_completo')
    email = serializers.CharField(source='alumno.email')
    celular = serializers.CharField(source='alumno.celular')
    dni = serializers.CharField(source='alumno.dni')
    sexo = serializers.IntegerField(source='alumno.sexo_id')
    estado_id = serializers.IntegerField(source='alumno.estado_id')
    estado = serializers.SerializerMethodField()

    class Meta:
        model = EvaluacionAlumno
        fields = [
            'evaluacion_alumno_id',
            'evaluacion_id',
            'alumno_id',
            'nombres',
            'nombre_completo',
            'apellido',
            'email',
            'celular',
            'dni',
            'sexo',
            'estado_id',
            'calificacion_final',
            'estado',
        ]

    def get_estado(self, obj):
        if obj.calificacion_final is None:
            return "sinCalificar"
        elif obj.calificacion_final < settings.UMBRAL_APROBACION:
            return "desaprobado"
        else:
            return "aprobado"

