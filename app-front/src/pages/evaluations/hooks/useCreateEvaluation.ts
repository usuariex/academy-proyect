
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvaluation } from "@/services/evaluation";
import type { EvaluationRequest, Evaluation } from "@/models/evaluation";

export const useCreateEvaluation = () => {
    const qc = useQueryClient();
    return useMutation<Evaluation, Error, EvaluationRequest>({
        mutationFn: (payload) => createEvaluation(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["evaluations"] });
            qc.invalidateQueries({ queryKey: ["evaluationTypes"] });
            qc.invalidateQueries({ queryKey: ["exercises"] });
            qc.invalidateQueries({ queryKey: ["theoryConfigs"] });
        },
    });
};
