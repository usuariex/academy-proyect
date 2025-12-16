from django.shortcuts import get_object_or_404
from .services.assign_students import assign_students, eligible_students
from .services.evaluation_student_service import (
    subquery_latest_theory_grade,
    subquery_latest_theory_result,
    subquery_latest_theory_performed_at,
    subquery_latest_theory_observations,
    subquery_physical_grade,
    subquery_physical_result,
    subquery_physical_performed_at,
    subquery_physical_observations,
)

from django.db.models import (
    Case, When, OuterRef, Subquery, Value, F,
    CharField, IntegerField, FloatField, DateField, Count
)
from django.db.models.functions import Coalesce, Concat

from .serializers import EvaluationStudentSerializer, EvaluationSerializer
from .pagination import EvaluationStudentPagination
from statistics import mean, median
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action

from rest_framework.response import Response
from students.models import Student
from students.serializers import StudentSerializer

from .models import EvaluationStatus, TheoryEvaluation, EvaluationType, Exercise, TheoryConfig, EvaluationExercise, Evaluation, Evaluation, EvaluationStudent, TheoryEvaluationConfig, PhysicalEvaluation

from .serializers import EvaluationStatusSerializer, TheoryEvaluationSerializer, EvaluationTypeSerializer, ExerciseSerializer, TheoryConfigSerializer, EvaluationStudentSerializer, TheoryEvaluationConfigSerializer, EvaluationSerializer, PhysicalEvaluationSerializer


class EvaluationStatusViewSet(viewsets.ModelViewSet):
    queryset = EvaluationStatus.objects.all()
    serializer_class = EvaluationStatusSerializer


class EvaluationTypeViewSet(viewsets.ModelViewSet):
    queryset = EvaluationType.objects.all()
    serializer_class = EvaluationTypeSerializer


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer


class TheoryConfigViewSet(viewsets.ModelViewSet):
    queryset = TheoryConfig.objects.all()
    serializer_class = TheoryConfigSerializer


class TheoryEvaluationConfigViewSet(viewsets.ModelViewSet):
    queryset = TheoryEvaluationConfig.objects.all()
    serializer_class = TheoryEvaluationConfigSerializer


