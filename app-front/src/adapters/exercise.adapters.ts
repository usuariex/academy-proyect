
import type { ExerciseResponse, Exercise } from "@evaluations/models";

export const ExerciseAdapter = (data: ExerciseResponse): Exercise => ({
    id: data.exercise_id,
    name: data.exercise_name ?? data.name, // preferimos exercise_name si existe
    unit: data.unit,
    isActive: data.is_active,
});
