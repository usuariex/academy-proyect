import rest_framework.serializers as serializers
from academy.settings import UMBRAL_APROBACION
from alumnos.models import Alumno, Sexo, CatEstadoAlum
from .models import CatEstadoEval, Evaluacion, CatEstadoEval, CatTipoEval, Ejercicio, ConfigTeorica, EvaluacionAlumno, SessionFisica, EvalConfigTeorica, Alumno, Sexo
import django.conf as settings


class CatEstadoEvalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='estado_id', read_only=True)
    nombre = serializers.CharField(source='estado_nombre')
    class Meta:
        model = CatEstadoEval
        fields = ['id', 'nombre']


class CatTipoEvalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='tipo_id', read_only=True)
    name = serializers.CharField(source='tipo_nombre')
    class Meta:
        model = CatTipoEval
        fields = ['id', 'name']


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
    typeId = serializers.IntegerField(source='tipo.tipo_id')
    typeId = serializers.PrimaryKeyRelatedField(source='tipo', queryset=CatTipoEval.objects.all())
    typeName = serializers.CharField(source='tipo.tipo_nombre', read_only=True)
    description = serializers.CharField(source='descripcion')
    plannedDate = serializers.DateField(source='fecha_planificada')
    statusId = serializers.PrimaryKeyRelatedField(source='estado', queryset=CatEstadoEval.objects.all())
    statusName = serializers.CharField(source='estado.estado_nombre', read_only=True)
    createdAt = serializers.DateTimeField(source='fecha_creacion', read_only=True)

    class Meta:
        model = Evaluacion
        fields = ['id', 'plannedDate', 'description', 'typeId', 'typeName', 'statusId', 'statusName', 'createdAt']






class EvaluationStudentSerializer(serializers.ModelSerializer):
    studentEvaluationId = serializers.IntegerField(source='evaluacion_alumno_id', read_only=True)
    evaluationId = serializers.CharField(source='evaluacion', read_only=True)
    studentId = serializers.IntegerField(source='alumno.alumno_id', read_only=True)
    names = serializers.CharField(source='alumno.nombres', read_only=True)
    fullName = serializers.CharField(source='alumno.nombre_completo', read_only=True)
    status = serializers.SerializerMethodField()
    finalGrade = serializers.DecimalField(source='calificacion_final', max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = EvaluacionAlumno
        fields = [
            'studentEvaluationId',               
            'evaluationId',      
            'studentId',         
            'names',
            'fullName',
            'finalGrade',
            'status',
        ]

    def get_status(self, obj):
        if obj.calificacion_final is None:
            return "sinCalificar"
        elif obj.calificacion_final < UMBRAL_APROBACION:
            return "desaprobado"
        else:
            return "aprobado"


class EvaluationStudentDetailSerializer(serializers.ModelSerializer):
    studentId = serializers.IntegerField(source='alumno.alumno_id')
    firstName = serializers.CharField(source='alumno.nombres')
    fullName = serializers.CharField(source='alumno.nombre_completo')
    email = serializers.CharField(source='alumno.email')
    phone = serializers.CharField(source='alumno.celular')
    dni = serializers.CharField(source='alumno.dni')
    genderId = serializers.IntegerField(source='alumno.sexo_id')
    stateId = serializers.IntegerField(source='alumno.estado_id')
    status = serializers.SerializerMethodField()
    finalGrade = serializers.DecimalField(source='calificacion_final', max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = EvaluacionAlumno
        fields = [
            'id',               # evaluacion_alumno_id
            'evaluationId',     # evaluacion_id
            'studentId',
            'firstName',
            'fullName',
            'lastName',         # puedes mapear apellido_paterno si lo necesitas
            'email',
            'phone',
            'dni',
            'genderId',
            'stateId',
            'finalGrade',
            'status',
        ]

    def get_status(self, obj):
        if obj.calificacion_final is None:
            return "sinCalificar"
        elif obj.calificacion_final < settings.UMBRAL_APROBACION:
            return "desaprobado"
        else:
            return "aprobado"



class SessionPhysicalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='session_id', read_only=True)
    evaluationId = serializers.PrimaryKeyRelatedField(source='evaluacion', queryset=Evaluacion.objects.all())
    realizationDate = serializers.DateField(source='fecha_realizacion', allow_null=True, required=False)
    place = serializers.CharField(source='lugar', allow_blank=True, allow_null=True)

    class Meta:
        model = SessionFisica
        fields = [
            'id',
            'evaluationId',
            'realizationDate',
            'place',
        ]


class EvaluationConfigTheorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='evaluacion_config_id', read_only=True)
    evaluationId = serializers.PrimaryKeyRelatedField(source='evaluacion', queryset=Evaluacion.objects.all())
    configId = serializers.PrimaryKeyRelatedField(source='config', queryset=ConfigTeorica.objects.all())

    class Meta:
        model = EvalConfigTeorica
        fields = ['id', 'evaluationId', 'configId']

