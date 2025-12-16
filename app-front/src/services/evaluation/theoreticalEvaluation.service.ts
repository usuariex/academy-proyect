import { api } from "@/services";
import type { TheoryEvaluationResponse, TheoryEvaluationRequest, TheoryEvaluation } from "@evaluations/models";
import { TheoryEvaluationAdapter } from "@/adapters/evaluation";


export const getTheoryEvaluationByStudent = async (
  studentEvaluationId: number
): Promise<TheoryEvaluation | null> => {
  const res = await api.get<TheoryEvaluationResponse[]>("/evaluations/theory/", {
    params: { studentEvaluationId },
  });

  if (Array.isArray(res.data) && res.data.length > 0) {
    return TheoryEvaluationAdapter(res.data[0]);
  }
  return null;
};



export const updateTheoryEvaluationByStudent = async (
  payload: TheoryEvaluationRequest
): Promise<TheoryEvaluation> => {
  const res = await api.patch<TheoryEvaluationResponse>(
    "/evaluations/theory/update-by-student/",
    payload
  );
  return TheoryEvaluationAdapter(res.data); // adapta aquí
};