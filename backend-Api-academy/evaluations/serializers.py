import rest_framework.serializers as serializers
from .services.calculate_grade import calculate_theory_grade
from django.db import models

from .models import EvaluationStatus, EvaluationType, EvaluationStatus, EvaluationType, Exercise, TheoryConfig, Evaluation, EvaluationStudent, TheoryEvaluation, PhysicalEvaluation, TheoryEvaluationConfig
import django.conf as settings
from .services.evaluations_service import create_evaluation_with_assignment, EvaluationAssignmentError


class EvaluationStatusSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source='status_name')

    class Meta:
        model = EvaluationStatus
        fields = ['id', 'name']


class EvaluationTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source='type_name')

    class Meta:
        model = EvaluationType
        fields = ['id', 'name']


class ExerciseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source='exercise_name')

    class Meta:
        model = Exercise
        fields = '__all__'


class TheoryConfigSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source='config_name')

    class Meta:
        model = TheoryConfig
        fields = '__all__'


class EvaluationSerializer(serializers.ModelSerializer):
    code = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)

    typeId = serializers.PrimaryKeyRelatedField(
        source='type', queryset=EvaluationType.objects.all()
    )
    typeName = serializers.CharField(source='type.type_name', read_only=True)

    description = serializers.CharField(required=False, allow_blank=True)
    plannedDate = serializers.DateField(source='planned_date', required=False)

    statusId = serializers.PrimaryKeyRelatedField(
        source='status', queryset=EvaluationStatus.objects.all(), required=False
    )
    statusName = serializers.CharField(
        source='status.status_name', read_only=True)

    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    # --- write-only inputs from the front-end ---
    exerciseId = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Exercise.objects.all(), required=False, source='exercise_obj'
    )
    configId = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=TheoryConfig.objects.all(), required=False, source='config_obj'
    )

    # --- read-only outputs (from related tables) ---
    exerciseId = serializers.SerializerMethodField()
    exerciseName = serializers.SerializerMethodField()
    configId = serializers.SerializerMethodField()
    configName = serializers.SerializerMethodField()
    studentsCount = serializers.SerializerMethodField()
    hasGradedStudents = serializers.SerializerMethodField()
    totalQuestions = serializers.SerializerMethodField()

    class Meta:
        model = Evaluation
        fields = [
            'code', 'name', 'description',
            'typeId', 'typeName', 'statusId', 'statusName',
            'createdAt', 'plannedDate',
            'exerciseId', 'configId',
            'exerciseId', 'exerciseName', 'configId', 'configName', 'studentsCount', 'hasGradedStudents', 'totalQuestions'
        ]

    # ---------- read helpers ----------
    def get_exerciseId(self, obj):
        ee = getattr(obj, 'evaluation_exercises', None)
        ee = ee.first() if ee else None
        return ee.exercise_id if ee else None

    def get_exerciseName(self, obj):
        ee = getattr(obj, 'evaluation_exercises', None)
        ee = ee.select_related('exercise').first() if ee else None
        return ee.exercise.exercise_name if ee and ee.exercise else None

    def get_configId(self, obj):
        tc_qs = getattr(obj, 'theoryevaluationconfig_set', None)
        tc = tc_qs.first() if tc_qs else None
        return tc.config_id if tc else None

    def get_configName(self, obj):
        tc_qs = getattr(obj, 'theoryevaluationconfig_set', None)
        tc = tc_qs.select_related('config').first() if tc_qs else None
        return tc.config.config_name if tc and tc.config else None

    def get_studentsCount(self, obj):
        # Cuenta los registros en EvaluationStudent asociados a esta evaluación
        return EvaluationStudent.objects.filter(evaluation=obj).count()

    def get_hasGradedStudents(self, obj):
        return EvaluationStudent.objects.filter(
            evaluation=obj
        ).filter(
            models.Q(theoryevaluation__grade__isnull=False) |
            models.Q(physicalevaluation__grade__isnull=False)
        ).exists()

    def get_totalQuestions(self, obj):
        # Solo si la evaluación es Teórica
        if obj.type and obj.type.type_name == "Teorica":
            tc_qs = getattr(obj, 'theoryevaluationconfig_set', None)
            tc = tc_qs.select_related('config').first() if tc_qs else None
            return tc.config.total_questions if tc and tc.config else None
        return None

    # ---------- create ----------

    def create(self, validated_data):
        # extraer objetos temporales validados por PrimaryKeyRelatedField (source)
        exercise_obj = validated_data.pop('exercise_obj', None)
        config_obj = validated_data.pop('config_obj', None)

        exercise_id = exercise_obj.pk if exercise_obj is not None else None
        config_id = config_obj.pk if config_obj is not None else None

        try:
            evaluation = create_evaluation_with_assignment(
                validated_data,
                exercise_id=exercise_id,
                config_id=config_id,
                user=self.context.get('request').user if self.context.get(
                    'request') else None
            )
            return evaluation
        except EvaluationAssignmentError as e:
            raise serializers.ValidationError({"non_field_errors": [str(e)]})

    def update(self, instance, validated_data):
        exercise_obj = validated_data.pop('exercise_obj', None)
        config_obj = validated_data.pop('config_obj', None)

        if exercise_obj is not None:
            instance.exercise = exercise_obj
        if config_obj is not None:
            instance.config = config_obj

        # actualiza los demás campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class TheoryEvaluationConfigSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    evaluationId = serializers.PrimaryKeyRelatedField(
        source='evaluation', queryset=Evaluation.objects.all())
    configId = serializers.PrimaryKeyRelatedField(
        source='config', queryset=TheoryConfig.objects.all())

    class Meta:
        model = TheoryEvaluationConfig
        fields = ['id', 'evaluationId', 'configId']


