from django.db import models
from django.core.validators import MinValueValidator
import uuid


class Student(models.Model):
    id = models.AutoField(primary_key=True, db_column="alumno_id")
    uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        db_column="alumno_uuid"
    )
    code = models.CharField(
        max_length=30,
        unique=True,
        db_column="codigo_alumno"
    )
    first_name = models.CharField(
        max_length=50, db_index=True, db_column="nombres")
    paternal_surname = models.CharField(
        max_length=50, db_index=True, db_column="apellido_paterno")
    maternal_surname = models.CharField(
        max_length=50, db_column="apellido_materno")
    birth_date = models.DateField(db_column="fecha_nacimiento")
    email = models.CharField(
        unique=True, max_length=100, blank=True, null=True, db_column="email"
    )
    phone = models.CharField(max_length=20, blank=True,
                             null=True, db_column="celular")
    enrollment_status = models.ForeignKey(
        'EnrollmentStatus', on_delete=models.PROTECT, db_index=True, db_column="estado_id"
    )
    gender = models.ForeignKey(
        'Gender', on_delete=models.PROTECT, db_index=True, db_column="sexo_id")
    weight = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True,
        validators=[MinValueValidator(0)], db_column="peso"
    )
    height = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0)], db_column="estatura"
    )
    national_id = models.CharField(unique=True, max_length=12, db_column="dni")
    is_active = models.BooleanField(default=True, db_column="activo")
    created_at = models.DateTimeField(
        auto_now_add=True, db_column="fecha_registro")

    @property
    def full_name(self):
        return f"{self.first_name} {self.paternal_surname} {self.maternal_surname}"

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = uuid.uuid4()
        if not self.code:
            last_id = Student.objects.aggregate(
                models.Max("id"))["id__max"] or 0
            self.code = f"AM01-25S-{last_id+1:04d}"
        super().save(*args, **kwargs)

    class Meta:
        managed = False
        db_table = 'alumno'


class EnrollmentStatus(models.Model):
    id = models.AutoField(primary_key=True, db_column="estado_id")
    status_name = models.CharField(
        unique=True, max_length=30, db_column="estado_nombre")

    class Meta:
        managed = False
        db_table = 'cat_estado_alum'


class Gender(models.Model):
    id = models.AutoField(primary_key=True, db_column="sexo_id")
    gender_name = models.CharField(
        unique=True, max_length=20, db_column="sexo_nombre")

    class Meta:
        managed = False
        db_table = 'sexo'


class Province(models.Model):
    id = models.AutoField(primary_key=True, db_column="provincia_id")
    name = models.CharField(max_length=45, db_column="nombre")
    region = models.ForeignKey(
        'Region', on_delete=models.PROTECT, db_index=True, db_column="region_id"
    )

    class Meta:
        managed = False
        db_table = 'provincia'
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'region'], name='nombre_region_uq'
            )
        ]


class Region(models.Model):
    id = models.AutoField(primary_key=True, db_column="region_id")
    name = models.CharField(unique=True, max_length=30, db_column="nombre")

    class Meta:
        managed = False
        db_table = 'region'


class District(models.Model):
    id = models.AutoField(primary_key=True, db_column="distrito_id")
    name = models.CharField(max_length=45, db_column="nombre")
    province = models.ForeignKey(
        'Province', on_delete=models.PROTECT, db_index=True, db_column="provincia_id"
    )

    class Meta:
        managed = False
        db_table = 'distrito'
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'province'],
                name='nombre_provincia_uq'
            )
        ]


class Address(models.Model):
    id = models.AutoField(primary_key=True, db_column="domicilio_id")
    street = models.CharField(max_length=45, db_column="calle")
    district = models.ForeignKey(
        District, on_delete=models.PROTECT, db_index=True, db_column="distrito_id"
    )
    created_at = models.DateTimeField(
        auto_now_add=True, db_column="fecha_registro")
    reference = models.TextField(blank=True, null=True, db_column="referencia")
    student = models.OneToOneField(
        Student, on_delete=models.CASCADE, db_index=True, db_column="alumno_id"
    )

    class Meta:
        managed = False
        db_table = 'domicilio'
