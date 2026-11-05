# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Alumno(models.Model):
    alumno_id = models.AutoField(primary_key=True)
    nombres = models.CharField(max_length=50)
    apellido_paterno = models.CharField(max_length=50)
    fecha_nacimiento = models.DateField()
    email = models.CharField(unique=True, max_length=100, blank=True, null=True)
    celular = models.CharField(max_length=20, blank=True, null=True)
    estado = models.ForeignKey('CatEstadoAlum', models.DO_NOTHING)
    sexo = models.ForeignKey('Sexo', models.DO_NOTHING)
    peso = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    estatura = models.DecimalField(max_digits=5, decimal_places=2)
    dni = models.CharField(unique=True, max_length=12)
    activo = models.IntegerField()
    fecha_registro = models.DateTimeField()
    apellido_materno = models.CharField(max_length=50)
    alumno_uuid = models.CharField(max_length=36, blank=True, null=True)
    codigo_alumno = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'alumno'


class Asistencia(models.Model):
    asistencia_id = models.IntegerField(primary_key=True)
    alumno = models.ForeignKey(Alumno, models.DO_NOTHING)
    estado = models.ForeignKey('CatEstadoAsistencia', models.DO_NOTHING)
    turno = models.ForeignKey('Turno', models.DO_NOTHING)
    fecha = models.DateField()

    class Meta:
        managed = False
        db_table = 'asistencia'
        unique_together = (('alumno', 'turno', 'fecha'),)


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class CatEstadoAlum(models.Model):
    estado_id = models.AutoField(primary_key=True)
    estado_nombre = models.CharField(unique=True, max_length=30)

    class Meta:
        managed = False
        db_table = 'cat_estado_alum'


class CatEstadoAsistencia(models.Model):
    estado_id = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'cat_estado_asistencia'


class CatEstadoEval(models.Model):
    estado_id = models.AutoField(primary_key=True)
    estado_nombre = models.CharField(unique=True, max_length=20)

    class Meta:
        managed = False
        db_table = 'cat_estado_eval'


class CatEstadoMatricula(models.Model):
    estado_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=25)

    class Meta:
        managed = False
        db_table = 'cat_estado_matricula'


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
    fecha_creacion = models.DateTimeField()
    activo = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'config_teorica'


class CriteriosFijo(models.Model):
    ejercicio = models.ForeignKey('Ejercicio', models.DO_NOTHING)
    sexo = models.ForeignKey('Sexo', models.DO_NOTHING)
    valor_exacto = models.DecimalField(max_digits=6, decimal_places=2)
    calificacion = models.DecimalField(max_digits=4, decimal_places=2)
    criterio_fijo_id = models.AutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'criterios_fijo'
        unique_together = (('ejercicio', 'sexo', 'valor_exacto'),)


class CriteriosRango(models.Model):
    ejercicio = models.ForeignKey('Ejercicio', models.DO_NOTHING)
    sexo = models.ForeignKey('Sexo', models.DO_NOTHING)
    valor_min = models.DecimalField(max_digits=6, decimal_places=2)
    valor_max = models.DecimalField(max_digits=6, decimal_places=2)
    calificacion = models.DecimalField(max_digits=4, decimal_places=2)
    criterios_rango_id = models.AutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'criterios_rango'
        unique_together = (('sexo', 'ejercicio', 'calificacion'),)


class Distrito(models.Model):
    distrito_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45)
    provincia = models.ForeignKey('Provincia', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'distrito'
        unique_together = (('nombre', 'provincia'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UsersUser', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Domicilio(models.Model):
    domicilio_id = models.AutoField(primary_key=True)
    calle = models.CharField(max_length=45)
    distrito = models.ForeignKey(Distrito, models.DO_NOTHING)
    fecha_registro = models.DateTimeField()
    referencia = models.TextField(blank=True, null=True)
    alumno = models.OneToOneField(Alumno, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'domicilio'


class Ejercicio(models.Model):
    ejercicio_id = models.AutoField(primary_key=True)
    ejercicio_nombre = models.CharField(unique=True, max_length=30)
    unidad = models.CharField(max_length=15, blank=True, null=True)
    activo = models.IntegerField()
    tipo_criterio = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'ejercicio'


class EvalConfigTeorica(models.Model):
    evaluacion_config_id = models.AutoField(primary_key=True)
    evaluacion = models.ForeignKey('Evaluacion', models.DO_NOTHING)
    config = models.ForeignKey(ConfigTeorica, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'eval_config_teorica'
        unique_together = (('evaluacion', 'config'),)


class Evaluacion(models.Model):
    evaluacion_id = models.AutoField(primary_key=True)
    tipo = models.ForeignKey(CatTipoEval, models.DO_NOTHING)
    fecha_planificada = models.DateField()
    estado = models.ForeignKey(CatEstadoEval, models.DO_NOTHING)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField()
    nombre = models.CharField(max_length=30)
    codigo_evaluacion = models.CharField(unique=True, max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'evaluacion'


class EvaluacionAlumno(models.Model):
    evaluacion_alumno_id = models.AutoField(primary_key=True)
    evaluacion = models.ForeignKey(Evaluacion, models.DO_NOTHING)
    alumno = models.ForeignKey(Alumno, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'evaluacion_alumno'
        unique_together = (('alumno', 'evaluacion'),)


class EvaluacionEjercicio(models.Model):
    id = models.BigAutoField(primary_key=True)
    evaluacion = models.OneToOneField(Evaluacion, models.DO_NOTHING)
    ejercicio = models.ForeignKey(Ejercicio, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'evaluacion_ejercicio'


class EvaluacionFisica(models.Model):
    evaluacion_alumno = models.OneToOneField(EvaluacionAlumno, models.DO_NOTHING)
    calificacion = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)
    resultado = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    fecha_realizacion = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'evaluacion_fisica'


class EvaluacionTeorica(models.Model):
    evaluacion_alumno = models.OneToOneField(EvaluacionAlumno, models.DO_NOTHING)
    fecha_realizacion = models.DateField(blank=True, null=True)
    calificacion = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)
    resultado = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'evaluacion_teorica'


class Justificacion(models.Model):
    justificacion = models.OneToOneField(Asistencia, models.DO_NOTHING, primary_key=True)
    descripcion = models.TextField()
    fecha_registro = models.DateTimeField()
    estado_anterior = models.ForeignKey(CatEstadoAsistencia, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'justificacion'


class Matricula(models.Model):
    matricula_id = models.IntegerField(primary_key=True)
    turno = models.ForeignKey('Turno', models.DO_NOTHING)
    estado = models.ForeignKey(CatEstadoMatricula, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'matricula'


class Provincia(models.Model):
    provincia_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45)
    region = models.ForeignKey('Region', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'provincia'
        unique_together = (('nombre', 'region'),)


class Region(models.Model):
    region_id = models.AutoField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=30)

    class Meta:
        managed = False
        db_table = 'region'


class SecuenciaEvaluacion(models.Model):
    id = models.BigAutoField(primary_key=True)
    ultimo_numero = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'secuencia_evaluacion'


class Sexo(models.Model):
    sexo_id = models.AutoField(primary_key=True)
    sexo_nombre = models.CharField(unique=True, max_length=20)

    class Meta:
        managed = False
        db_table = 'sexo'


class Turno(models.Model):
    turno_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'turno'


class UsersUser(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()
    phone = models.CharField(max_length=20)
    dni = models.CharField(unique=True, max_length=20)
    birth_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users_user'


class UsersUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(UsersUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_user_groups'
        unique_together = (('user', 'group'),)


class UsersUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(UsersUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_user_user_permissions'
        unique_together = (('user', 'permission'),)
