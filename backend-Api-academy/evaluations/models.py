from django.db import models, transaction
from django.db import models
from students.models import Student, Gender
from academy.settings import UMBRAL_APROBACION
from django.db.models import Max
from django.core.validators import MinValueValidator


class EvaluationStatus(models.Model):
    id = models.AutoField(primary_key=True, db_column="estado_id")
    status_name = models.CharField(
        unique=True, max_length=20, db_column="estado_nombre")

    class Meta:
        managed = False
        db_table = 'cat_estado_eval'


class EvaluationType(models.Model):
    id = models.AutoField(primary_key=True, db_column="tipo_id")
    type_name = models.CharField(
        unique=True, max_length=30, db_column="tipo_nombre")

    class Meta:
        managed = False
        db_table = 'cat_tipo_eval'


class TheoryConfig(models.Model):
    config_id = models.AutoField(primary_key=True, db_column="config_id")
    config_name = models.CharField(
        unique=True, max_length=30, db_column="config_nombre")
    total_questions = models.IntegerField(db_column="total_preguntas")
    notes = models.TextField(blank=True, null=True, db_column="notas")
    created_at = models.DateTimeField(
        auto_now_add=True, db_column="fecha_creacion")
    is_active = models.BooleanField(default=True, db_column="activo")

    class Meta:
        managed = False
        db_table = 'config_teorica'


class FixedCriteria(models.Model):
    fixed_criteria_id = models.AutoField(
        primary_key=True, db_column="criterio_fijo_id")
    exercise = models.ForeignKey(
        'Exercise', on_delete=models.PROTECT, db_index=True, db_column="ejercicio_id")
    gender = models.ForeignKey(
        Gender, on_delete=models.PROTECT, db_index=True, db_column="sexo_id")
    exact_value = models.DecimalField(
        max_digits=6, decimal_places=2, db_column="valor_exacto")
    grade = models.DecimalField(
        max_digits=4, decimal_places=2, db_column="calificacion")

    class Meta:
        managed = False
        db_table = 'criterios_fijo'
        constraints = [
            models.UniqueConstraint(
                fields=['exercise', 'gender', 'exact_value'], name='ejer_sex_val_uq')
        ]


class RangeCriteria(models.Model):
    range_criteria_id = models.AutoField(
        primary_key=True, db_column="criterios_rango_id")
    exercise = models.ForeignKey(
        'Exercise', on_delete=models.PROTECT, db_index=True, db_column="ejercicio_id")
    gender = models.ForeignKey(
        Gender, on_delete=models.PROTECT, db_index=True, db_column="sexo_id")
    min_value = models.DecimalField(max_digits=6, decimal_places=2, validators=[
                                    MinValueValidator(0)], db_column="valor_min")
    max_value = models.DecimalField(max_digits=6, decimal_places=2, validators=[
                                    MinValueValidator(0)], db_column="valor_max")
    grade = models.DecimalField(
        max_digits=4, decimal_places=2, db_column="calificacion")

    class Meta:
        managed = False
        db_table = 'criterios_rango'
        constraints = [
            models.UniqueConstraint(
                fields=['gender', 'exercise', 'grade'],
                name='ej_sex_not_uq'
            )
        ]


class Exercise(models.Model):
    exercise_id = models.AutoField(primary_key=True, db_column="ejercicio_id")
    exercise_name = models.CharField(
        unique=True, max_length=30, db_column="ejercicio_nombre")
    unit = models.CharField(max_length=15, blank=True,
                            null=True, db_column="unidad")
    is_active = models.BooleanField(default=True, db_column="activo")

    class Meta:
        managed = False
        db_table = 'ejercicio'


class TheoryEvaluationConfig(models.Model):
    id = models.AutoField(
        primary_key=True, db_column="evaluacion_config_id")
    evaluation = models.ForeignKey(
        'Evaluation', on_delete=models.CASCADE, db_index=True, db_column="evaluacion_id")
    config = models.ForeignKey(
        'TheoryConfig', on_delete=models.PROTECT, db_index=True, db_column="config_id")

    class Meta:
        managed = False
        db_table = 'eval_config_teorica'
        constraints = [
            models.UniqueConstraint(
                fields=['evaluation', 'config'], name='eval_config_uq')
        ]


