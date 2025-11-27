from django.db import models
from alumnos.models import Alumno, Sexo
from django.db.models import Max
from django.core.validators import MinValueValidator


class CatEstadoEval(models.Model):
    estado_id = models.AutoField(primary_key=True)
    estado_nombre = models.CharField(unique=True, max_length=20)

    class Meta:
        managed = False
        db_table = 'cat_estado_eval'


class CatTipoEval(models.Model):
    tipo_id = models.AutoField(primary_key=True)
    tipo_nombre = models.CharField(unique=True, max_length=30)

    class Meta:
        managed = False
        db_table = 'cat_tipo_eval'


class ConfigTeorica(models.Model):
    config_id = models.AutoField(primary_key=True)
    config_nombre = models.CharField(unique=True, max_length=30)
    total_preguntas = models.IntegerField()
    notas = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'config_teorica'


class CriteriosFijo(models.Model):
    criterio_fijo_id = models.AutoField(primary_key=True)
    ejercicio = models.ForeignKey(
        'Ejercicio', on_delete=models.PROTECT, db_index=True)
    sexo = models.ForeignKey(Sexo,  on_delete=models.PROTECT, db_index=True)
    valor_exacto = models.DecimalField(max_digits=6, decimal_places=2)
    calificacion = models.DecimalField(max_digits=4, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'criterios_fijo'
        constraints = [
            models.UniqueConstraint(
                fields=['ejercicio', 'sexo', 'valor_exacto'], name='ejer_sex_val_uq')
        ]


class CriteriosRango(models.Model):
    ejercicio = models.ForeignKey(
        'Ejercicio', on_delete=models.PROTECT, db_index=True)
    sexo = models.ForeignKey(Sexo, on_delete=models.PROTECT, db_index=True)
    valor_min = models.DecimalField(
        max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    valor_max = models.DecimalField(
        max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    calificacion = models.DecimalField(max_digits=4, decimal_places=2)
    criterios_rango_id = models.AutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'criterios_rango'
        constraints = [
            models.UniqueConstraint(
                fields=['sexo', 'ejercicio', 'calificacion'],
                name='ej_sex_not_uq'
            )
        ]


class Ejercicio(models.Model):
    ejercicio_id = models.AutoField(primary_key=True)
    ejercicio_nombre = models.CharField(unique=True, max_length=30)
    unidad = models.CharField(max_length=15, blank=True, null=True)
    activo = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'ejercicio'


class EvalConfigTeorica(models.Model):
    evaluacion_config_id = models.AutoField(primary_key=True)
    evaluacion = models.ForeignKey(
        'Evaluacion', on_delete=models.CASCADE, db_index=True)
    config = models.ForeignKey(
        'ConfigTeorica', on_delete=models.PROTECT, db_index=True)

    class Meta:
        managed = False
        db_table = 'eval_config_teorica'
        constraints = [
            models.UniqueConstraint(
                fields=['evaluacion', 'config'], name='eval_config_uq')
        ]


class EvalFisicaEjercicio(models.Model):
    eval_fisica_ejercicio_id = models.AutoField(primary_key=True)
    ejercicio = models.ForeignKey(
        Ejercicio, on_delete=models.PROTECT, db_index=True)
    evaluacion_alumno = models.ForeignKey(
        'EvaluacionAlumno', on_delete=models.CASCADE, db_index=True)
    calificacion = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)
    session = models.ForeignKey(
        'SessionFisica', on_delete=models.PROTECT, db_index=True)
    resultado = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'eval_fisica_ejercicio'
        constraints = [
            models.UniqueConstraint(fields=['ejercicio', 'evaluacion_alumno', 'session'],
                                    name='e_alum_session_ejercicio_uq')
        ]


class EvalTeoricaIntento(models.Model):
    intento_id = models.AutoField(primary_key=True)
    evaluacion_alumno = models.ForeignKey(
        'EvaluacionAlumno', on_delete=models.CASCADE, db_index=True)
    intento_num = models.IntegerField()
    fecha_realizacion = models.DateField(blank=True, null=True)
    calificacion = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        mejor = EvalTeoricaIntento.objects.filter(
            evaluacion_alumno=self.evaluacion_alumno
        ).aggregate(Max('calificacion'))['calificacion__max']
        self.evaluacion_alumno.calificacion_final = mejor
        self.evaluacion_alumno.save(update_fields=['calificacion_final'])

    class Meta:
        managed = False
        db_table = 'eval_teorica_intento'
        constraints = [
            models.UniqueConstraint(
                fields=['evaluacion_alumno', 'intento_num'], name='ealumno_inten_uq')
        ]
        indexes = [
            models.Index(fields=['evaluacion_alumno',
                         'fecha_realizacion'], name='ealumno_fecha_idx')
        ]


class Evaluacion(models.Model):
    evaluacion_id = models.AutoField(primary_key=True)
    tipo = models.ForeignKey(
        CatTipoEval, on_delete=models.PROTECT, db_index=True)
    fecha_planificada = models.DateField()
    estado = models.ForeignKey(
        CatEstadoEval, on_delete=models.PROTECT, db_index=True)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'evaluacion'
        indexes = [
            models.Index(fields=['tipo', 'fecha_planificada',
                         'estado'], name='tipo_fecha_estado_idx')
        ]


class EvaluacionAlumno(models.Model):
    evaluacion_alumno_id = models.AutoField(primary_key=True)
    evaluacion = models.ForeignKey(
        Evaluacion, on_delete=models.PROTECT, db_index=True)
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, db_index=True)
    calificacion_final = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'evaluacion_alumno'
        constraints = [
            models.UniqueConstraint(
                fields=['alumno', 'evaluacion'], name='alum_id_eval_id_uq')
        ]


class SessionFisica(models.Model):
    session_id = models.AutoField(primary_key=True)
    evaluacion = models.ForeignKey(
        Evaluacion, on_delete=models.PROTECT, db_index=True)
    fecha_realizacion = models.DateField(blank=True, null=True)
    lugar = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'session_fisica'
