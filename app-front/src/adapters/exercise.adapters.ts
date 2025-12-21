
import type { ExerciseResponse, Exercise } from "@evaluations/models";

export const ExerciseAdapter = (data: ExerciseResponse): Exercise => ({
    id: data.id,
    name: data.name,
    unit: data.unit,
    isActive: data.isActive,
    criteriaType: data.criteriaType
});
