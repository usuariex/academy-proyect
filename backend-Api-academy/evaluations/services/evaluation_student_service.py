from django.db.models import OuterRef, Subquery
from evaluations.models import TheoryEvaluation, PhysicalEvaluation


def subquery_latest_theory_grade():
    qs = TheoryEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-attempt_number').values('grade')[:1]
    return Subquery(qs)


def subquery_latest_theory_result():
    qs = TheoryEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-attempt_number').values('result')[:1]
    return Subquery(qs)


def subquery_latest_theory_performed_at():
    qs = TheoryEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-attempt_number').values('performed_at')[:1]
    return Subquery(qs)


def subquery_latest_theory_attempt_number():
    qs = TheoryEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-attempt_number').values('attempt_number')[:1]
    return Subquery(qs)


def subquery_latest_theory_observations():
    qs = TheoryEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-attempt_number').values('observations')[:1]
    return Subquery(qs)


def subquery_physical_grade():
    qs = PhysicalEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).values('grade')[:1]
    return Subquery(qs)


def subquery_physical_result():
    qs = PhysicalEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).values('result')[:1]
    return Subquery(qs)


def subquery_physical_observations():
    qs = PhysicalEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).values('observations')[:1]
    return Subquery(qs)


def subquery_physical_exercise_name():
    qs = PhysicalEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).select_related('exercise').values('exercise__exercise_name')[:1]
    return Subquery(qs)
