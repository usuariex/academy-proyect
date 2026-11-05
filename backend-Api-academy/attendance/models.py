from django.db import models
from students.models import Student


class AttendanceStatus(models.Model):
    id = models.AutoField(primary_key=True, db_column="estado_id")
    description = models.CharField(max_length=45, db_column="descripcion")

    class Meta:
        managed = False
        db_table = 'cat_estado_asistencia'


class Shift(models.Model):
    id = models.AutoField(primary_key=True, db_column="turno_id")
    name = models.CharField(max_length=20, db_column="nombre")

    class Meta:
        managed = False
        db_table = 'turno'


class Attendance(models.Model):
    id = models.IntegerField(primary_key=True, db_column="asistencia_id")
    student = models.ForeignKey(
        Student,
        models.DO_NOTHING,
        db_column="alumno_id"
    )
    status = models.ForeignKey(
        AttendanceStatus,
        models.DO_NOTHING,
        db_column="estado_id"
    )
    shift = models.ForeignKey(
        Shift,
        models.DO_NOTHING,
        db_column="turno_id"
    )
    date = models.DateField(db_column="fecha")

    class Meta:
        managed = False
        db_table = 'asistencia'
        unique_together = (('student', 'shift', 'date'),)


class Justification(models.Model):
    attendance = models.OneToOneField(
        Attendance,
        models.DO_NOTHING,
        primary_key=True,
        db_column="justificacion"
    )
    description = models.TextField(db_column="descripcion")
    created_at = models.DateTimeField(db_column="fecha_registro")
    previous_status = models.ForeignKey(
        AttendanceStatus,
        models.DO_NOTHING,
        db_column="estado_anterior"
    )

    class Meta:
        managed = False
        db_table = 'justificacion'
