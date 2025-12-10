// hooks/useEvaluations.ts
import { useQuery } from "@tanstack/react-query";
import { getEvaluations } from "@/services/evaluation";
import type { EvaluationResponse } from "@/models/evaluation";

export const useEvaluations = () => {
    return useQuery<EvaluationResponse[]>({
        queryKey: ["evaluations"],
        queryFn: getEvaluations,
    });
};
