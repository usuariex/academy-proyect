// hooks/useEvaluationTypes.ts

import { useQuery } from "@tanstack/react-query";
import { getEvaluationTypes } from "@/services/evaluation";
import type { EvaluationType } from "@/models/evaluation";

export const useEvaluationTypes = () => {
    return useQuery<EvaluationType[]>({
        queryKey: ["evaluationTypes"],
        queryFn: getEvaluationTypes,
        staleTime: 1000 * 60 * 5,
    });
};
