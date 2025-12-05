import rest_framework.serializers as serializers
from academy.settings import UMBRAL_APROBACION
from datetime import date
from .models import CatEstadoEval, SecuenciaEvaluacion, EvaluacionFisica, EvaluacionTeorica, Evaluacion, CatEstadoEval, CatTipoEval, Ejercicio, ConfigTeorica, EvaluacionAlumno, EvalConfigTeorica
import django.conf as settings
from django.db.models import Max
import re
from django.db import transaction


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


class EvaluationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='evaluacion_id', read_only=True)
    code = serializers.CharField(source='codigo_evaluacion', read_only=True)
    name = serializers.CharField(source='nombre', read_only=True)
    typeId = serializers.PrimaryKeyRelatedField(
        source='tipo', queryset=CatTipoEval.objects.all()
    )
    typeName = serializers.CharField(source='tipo.tipo_nombre', read_only=True)
    description = serializers.CharField(source='descripcion')
    plannedDate = serializers.DateField(source='fecha_planificada')
    statusId = serializers.PrimaryKeyRelatedField(
        source='estado', queryset=CatEstadoEval.objects.all()
    )
    statusName = serializers.CharField(
        source='estado.estado_nombre', read_only=True
    )
    createdAt = serializers.DateTimeField(
        source='fecha_creacion', read_only=True
    )

    class Meta:
        model = Evaluacion
        fields = [
            'id', 'code', 'name', 'description',
            'typeId', 'typeName', 'statusId', 'statusName',
            'createdAt', 'plannedDate'
        ]

    @transaction.atomic
    def create(self, validated_data):
        tipo = validated_data["tipo"]
        hoy = date.today()
        fecha_str = hoy.strftime("%Y-%m%d")  # ejemplo: 2025-1205

        # --- Sufijo por tipo ---
        tipo_nombre = tipo.tipo_nombre.strip().lower()
        if "fisica" in tipo_nombre:
            sufijo = "EFI"
        elif "teorica" in tipo_nombre:
            sufijo = "ETE"
        else:
            sufijo = "GEN"

        # --- Contador independiente para NAME ---
        ultimo_por_tipo = Evaluacion.objects.filter(
            tipo=tipo).order_by("-evaluacion_id").first()
        if ultimo_por_tipo and "-" in ultimo_por_tipo.nombre:
            try:
                ultimo_num_tipo = int(ultimo_por_tipo.nombre.split("-")[-1])
            except ValueError:
                ultimo_num_tipo = 0
        else:
            ultimo_num_tipo = 0
        nuevo_num_tipo = ultimo_num_tipo + 1
        name = f"{fecha_str}-{sufijo}-{nuevo_num_tipo:02d}"

        # --- Contador GLOBAL seguro para CODE ---
        nuevo_num_global = SecuenciaEvaluacion.next_number()
        code = f"{fecha_str}-{sufijo}-{nuevo_num_global:06d}"

        # --- Crear registro ---
        evaluacion = Evaluacion.objects.create(
            nombre=name,
            codigo_evaluacion=code,
            **validated_data
        )
        return evaluacion


class EvaluationStudentDetailSerializer(serializers.ModelSerializer):
    studentId = serializers.IntegerField(source='alumno.alumno_uuid')
    studentCode = serializers.CharField(source='alumno.codigo_alumno')
    firstName = serializers.CharField(source='alumno.nombres')
    fullName = serializers.CharField(source='alumno.nombre_completo')
    email = serializers.CharField(source='alumno.email')
    phone = serializers.CharField(source='alumno.celular')
    dni = serializers.CharField(source='alumno.dni')
    genderId = serializers.IntegerField(source='alumno.sexo_id')
    stateId = serializers.IntegerField(source='alumno.estado_id')
    status = serializers.SerializerMethodField()
    finalGrade = serializers.DecimalField(
        source='calificacion_final', max_digits=5, decimal_places=2, read_only=True)

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
            'studentCode'
        ]

    def get_status(self, obj):
        if obj.calificacion_final is None:
            return "sinCalificar"
        elif obj.calificacion_final < settings.UMBRAL_APROBACION:
            return "desaprobado"
        else:
            return "aprobado"


class EvaluationConfigTheorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(
        source='evaluacion_config_id', read_only=True)
    evaluationId = serializers.PrimaryKeyRelatedField(
        source='evaluacion', queryset=Evaluacion.objects.all())
    configId = serializers.PrimaryKeyRelatedField(
        source='config', queryset=ConfigTeorica.objects.all())

    class Meta:
        model = EvalConfigTeorica
        fields = ['id', 'evaluationId', 'configId']


# -----------------------------------------------------------------------------------------------------

class EvaluationStudentSerializer(serializers.ModelSerializer):
    studentEvaluationId = serializers.IntegerField(
        source='evaluacion_alumno_id', read_only=True)
    evaluationId = serializers.IntegerField(
        source='evaluacion.evaluacion_id', read_only=True)
    evaluationName = serializers.CharField(
        source='evaluacion.nombre', read_only=True)
    studentId = serializers.IntegerField(
        source='alumno.alumno_id', read_only=True)
    names = serializers.CharField(source='alumno.nombres', read_only=True)
    fullName = serializers.CharField(
        source='alumno.nombre_completo', read_only=True)
    status = serializers.CharField(source='get_status', read_only=True)
    grade = serializers.FloatField(source='get_grade', read_only=True)
    result = serializers.CharField(source='get_result', read_only=True)
    observations = serializers.CharField(
        source='get_observations', read_only=True)

    class Meta:
        model = EvaluacionAlumno
        fields = [
            'studentEvaluationId',
            'evaluationId',
            'evaluationName',
            'studentId',
            'names',
            'fullName',
            'status',
            'grade',
            'result',
            'observations'
        ]


# ____============================__________


class EvaluationTeoricaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    studentEvaluationId = serializers.IntegerField(
        source='evaluacion_alumno.evaluacion_alumno_id', read_only=True)
    attemptNumber = serializers.IntegerField(source='intento_num')
    date = serializers.DateField(source='fecha_realizacion')
    grade = serializers.DecimalField(
        source='calificacion', max_digits=5, decimal_places=2)
    observations = serializers.CharField(source='observaciones')
    result = serializers.IntegerField(source='resultado')

    class Meta:
        model = EvaluacionTeorica
        fields = [
            'id',
            'studentEvaluationId',
            'attemptNumber',
            'date',
            'grade',
            'result',
            'observations',
        ]


class EvaluationFisicaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    studentEvaluationId = serializers.IntegerField(
        source='evaluacion_alumno.evaluacion_alumno_id', read_only=True
    )

    exerciseId = serializers.IntegerField(
        source='ejercicio.ejercicio_id', read_only=True)
    exerciseName = serializers.CharField(
        source='ejercicio.ejercicio_nombre', read_only=True)
    exerciseUnit = serializers.CharField(
        source='ejercicio.unidad', read_only=True)

    grade = serializers.DecimalField(
        source='calificacion', max_digits=5, decimal_places=2, allow_null=True
    )
    observations = serializers.CharField(
        source='observaciones', allow_blank=True, allow_null=True
    )
    result = serializers.DecimalField(
        source='resultado', max_digits=5, decimal_places=2, allow_null=True
    )

    class Meta:
        model = EvaluacionFisica
        fields = [
            'id',
            'studentEvaluationId',
            'exerciseId',
            'exerciseName',
            'exerciseUnit',
            'grade',
            'observations',
            'result',
        ]
