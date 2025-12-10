import { api } from "@/services";
import type { TheoryEvaluationResponse, TheoryEvaluationPayload, TheoryEvaluation } from "@evaluations/models";
import { TheoryEvaluationAdapter } from "@/adapters/evaluation";

// GET por studentEvaluationId
export const getTheoryEvaluationByStudent = async (
  studentEvaluationId: number
): Promise<TheoryEvaluation | null> => {
  const res = await api.get<TheoryEvaluationResponse[]>("/evaluations/theory/", {
    params: { studentEvaluationId },
  });

  if (Array.isArray(res.data) && res.data.length > 0) {
    return TheoryEvaluationAdapter(res.data[0]); // devolvemos modelo frontend
  }
  return null;
};

export const updateTheoryEvaluationByStudent = async (
  payload: TheoryEvaluationPayload
): Promise<TheoryEvaluation> => {
  const res = await api.patch<TheoryEvaluationResponse>(
    "/evaluations/theory/update-by-student/",
    payload
  );
  return TheoryEvaluationAdapter(res.data); // adapta aquí
};