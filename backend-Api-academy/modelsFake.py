
router.register(r'students/info', EvaluationStudentDetailViewSet,
                basename='evaluation-student-detail')


class EvaluationStudentDetailViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    pagination_class = EvaluationStudentPagination

    def get_queryset(self):
        evaluation_id = self.request.query_params.get('evaluationId')
        filter_param = self.request.query_params.get('filter', 'all')
        search = self.request.query_params.get('search', '')

        qs = EvaluationStudent.objects.select_related('student', 'evaluation')

        if evaluation_id:
            qs = qs.filter(evaluation_id=int(evaluation_id))

        if filter_param == 'sinCalificar':
            qs = qs.filter(final_grade__isnull=True)
        elif filter_param == 'calificados':
            qs = qs.filter(final_grade__isnull=False)
        elif filter_param == 'desaprobados':
            qs = qs.filter(final_grade__lt=UMBRAL_APROBACION)
        elif filter_param == 'aprobados':
            qs = qs.filter(final_grade__gte=UMBRAL_APROBACION)

        if search:
            qs = qs.filter(student__first_name__icontains=search)

        return qs.order_by('student__first_name')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            EvaluationStudentDetailSerializer
        return EvaluationStudentSerializer


class EvaluationStudentDetailSerializer(serializers.ModelSerializer):
    studentId = serializers.UUIDField(source='student.uuid')
    studentCode = serializers.CharField(source='student.code')
    firstName = serializers.CharField(source='student.first_name')
    fullName = serializers.CharField(source='student.full_name')
    email = serializers.CharField(source='student.email')
    phone = serializers.CharField(source='student.phone')
    dni = serializers.CharField(source='student.national_id')
    genderId = serializers.IntegerField(source='student.gender.id')
    statusId = serializers.IntegerField(source='student.enrollment_status.id')
    status = serializers.SerializerMethodField()
    finalGrade = serializers.DecimalField(
        source='final_grade', max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = EvaluationStudent
        fields = [
            'id',
            'evaluationId',
            'studentId',
            'firstName',
            'fullName',
            'paternalSurname',
            'email',
            'phone',
            'dni',
            'genderId',
            'statusId',
            'finalGrade',
            'status',
            'studentCode'
        ]
