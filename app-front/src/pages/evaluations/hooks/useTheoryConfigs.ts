import { useQuery } from "@tanstack/react-query";
import { getTheoryConfigs } from "@/services/evaluation/theoryConfig";
import type { TheoryConfig } from "@evaluations/models/";

export const useTheoryConfigs = () => {
    return useQuery<TheoryConfig[]>({
        queryKey: ["theoryConfigs"],
        queryFn: getTheoryConfigs,
        staleTime: 1000 * 60 * 5,
    });
};
