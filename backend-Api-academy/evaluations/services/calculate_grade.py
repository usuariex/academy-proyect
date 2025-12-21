from decimal import Decimal, ROUND_HALF_UP
from evaluations.models import FixedCriteria, RangeCriteria, TheoryConfig


def calculate_theory_grade(result: int, config_id: int) -> Decimal | None:
    """
    Calcula la nota en base al número de respuestas correctas (result)
    y el total de preguntas definido en la configuración teórica.

    Fórmula: (result / total_questions) * 20
    """
    try:
        config = TheoryConfig.objects.get(pk=config_id, is_active=True)
    except TheoryConfig.DoesNotExist:
        return None

    total_questions = config.total_questions
    if total_questions <= 0 or result is None:
        return None

    grade = (Decimal(result) / Decimal(total_questions)) * Decimal(20)
    return grade.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def calculate_physical_grade(exercise, gender, result):
    """
    Calcula la nota física según el tipo de criterio del ejercicio.
    - Si el criterio es 'fijo', busca coincidencia exacta.
    - Si el criterio es 'rango', busca el rango donde cae el resultado.
    """

    tipo = (exercise.criteria_type or "").lower()

    if tipo == "fijo":
        criterio = FixedCriteria.objects.filter(
            exercise=exercise,
            gender=gender,
            exact_value=result
        ).first()

    elif tipo == "rango":
        criterio = RangeCriteria.objects.filter(
            exercise=exercise,
            gender=gender,
            min_value__lte=result,
            max_value__gte=result
        ).first()

    else:
        raise ValueError(f"tipo_criterio inválido: {exercise.criteria_type}")

    return criterio.grade if criterio else None
