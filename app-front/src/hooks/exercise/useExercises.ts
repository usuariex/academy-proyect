// hooks/useExercises.ts

import { useQuery } from "@tanstack/react-query";
import { getExercises } from "@/services/evaluation";
import type { Exercise } from "@evaluations/models";

export const useExercises = () => {
    return useQuery<Exercise[]>({
        queryKey: ["exercises"],
        queryFn: getExercises,
        staleTime: 1000 * 60 * 5, // cache 5 minutos
    });
};
