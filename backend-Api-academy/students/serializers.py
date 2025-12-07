from rest_framework import serializers
from .models import Student, Gender, EnrollmentStatus, Address, District, Province, Region


class RegionDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()

    class Meta:
        model = Region
        fields = ['id', 'name']


class ProvinceDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    region = RegionDetailSerializer()

    class Meta:
        model = Province
        fields = ['id', 'name', 'region']


class DistrictDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    province = ProvinceDetailSerializer(read_only=True)

    class Meta:
        model = District
        fields = ['id', 'name', 'province']


class AddressDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    street = serializers.CharField()
    district = DistrictDetailSerializer(read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    reference = serializers.CharField(allow_blank=True, allow_null=True)
    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all()
    )

    class Meta:
        model = Address
        fields = ['id', 'street', 'district',
                  'createdAt', 'reference', 'student']


class GenderSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source='gender_name')

    class Meta:
        model = Gender
        fields = ['id', 'name']


class StudentSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(read_only=True)
    code = serializers.CharField(read_only=True)
    firstName = serializers.CharField(source='first_name')
    paternalSurname = serializers.CharField(source='paternal_surname')
    maternalSurname = serializers.CharField(source='maternal_surname')
    birthDate = serializers.DateField(source='birth_date')
    email = serializers.CharField(allow_blank=True, allow_null=True)
    phone = serializers.CharField(allow_blank=True, allow_null=True)

    statusId = serializers.PrimaryKeyRelatedField(
        source='enrollment_status',
        queryset=EnrollmentStatus.objects.all()
    )
    statusName = serializers.CharField(
        source='enrollment_status.status_name', read_only=True
    )

    genderId = serializers.PrimaryKeyRelatedField(
        source='gender',
        queryset=Gender.objects.all()
    )
    genderName = serializers.CharField(
        source='gender.gender_name', read_only=True
    )

    weight = serializers.FloatField(allow_null=True)
    height = serializers.FloatField()
    dni = serializers.CharField(source='national_id')
    isActive = serializers.BooleanField(source='is_active')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    fullName = serializers.CharField(source='full_name', read_only=True)

    class Meta:
        model = Student
        fields = [
            'uuid',
            'code',
            'firstName',
            'paternalSurname',
            'maternalSurname',
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
            'createdAt',
        ]


class StudentDetailSerializer(StudentSerializer):
    gender = GenderSerializer()
    evaluations = serializers.SerializerMethodField()
    address = AddressDetailSerializer(read_only=True)

    class Meta(StudentSerializer.Meta):
        model = Student
        fields = StudentSerializer.Meta.fields + \
            ['address', 'evaluations', 'gender']

    def get_evaluations(self, obj):
        # Custom logic to retrieve evaluations for the student
        return []
