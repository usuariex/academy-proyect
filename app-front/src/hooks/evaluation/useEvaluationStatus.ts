// hooks/useStatuses.ts
import { useQuery } from "@tanstack/react-query";
import { getEvaluationStatus } from "@/services/evaluation";
import type { evaluationStatus } from "@evaluations/models";

export const useEvaluationStatus = () => {
    return useQuery<evaluationStatus[]>({
        queryKey: ["evaluationStatus"],
        queryFn: getEvaluationStatus,
        staleTime: 1000 * 60 * 5, // cache 5 minutos
    });
};
