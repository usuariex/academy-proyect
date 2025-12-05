from django.db import models
from django.core.validators import MinValueValidator
import uuid


class Alumno(models.Model):
    alumno_id = models.AutoField(primary_key=True)
    alumno_uuid = models.UUIDField(
        default=uuid.uuid4,  # genera automáticamente un UUID
        editable=False,
        unique=True
    )
    codigo_alumno = models.CharField(
        max_length=30,
        unique=True
    )
    nombres = models.CharField(max_length=50, db_index=True)
    apellido_paterno = models.CharField(max_length=50, db_index=True)
    apellido_materno = models.CharField(max_length=50)
    fecha_nacimiento = models.DateField()
    email = models.CharField(
        unique=True, max_length=100, blank=True, null=True)
    celular = models.CharField(max_length=20, blank=True, null=True)
    estado = models.ForeignKey(
        'CatEstadoAlum', on_delete=models.PROTECT, db_index=True)
    sexo = models.ForeignKey('Sexo', on_delete=models.PROTECT, db_index=True)
    peso = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True,
                               validators=[MinValueValidator(0)])
    estatura = models.DecimalField(max_digits=5, decimal_places=2,
                                   validators=[MinValueValidator(0)])
    dni = models.CharField(unique=True, max_length=12)
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    @property
    def nombre_completo(self):
        return f"{self.nombres} {self.apellido_paterno} {self.apellido_materno}"

    def save(self, *args, **kwargs):
        if not self.alumno_uuid:
            self.alumno_uuid = uuid.uuid4()
        if not self.codigo_alumno:
            last_id = Alumno.objects.aggregate(models.Max("alumno_id"))[
                "alumno_id__max"] or 0
            self.codigo_alumno = f"AM01-25S-{last_id+1:04d}"
        super().save(*args, **kwargs)

    class Meta:
        managed = False
        db_table = 'alumno'


class CatEstadoAlum(models.Model):
    estado_id = models.AutoField(primary_key=True)
    estado_nombre = models.CharField(unique=True, max_length=30)

    class Meta:
        managed = False
        db_table = 'cat_estado_alum'


class Sexo(models.Model):
    sexo_id = models.AutoField(primary_key=True)
    sexo_nombre = models.CharField(unique=True, max_length=20)

    class Meta:
        managed = False
        db_table = 'sexo'


class Provincia(models.Model):
    provincia_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45)
    region = models.ForeignKey(
        'Region', on_delete=models.PROTECT, db_index=True)

    class Meta:
        managed = False
        db_table = 'provincia'
        constraints = [
            models.UniqueConstraint(
                fields=['nombre', 'region'], name='nombre_region_uq')
        ]


class Region(models.Model):
    region_id = models.AutoField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=30)

    class Meta:
        managed = False
        db_table = 'region'


class Distrito(models.Model):
    distrito_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45)
    provincia = models.ForeignKey(
        'Provincia', on_delete=models.PROTECT, db_index=True)

    class Meta:
        managed = False
        db_table = 'distrito'
        constraints = [
            models.UniqueConstraint(
                fields=['nombre', 'provincia'],
                name='nombre_provincia_uq'
            )
        ]


class Domicilio(models.Model):
    domicilio_id = models.AutoField(primary_key=True)
    calle = models.CharField(max_length=45)
    distrito = models.ForeignKey(
        Distrito, on_delete=models.PROTECT, db_index=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    referencia = models.TextField(blank=True, null=True)
    alumno = models.OneToOneField(
        Alumno, on_delete=models.CASCADE, db_index=True)

    class Meta:
        managed = False
        db_table = 'domicilio'
