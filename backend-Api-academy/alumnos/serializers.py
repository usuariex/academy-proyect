from rest_framework import serializers
from .models import Alumno, Sexo, CatEstadoAlum, Domicilio, Distrito, Provincia, Region


class RegionDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='region_id', read_only= True)
    name = serializers.CharField(source='nombre')
    class Meta:
        model = Region
        fields = ['id', 'name']

class ProvinceDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='provincia_id', read_only= True)
    name = serializers.CharField(source='nombre')
    region = RegionDetailSerializer()
    class Meta:
        model = Provincia
        fields = ['id', 'name', 'region']

class DistrictDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='distrito_id', read_only=True)
    name = serializers.CharField(source='nombre')
    province = ProvinceDetailSerializer(source ='provincia', read_only=True)

    class Meta:
        model = Distrito
        fields = ['id', 'name', 'province']


class DomicilioDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='domicilio_id', read_only=True)
    street = serializers.CharField(source='calle')
    district = DistrictDetailSerializer(source='distrito', read_only=True)
    creatAt = serializers.DateTimeField(source='fecha_registro', read_only=True)
    reference = serializers.CharField(source='referencia', allow_blank=True, allow_null=True)
    """ revisar esta ppropiedad """
    student = serializers.PrimaryKeyRelatedField(source='alumno', queryset=Alumno.objects.all())


    class Meta:
        model = Domicilio
        fields = ['id', 'street', 'district', 'creatAt', 'reference', 'student']


class SexoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='sexo_id', read_only=True)
    nombre = serializers.CharField(source='sexo_nombre')

    class Meta:
        model = Sexo
        fields = ['id', 'nombre']


class StudentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='alumno_id', read_only=True)
    firstName = serializers.CharField(source='nombres')
    lastNameFather = serializers.CharField(source='apellido_paterno')
    lastNameMother = serializers.CharField(source='apellido_materno')
    birthDate = serializers.DateField(source='fecha_nacimiento')
    email = serializers.CharField(allow_blank=True, allow_null=True)
    phone = serializers.CharField(
        source='celular', allow_blank=True, allow_null=True)

    statusId = serializers.PrimaryKeyRelatedField(
        source='estado',
        queryset=CatEstadoAlum.objects.all()
    )
    statusName = serializers.CharField(
        source='estado.estado_nombre', read_only=True)

    genderId = serializers.PrimaryKeyRelatedField(
        source='sexo',
        queryset=Sexo.objects.all()
    )
    genderName = serializers.CharField(
        source='sexo.sexo_nombre', read_only=True)

    weight = serializers.DecimalField(
        source='peso', max_digits=5, decimal_places=2, allow_null=True)
    height = serializers.DecimalField(
        source='estatura', max_digits=5, decimal_places=2)
    dni = serializers.CharField()
    isActive = serializers.BooleanField(source='activo')
    creatAt = serializers.DateTimeField(
        source='fecha_registro', read_only=True)

    fullName = serializers.CharField(source='nombre_completo', read_only=True)

    class Meta:
        model = Alumno
        fields = [
            'id',
            'firstName',
            'lastNameFather',
            'lastNameMother',
            'fullName',
            'birthDate',
            'email',
            'phone',
            'statusId',
            'statusName',
            'genderId',
            'genderName',
            'weight',
            'height',
            'dni',
            'isActive',
            'creatAt',
        ]


class StudentDetailSerializer(StudentSerializer):

    sexo = SexoSerializer()
    evaluations = serializers.SerializerMethodField()
    address = DomicilioDetailSerializer(source="domicilio", read_only=True)


    class Meta(StudentSerializer.Meta):
        model = Alumno
        fields = StudentSerializer.Meta.fields + \
            ['address', 'evaluations', 'sexo']

    def get_evaluations(self, obj):
        # Custom logic to retrieve evaluations for the student
        return []
