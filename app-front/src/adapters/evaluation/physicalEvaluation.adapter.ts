import type { PhysicalEvaluationResponse, PhysicalEvaluation } from "@evaluations/models";

export const PhysicalEvaluationAdapter = (
    dto: PhysicalEvaluationResponse
): PhysicalEvaluation => ({
    id: dto.id,
    studentEvaluationId: dto.studentEvaluationId,
    evaluationId: dto.evaluationId,
    performedAt: dto.performedAt,
    result: dto.result, // ej: "3'34\""
    observations: dto.observations,
    grade: dto.grade !== null ? Number(dto.grade) : null,
});
