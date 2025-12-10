
from datetime import date
from django.db import transaction, IntegrityError
from django.core.exceptions import ObjectDoesNotExist

from evaluations.models import (
    Evaluation,
    EvaluationExercise,
    TheoryEvaluationConfig,
    SequenceEvaluation,
    Exercise,
    TheoryConfig,
)


class EvaluationServiceError(Exception):
    pass


class EvaluationAssignmentError(EvaluationServiceError):
    pass


def _generate_name_and_code(evaluation_type):
    today = date.today()
    date_str = today.strftime("%Y-%m%d")  # e.g. 2025-1206

    type_name_str = evaluation_type.type_name.strip().lower()
    if "fisica" in type_name_str:
        suffix = "EFI"
    elif "teorica" in type_name_str:
        suffix = "ETE"
    else:
        suffix = "GEN"

    last_by_type = Evaluation.objects.filter(
        type=evaluation_type).order_by("-id").first()
    if last_by_type and "-" in last_by_type.name:
        try:
            last_type_number = int(last_by_type.name.split("-")[-1])
        except ValueError:
            last_type_number = 0
    else:
        last_type_number = 0

    new_type_number = last_type_number + 1
    name = f"{date_str}-{suffix}-{new_type_number:02d}"

    new_global_number = SequenceEvaluation.next_number()
    code = f"{date_str}-{suffix}-{new_global_number:06d}"

    return name, code


def create_evaluation_with_assignment(validated_data, exercise_id=None, config_id=None, user=None):
    """
    Crea Evaluation con name/code generados y opcionalmente:
      - si exercise_id: crea EvaluationExercise(evaluation, exercise)
      - si config_id: crea TheoryEvaluationConfig(evaluation, config)
    Todo en una transacción atómica. Lanza EvaluationAssignmentError en errores.
    """
    if exercise_id is not None and config_id is not None:
        raise EvaluationAssignmentError(
            "Solo se puede enviar exercise_id o config_id, no ambos.")

    try:
        exercise = None
        config = None

        if exercise_id is not None:
            try:
                exercise = Exercise.objects.get(pk=exercise_id)
            except ObjectDoesNotExist:
                raise EvaluationAssignmentError(
                    f"Exercise con id {exercise_id} no existe.")

        if config_id is not None:
            try:
                config = TheoryConfig.objects.get(pk=config_id)
            except ObjectDoesNotExist:
                raise EvaluationAssignmentError(
                    f"TheoryConfig con id {config_id} no existe.")

        with transaction.atomic():
            name, code = _generate_name_and_code(validated_data["type"])
            evaluation = Evaluation.objects.create(
                name=name, code=code, **validated_data)

            if exercise is not None:
                EvaluationExercise.objects.create(
                    evaluation=evaluation, exercise=exercise)

            if config is not None:
                TheoryEvaluationConfig.objects.create(
                    evaluation=evaluation, config=config)

            return evaluation

    except IntegrityError as exc:
        raise EvaluationAssignmentError(
            "Conflicto al crear la evaluación o la asignación.") from exc
