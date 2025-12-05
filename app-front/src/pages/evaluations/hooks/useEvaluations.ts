// hooks/useEvaluations.ts
import { useQuery } from "@tanstack/react-query";
import { getEvaluations } from "@/services";
import type { EvaluationResponse } from "@/models";

export const useEvaluations = () => {
    return useQuery<EvaluationResponse[]>({
        queryKey: ["evaluations"],
        queryFn: getEvaluations,
    });
};
