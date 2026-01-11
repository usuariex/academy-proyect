
import { api } from "@/services/";
import type { PhysicalEvaluationRequest, PhysicalEvaluationResponse, PhysicalEvaluation } from "@evaluations/models";
import { PhysicalEvaluationAdapter } from "@/adapters/evaluation";

export const updatePhysicalEvaluationByStudent = async (
    payload: PhysicalEvaluationRequest
): Promise<PhysicalEvaluation> => {
    const res = await api.patch<PhysicalEvaluationResponse>(
        "/evaluations/physical/update-by-student/",
        payload
    );
    return PhysicalEvaluationAdapter(res.data);
};
