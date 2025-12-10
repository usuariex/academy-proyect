import { ExerciseAdapter } from "@/adapters";
import type { Exercise, ExerciseResponse } from "@evaluations/models";
import { api } from "@/services";

export const getExercises = async (): Promise<Exercise[]> => {
    const res = await api.get<ExerciseResponse[]>("/evaluations/exercises/");
    const data = res.data;
    return data.map(ExerciseAdapter);
};