class EvaluationStudentSerializer(serializers.ModelSerializer):
    studentEvaluationId = serializers.IntegerField(source='id', read_only=True)
    studentUuid = serializers.UUIDField(
        read_only=True, source='student_uuid', allow_null=True)
    studentFullName = serializers.CharField(
        read_only=True, source='student_full_name', allow_null=True)
    performedAt = serializers.DateField(
        source='performed_at_unified', read_only=True)

    grade = serializers.FloatField(
        read_only=True, source='annotated_grade', allow_null=True)
    result = serializers.FloatField(
        read_only=True, source='annotated_result', allow_null=True)
    observations = serializers.CharField(
        read_only=True, source='annotated_observations', allow_null=True)
    status = serializers.SerializerMethodField()
    assigned_exercise = serializers.SerializerMethodField()
    assigned_config = serializers.SerializerMethodField()

    class Meta:
        model = EvaluationStudent
        fields = [
            'studentEvaluationId',
            'studentUuid',
            'studentFullName',
            'grade',
            'result',
            'observations',
            'performedAt',
            'status',
            'assigned_exercise',
            'assigned_config'

        ]

    def get_status(self, obj):
        grade = getattr(obj, 'annotated_grade', None)
        umbral = getattr(settings, 'UMBRAL_APROBACION', 11.0)
        if grade is None:
            return "Sin calificar"
        try:
            return "Aprobado" if float(grade) >= float(umbral) else "Desaprobado"
        except Exception:
            return "Sin calificar"

    def get_assigned_exercise(self, obj):
        # devolver solo si la evaluación es física
        if getattr(obj, "evaluation", None) and getattr(obj.evaluation, "type", None):
            if obj.evaluation.type.type_name == "Fisica":
                return {
                    "id": getattr(obj, "assigned_exercise_id", None),
                    "name": getattr(obj, "assigned_exercise_name", None),
                }
        return None

    def get_assigned_config(self, obj):
        # devolver solo si la evaluación es teórica
        if getattr(obj, "evaluation", None) and getattr(obj.evaluation, "type", None):
            if obj.evaluation.type.type_name != "Fisica":
                return {
                    "id": getattr(obj, "assigned_config_id", None),
                    "name": getattr(obj, "assigned_config_name", None),
                }
        return None


class TheoryEvaluationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    studentEvaluationId = serializers.IntegerField(
        required=True,
        source='evaluation_student_id',
    )
    evaluationId = serializers.IntegerField(
        source='evaluation_student.evaluation_id',
        read_only=True
    )
    performedAt = serializers.DateField(
        required=False,
        source='performed_at'
    )
    grade = serializers.DecimalField(
        required=False,
        allow_null=True,
        max_digits=5,
        decimal_places=2,
        coerce_to_string=False,
        read_only=True
    )
    observations = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    result = serializers.IntegerField(
        required=False,
        allow_null=True
    )

    class Meta:
        model = TheoryEvaluation
        fields = [
            'id',
            'studentEvaluationId',
            'evaluationId',
            'performedAt',
            'grade',
            'result',
            'observations',
        ]

    def create(self, validated_data):
        result = validated_data.get("result")
        config_id = self.context.get("config_id")
        if config_id and result is not None:
            grade = calculate_theory_grade(result, config_id)
            validated_data["grade"] = grade
        return super().create(validated_data)

    def update(self, instance, validated_data):
        result = validated_data.get("result", instance.result)
        config_id = self.context.get("config_id")
        if config_id and result is not None:
            grade = calculate_theory_grade(result, config_id)
            validated_data["grade"] = grade
        return super().update(instance, validated_data)


class PhysicalEvaluationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    studentEvaluationId = serializers.IntegerField(
        source='evaluation_student.id', read_only=True)
    performedAt = serializers.DateField(source='performed_at')
    exerciseUnit = serializers.CharField(
        source='exercise.unit', read_only=True)
    grade = serializers.DecimalField(
        source='grade', max_digits=5, decimal_places=2, allow_null=True)
    observations = serializers.CharField(
        source='observations', allow_blank=True, allow_null=True)
    result = serializers.DecimalField(
        source='result', max_digits=5, decimal_places=2, allow_null=True)

    class Meta:
        model = PhysicalEvaluation
        fields = [
            'id',
            'studentEvaluationId',
            'exerciseUnit',
            'grade',
            'result',
            'performedAt'
            'observations',
        ]