class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.select_related('type', 'status')
    serializer_class = EvaluationSerializer
    lookup_field = "code"

    def get_queryset(self):
        return Evaluation.objects.annotate(
            students_count=Count('evaluationstudent')
        )

    @action(detail=True, methods=['get'], url_path='summary')
    def summary(self, request, code=None):
        evaluation = self.get_object()
        students = EvaluationStudent.objects.filter(evaluation=evaluation)

        # recolectar calificaciones según tipo
        grades = []
        for s in students:
            if evaluation.type.type_name == "Teorica":
                grade = TheoryEvaluation.objects.filter(
                    evaluation_student=s
                ).values_list('grade', flat=True).first()
            elif evaluation.type.type_name == "Fisica":
                grade = PhysicalEvaluation.objects.filter(
                    evaluation_student=s
                ).values_list('grade', flat=True).first()
            else:
                grade = None
            if grade is not None:
                grades.append(float(grade))

        # métricas básicas
        total = students.count()
        approved = sum(1 for s in students if s.get_status() == "aprobado")
        failed = sum(1 for s in students if s.get_status() == "desaprobado")
        ungraded = sum(1 for s in students if s.get_status() == "sinCalificar")

        # distribución de notas
        grade_distribution = {
            "0-10": sum(1 for g in grades if g <= 10),
            "11-15": sum(1 for g in grades if 11 <= g <= 15),
            "16-20": sum(1 for g in grades if g >= 16),
        }

        # distribución de estados en porcentaje
        status_distribution = {
            "approved": round((approved / total) * 100, 2) if total else 0,
            "failed": round((failed / total) * 100, 2) if total else 0,
            "ungraded": round((ungraded / total) * 100, 2) if total else 0,
        }

        return Response({
            "code": evaluation.code,
            "evaluationName": evaluation.name,
            "evaluationType": evaluation.type.type_name,
            "plannedDate": evaluation.planned_date,
            "statusName": evaluation.status.status_name,
            "totalStudents": total,
            "approved": approved,
            "failed": failed,
            "ungraded": ungraded,
            "averageGrade": mean(grades) if grades else None,
            "maxGrade": max(grades) if grades else None,
            "minGrade": min(grades) if grades else None,
            "medianGrade": median(grades) if grades else None,
            "gradeDistribution": grade_distribution,
            "statusDistribution": status_distribution,
        })

    @action(detail=True, methods=["get"], url_path="students")
    def students(self, request, code=None):
        evaluation = self.get_object()

        # --- asignados ---
        qs = EvaluationStudent.objects.select_related(
            "student", "evaluation", "evaluation__type"
        ).filter(evaluation=evaluation)

        # Subqueries para teoría
        theory_grade_subq = subquery_latest_theory_grade()
        theory_result_subq = subquery_latest_theory_result()
        theory_performed_at_subq = subquery_latest_theory_performed_at()
        theory_observations_subq = subquery_latest_theory_observations()

        # Subqueries para física
        physical_grade_subq = subquery_physical_grade()
        physical_result_subq = subquery_physical_result()
        physical_performed_at_subq = subquery_physical_performed_at()
        physical_observations_subq = subquery_physical_observations()

        # Subqueries para ejercicio/config
        exercise_id_subq = Subquery(
            EvaluationExercise.objects
            .filter(evaluation=OuterRef("evaluation"))
            .values("exercise_id")[:1],
            output_field=IntegerField()
        )
        exercise_name_subq = Subquery(
            EvaluationExercise.objects
            .filter(evaluation=OuterRef("evaluation"))
            .values("exercise__exercise_name")[:1],
            output_field=CharField()
        )
        config_id_subq = Subquery(
            TheoryEvaluationConfig.objects
            .filter(evaluation=OuterRef("evaluation"))
            .values("config_id")[:1],
            output_field=IntegerField()
        )
        config_name_subq = Subquery(
            TheoryEvaluationConfig.objects
            .filter(evaluation=OuterRef("evaluation"))
            .values("config__config_name")[:1],
            output_field=CharField()
        )

        qs = qs.annotate(
            assigned_exercise_id=exercise_id_subq,
            assigned_exercise_name=exercise_name_subq,
            assigned_config_id=config_id_subq,
            assigned_config_name=config_name_subq,
            theory_grade=theory_grade_subq,
            theory_result=theory_result_subq,
            theory_performed_at=theory_performed_at_subq,
            theory_observations=theory_observations_subq,
            physical_grade=physical_grade_subq,
            physical_result=physical_result_subq,
            physical_performed_at=physical_performed_at_subq,
            physical_observations=physical_observations_subq,
            student_uuid=F("student__uuid"),
            student_full_name=Concat(
                Coalesce(F("student__first_name"), Value("")),
                Value(" "),
                Coalesce(F("student__paternal_surname"), Value("")),
                Value(" "),
                Coalesce(F("student__maternal_surname"), Value("")),
                output_field=CharField(),
            ),
            annotated_grade=Case(
                When(evaluation__type__type_name="Fisica",
                     then=F("physical_grade")),
                default=F("theory_grade"),
                output_field=FloatField(),
            ),
            annotated_result=Case(
                When(evaluation__type__type_name="Fisica",
                     then=F("physical_result")),
                default=F("theory_result"),
                output_field=FloatField(),
            ),
            annotated_observations=Case(
                When(evaluation__type__type_name="Fisica",
                     then=F("physical_observations")),
                default=F("theory_observations"),
                output_field=CharField(),
            ),
            performed_at_unified=Case(
                When(evaluation__type__type_name="Fisica",
                     then=F("physical_performed_at")),
                default=F("theory_performed_at"),
                output_field=DateField(),
            )
        ).order_by("student_full_name")

        # paginación de asignados
        paginator_assigned = EvaluationStudentPagination()
        page_assigned = paginator_assigned.paginate_queryset(qs, request)
        assigned_serializer = EvaluationStudentSerializer(
            page_assigned, many=True, context={'request': request}
        )

        # --- aptos pero no asignados ---
        eligible_qs = eligible_students(evaluation).exclude(
            uuid__in=qs.values_list("student__uuid", flat=True)
        ).order_by("first_name")

        # paginación de aptos
        paginator_available = EvaluationStudentPagination()
        page_available = paginator_available.paginate_queryset(
            eligible_qs, request)
        available_serializer = StudentSerializer(
            page_available, many=True, context={'request': request}
        )

        return Response({
            "assigned": assigned_serializer.data,
            "available": available_serializer.data,
            "pagination": {
                "assigned": paginator_assigned.get_paginated_response({}).data,
                "available": paginator_available.get_paginated_response({}).data,
            }
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="assign-students")
    def assign_students(self, request, code=None):
        evaluation = self.get_object()
        student_uuids = request.data.get("students", [])

        created, skipped = [], []

        for uuid in student_uuids:
            student = get_object_or_404(Student, uuid=uuid)

            # Crear relación EvaluationStudent
            eval_student, created_flag = EvaluationStudent.objects.get_or_create(
                evaluation=evaluation,
                student=student
            )

            if created_flag:
                created.append(uuid)

                # Según el tipo de evaluación, crear registro inicial
                if evaluation.type.type_name == "Teorica":
                    TheoryEvaluation.objects.get_or_create(
                        evaluation_student=eval_student
                    )
                elif evaluation.type.type_name == "Fisica":
                    PhysicalEvaluation.objects.get_or_create(
                        evaluation_student=eval_student
                    )
            else:
                skipped.append(uuid)

        return Response({
            "assigned": created,
            "already_assigned": skipped,
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="remove-students")
    def remove_students(self, request, code=None):
        evaluation = self.get_object()
        student_uuids = request.data.get("students", [])

        removed, not_found = [], []

        for uuid in student_uuids:
            try:
                student = Student.objects.get(uuid=uuid)
                eval_student = EvaluationStudent.objects.filter(
                    evaluation=evaluation,
                    student=student
                ).first()

                if eval_student:
                    eval_student.delete()
                    removed.append(uuid)
                else:
                    not_found.append(uuid)
            except Student.DoesNotExist:
                not_found.append(uuid)

        return Response(
            {
                "removed": removed,
                "not_found": not_found,
            },
            status=status.HTTP_200_OK
        )

    def perform_create(self, serializer):
        evaluation = serializer.save()
        if evaluation.status.status_name == "Programada":
            assign_students(evaluation)

    def perform_update(self, serializer):
        evaluation_obj = self.get_object()
        old_status = evaluation_obj.status.status_name
        evaluation = serializer.save()
        new_status = evaluation.status.status_name

        if old_status != "Programada" and new_status == "Programada":

            assign_students(evaluation)

    def destroy(self, request, *args, **kwargs):
        evaluation = self.get_object()
        students_count = EvaluationStudent.objects.filter(
            evaluation=evaluation).count()

        if students_count > 0:
            return Response(
                {"detail": "No se puede eliminar: la evaluación tiene estudiantes asociados."},
                status=status.HTTP_409_CONFLICT
            )

        return super().destroy(request, *args, **kwargs)


class TheoryEvaluationViewSet(viewsets.ModelViewSet):
    queryset = TheoryEvaluation.objects.select_related('evaluation_student')
    serializer_class = TheoryEvaluationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Permite filtrar por studentEvaluationId en query params.
        Ejemplo: GET /api/evaluations/theory/?studentEvaluationId=123
        """
        student_eval_id = self.request.query_params.get('studentEvaluationId')
        qs = super().get_queryset()
        if student_eval_id:
            qs = qs.filter(evaluation_student_id=student_eval_id)
        return qs

    def get_serializer_context(self):
        """
        Resuelve automáticamente el config_id a partir de studentEvaluationId
        cuando se hace POST o PATCH.
        """
        context = super().get_serializer_context()
        student_eval_id = self.request.data.get("studentEvaluationId")

        if student_eval_id:
            try:
                es = EvaluationStudent.objects.get(pk=student_eval_id)
                tec = TheoryEvaluationConfig.objects.filter(
                    evaluation=es.evaluation).first()
                if tec:
                    context["config_id"] = tec.config_id
            except EvaluationStudent.DoesNotExist:
                pass

        return context

    @action(detail=False, methods=["patch"], url_path="update-by-student")
    def update_by_student(self, request):
        """
        Actualiza un registro de TheoryEvaluation usando studentEvaluationId en el body.
        Ejemplo:
        PATCH /api/evaluations/theory/update-by-student/
        {
          "studentEvaluationId": 1,
          "result": 25,
          "observations": "Alumno respondió la mitad"
        }
        """
        student_eval_id = request.data.get("studentEvaluationId")
        if not student_eval_id:
            return Response(
                {"detail": "studentEvaluationId is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            instance = TheoryEvaluation.objects.get(
                evaluation_student_id=student_eval_id)
        except TheoryEvaluation.DoesNotExist:
            return Response(
                {"detail": "TheoryEvaluation not found for this studentEvaluationId"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class PhysicalEvaluationViewSet(viewsets.ModelViewSet):
    queryset = PhysicalEvaluation.objects.select_related(
        'evaluation_student')
    serializer_class = PhysicalEvaluationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        student_eval_id = self.request.query_params.get('studentEvaluationId')
        qs = super().get_queryset()
        if student_eval_id:
            qs = qs.filter(evaluation_student_id=student_eval_id)
        return qs
