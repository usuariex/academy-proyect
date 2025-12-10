from django.db.models import OuterRef, Subquery
from evaluations.models import Evaluation, TheoryEvaluation, PhysicalEvaluation


def subquery_latest_theory_grade():
    qs = TheoryEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-performed_at', '-theory_eval_id').values('grade')[:1]
    return Subquery(qs)


def subquery_latest_theory_result():
    qs = TheoryEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-performed_at', '-theory_eval_id').values('result')[:1]
    return Subquery(qs)


def subquery_latest_theory_performed_at():
    qs = TheoryEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-performed_at', '-theory_eval_id').values('performed_at')[:1]
    return Subquery(qs)


def subquery_latest_theory_observations():
    qs = TheoryEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-performed_at', '-theory_eval_id').values('observations')[:1]
    return Subquery(qs)


def subquery_physical_grade():
    qs = PhysicalEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-performed_at', '-pk').values('grade')[:1]
    return Subquery(qs)


def subquery_physical_result():
    qs = PhysicalEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-performed_at', '-pk').values('result')[:1]
    return Subquery(qs)


def subquery_physical_performed_at():
    qs = PhysicalEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-performed_at', '-pk').values('performed_at')[:1]
    return Subquery(qs)


def subquery_physical_observations():
    qs = PhysicalEvaluation.objects.filter(
        evaluation_student=OuterRef('pk')
    ).order_by('-performed_at', '-pk').values('observations')[:1]
    return Subquery(qs)