class PhysicalEvaluation(models.Model):
    physical_eval_id = models.AutoField(primary_key=True, db_column="id")
    exercise = models.ForeignKey(
        Exercise, on_delete=models.PROTECT, db_index=True, db_column="ejercicio_id")
    evaluation_student = models.ForeignKey(
        'EvaluationStudent', on_delete=models.CASCADE, db_index=True, db_column="evaluacion_alumno_id")
    grade = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True, db_column="calificacion")
    observations = models.TextField(
        blank=True, null=True, db_column="observaciones")
    result = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True, db_column="resultado")

    class Meta:
        managed = False
        db_table = 'evaluacion_fisica'
        constraints = [
            models.UniqueConstraint(fields=['exercise', 'evaluation_student'],
                                    name='e_alum_ejercicio_uq')
        ]


class TheoryEvaluation(models.Model):
    theory_eval_id = models.AutoField(primary_key=True, db_column="id")
    evaluation_student = models.ForeignKey(
        'EvaluationStudent', on_delete=models.CASCADE, db_index=True, db_column="evaluacion_alumno_id")
    attempt_number = models.IntegerField(db_column="intento_num")
    performed_at = models.DateField(
        blank=True, null=True, db_column="fecha_realizacion")
    grade = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True, db_column="calificacion")
    observations = models.TextField(
        blank=True, null=True, db_column="observaciones")
    result = models.IntegerField(blank=True, null=True, db_column="resultado")

    class Meta:
        managed = False
        db_table = 'evaluacion_teorica'
        constraints = [
            models.UniqueConstraint(
                fields=['evaluation_student', 'attempt_number'], name='ealumno_inten_uq')
        ]
        indexes = [
            models.Index(fields=['evaluation_student',
                         'performed_at'], name='ealumno_fecha_idx')
        ]


class Evaluation(models.Model):
    id = models.AutoField(
        primary_key=True, db_column="evaluacion_id")
    type = models.ForeignKey(
        EvaluationType, on_delete=models.PROTECT, db_index=True, db_column="tipo_id")
    planned_date = models.DateField(db_column="fecha_planificada")
    status = models.ForeignKey(
        EvaluationStatus, on_delete=models.PROTECT, db_index=True, db_column="estado_id")
    description = models.TextField(
        blank=True, null=True, db_column="descripcion")
    created_at = models.DateTimeField(
        auto_now_add=True, db_column="fecha_creacion")
    name = models.CharField(max_length=30, db_column="nombre")
    code = models.CharField(
        max_length=30, unique=True, db_column="codigo_evaluacion")

    class Meta:
        managed = False
        db_table = 'evaluacion'
        indexes = [
            models.Index(fields=['type', 'planned_date',
                         'status'], name='tipo_fecha_estado_idx')
        ]


class EvaluationStudent(models.Model):
    id = models.AutoField(
        primary_key=True, db_column="evaluacion_alumno_id")
    evaluation = models.ForeignKey(
        Evaluation, on_delete=models.PROTECT, db_index=True, db_column="evaluacion_id")
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, db_index=True, db_column="alumno_id")

    class Meta:
        managed = False
        db_table = 'evaluacion_alumno'
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'evaluation'], name='alum_id_eval_id_uq')
        ]

    def get_status(self):
        eval_type = self.evaluation.type.type_name
        if eval_type == "Teorica":
            grade = TheoryEvaluation.objects.filter(
                evaluation_student=self
            ).values_list('grade', flat=True).first()
        elif eval_type == "Fisica":
            grade = PhysicalEvaluation.objects.filter(
                evaluation_student=self
            ).values_list('grade', flat=True).first()
        else:
            return "Sin calificar"

        if grade is None:
            return "Sin calificar"

        if grade is not None:
            if grade < UMBRAL_APROBACION:
                return "Desaprobado"
            else:
                return "Aprobado"

        return "Calificado"

    def get_grade(self):
        eval_type = self.evaluation.type.type_name
        if eval_type == "Teorica":
            return TheoryEvaluation.objects.filter(
                evaluation_student=self
            ).values_list('grade', flat=True).first()
        elif eval_type == "Fisica":
            return PhysicalEvaluation.objects.filter(
                evaluation_student=self
            ).values_list('grade', flat=True).first()
        return None


class SequenceEvaluation(models.Model):
    last_number = models.IntegerField(default=0, db_column="ultimo_numero")

    class Meta:
        db_table = "secuencia_evaluacion"
        verbose_name = "Secuencia de evaluación"
        verbose_name_plural = "Secuencias de evaluación"

    @classmethod
    def next_number(cls):
        with transaction.atomic():
            secuencia = cls.objects.select_for_update().get(pk=1)
            secuencia.last_number += 1
            secuencia.save(update_fields=["last_number"])
            return secuencia.last_number
