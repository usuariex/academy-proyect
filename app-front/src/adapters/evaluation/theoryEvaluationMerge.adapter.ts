// adapters/evaluation.ts
import type { TheoryEvaluation } from "@evaluations/models";
import type { StudentEvaluation } from "@/models/student";

export const TheoryEvaluationMergeAdapter = (
    model: TheoryEvaluation, // ahora recibe el modelo adaptado
    base: StudentEvaluation
): StudentEvaluation => {
    return {
        ...base,
        performedAt: model.performedAt,
        result: model.result,
        observations: model.observations,
        grade: model.grade, // ya es number | null
    };
};
