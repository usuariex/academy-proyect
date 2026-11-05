from django.db import models
from students.models import Student
from attendance.models import Shift


class EnrollmentStatus(models.Model):
    status_id = models.AutoField(primary_key=True, db_column="estado_id")
    name = models.CharField(max_length=25, db_column="nombre")

    class Meta:
        managed = False
        db_table = 'cat_estado_matricula'


class Enrollment(models.Model):
    enrollment_id = models.IntegerField(
        primary_key=True, db_column="matricula_id")

    student_id = models.ForeignKey(
        Student,
        models.DO_NOTHING,
        db_column="alumno_id"
    )

    shift_id = models.ForeignKey(
        Shift,
        models.DO_NOTHING,
        db_column="turno_id"
    )

    status_id = models.ForeignKey(
        EnrollmentStatus,
        models.DO_NOTHING,
        db_column="estado_id"
    )

    class Meta:
        managed = False
        db_table = 'matricula'
