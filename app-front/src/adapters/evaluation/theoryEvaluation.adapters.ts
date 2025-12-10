import type { TheoryEvaluationResponse, TheoryEvaluation } from "@evaluations/models";

export const TheoryEvaluationAdapter = (
  dto: TheoryEvaluationResponse
): TheoryEvaluation => ({
  id: dto.id,
  studentEvaluationId: dto.studentEvaluationId,
  evaluationId: dto.evaluationId,
  performedAt: dto.performedAt,
  result: dto.result,
  observations: dto.observations,
  grade: dto.grade !== null ? Number(dto.grade) : null,
});
