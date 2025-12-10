from decimal import Decimal, ROUND_HALF_UP
from evaluations.models import TheoryConfig


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
