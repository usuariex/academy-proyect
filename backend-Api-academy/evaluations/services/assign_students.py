
from students.models import Student
from evaluations.models import EvaluationStudent, TheoryEvaluation, PhysicalEvaluation


def eligible_students(evaluation):
    """
    Devuelve los estudiantes aptos para una evaluación según reglas de negocio:
    - Activos
    - Estado de matrícula válido (Matriculado)
    - Si es Teórica: no se filtra por ejercicio
    - Si es Física: compatibilidad de género con el ejercicio
    """

    qs = Student.objects.filter(
        is_active=True,
        enrollment_status__status_name="Matriculado"
    )

    if evaluation.type.type_name == "Teorica":
        return qs

    if evaluation.type.type_name == "Fisica":
        eval_exercise = evaluation.evaluation_exercises.first()
        if not eval_exercise:
            return qs.none()

        exercise_name = eval_exercise.exercise.exercise_name.lower().strip()

        FEMALE_EXERCISES = {"100m", "abdominales", "1000m", "natacion"}
        MALE_EXERCISES = {"100m", "barras", "1000m", "natacion"}

        if exercise_name in FEMALE_EXERCISES:
            qs = qs.filter(gender__gender_name="Femenino")
        elif exercise_name in MALE_EXERCISES:
            qs = qs.filter(gender__gender_name="Masculino")
        else:
            qs = qs.none()

    return qs


def assign_students(evaluation):
    for student in eligible_students(evaluation):
        eval_student, created = EvaluationStudent.objects.get_or_create(
            evaluation=evaluation,
            student=student
        )
        if created:
            if evaluation.type.type_name == "Teorica":
                TheoryEvaluation.objects.get_or_create(
                    evaluation_student=eval_student)
            elif evaluation.type.type_name == "Fisica":
                PhysicalEvaluation.objects.get_or_create(
                    evaluation_student=eval_student)
