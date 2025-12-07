import rest_framework.serializers as serializers
from academy.settings import UMBRAL_APROBACION
from datetime import date
from .models import EvaluationStatus, EvaluationType, EvaluationStatus, SequenceEvaluation, EvaluationType, Exercise, TheoryConfig, Evaluation, EvaluationStudent, TheoryEvaluation, PhysicalEvaluation, TheoryEvaluationConfig
import django.conf as settings
from django.db import transaction


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

    description = serializers.CharField()
    plannedDate = serializers.DateField(source='planned_date')

    statusId = serializers.PrimaryKeyRelatedField(
        source='status', queryset=EvaluationStatus.objects.all()
    )
    statusName = serializers.CharField(
        source='status.status_name', read_only=True)

    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'code', 'name', 'description',
            'typeId', 'typeName', 'statusId', 'statusName',
            'createdAt', 'plannedDate'
        ]

    @transaction.atomic
    def create(self, validated_data):
        evaluation_type = validated_data["type"]
        today = date.today()
        date_str = today.strftime("%Y-%m%d")  # e.g. 2025-1206

        # --- Suffix by type ---
        type_name_str = evaluation_type.type_name.strip().lower()
        if "fisica" in type_name_str:
            suffix = "EFI"
        elif "teorica" in type_name_str:
            suffix = "ETE"
        else:
            suffix = "GEN"

        # --- Independent counter for NAME ---
        last_by_type = Evaluation.objects.filter(
            type=evaluation_type
        ).order_by("-id").first()

        if last_by_type and "-" in last_by_type.name:
            try:
                last_type_number = int(last_by_type.name.split("-")[-1])
            except ValueError:
                last_type_number = 0
        else:
            last_type_number = 0

        new_type_number = last_type_number + 1
        name = f"{date_str}-{suffix}-{new_type_number:02d}"

        # --- Global counter for CODE ---
        new_global_number = SequenceEvaluation.next_number()
        code = f"{date_str}-{suffix}-{new_global_number:06d}"

        # --- Create record ---
        evaluation = Evaluation.objects.create(
            name=name,
            code=code,
            **validated_data
        )
        return evaluation


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

    grade = serializers.FloatField(
        read_only=True, source='annotated_grade', allow_null=True)
    result = serializers.FloatField(
        read_only=True, source='annotated_result', allow_null=True)
    observations = serializers.CharField(
        read_only=True, source='annotated_observations', allow_null=True)
    exerciseName = serializers.CharField(read_only=True, allow_null=True)
    theoryPerformedAt = serializers.DateField(
        read_only=True, source='annotated_theory_performed_at', allow_null=True)
    theoryAttemptNumber = serializers.IntegerField(
        read_only=True, source='annotated_theory_attempt_number', allow_null=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = EvaluationStudent
        fields = [
            'studentEvaluationId',
            'studentUuid',
            'studentFullName',
            'grade',
            'result',
            'observations',
            'exerciseName',
            'theoryPerformedAt',
            'theoryAttemptNumber',
            'status',
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


class TheoryEvaluationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    studentEvaluationId = serializers.IntegerField(
        required=True,
        source='evaluation_student_id',)
    evaluationId = serializers.IntegerField(
        source='evaluation_student.evaluation_id', read_only=True)
    attemptNumber = serializers.IntegerField(source='attempt_number')
    performedAt = serializers.DateField(source='performed_at')
    grade = serializers.DecimalField(
        required=False,
        allow_null=True,
        max_digits=5,
        decimal_places=2
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
            'attemptNumber',
            'performedAt',
            'grade',
            'result',
            'observations',
        ]


class PhysicalEvaluationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    studentEvaluationId = serializers.IntegerField(
        source='evaluation_student.id', read_only=True)
    exerciseId = serializers.IntegerField(source='exercise.id', read_only=True)
    exerciseName = serializers.CharField(
        source='exercise.exercise_name', read_only=True)
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
            'exerciseId',
            'exerciseName',
            'exerciseUnit',
            'grade',
            'observations',
            'result',
        ]
