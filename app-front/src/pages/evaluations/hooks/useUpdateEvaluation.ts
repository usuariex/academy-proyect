import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEvaluation } from "@/services/evaluation";
import type { EvaluationRequest, Evaluation } from "@/models/evaluation";

export function useUpdateEvaluation(code: string, hasGradedStudents: boolean) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (payload: Partial<EvaluationRequest>): Promise<Evaluation> => {
            const safePayload = {
                ...payload,
                plannedDate: hasGradedStudents ? undefined : payload.plannedDate,
            };
            return updateEvaluation(code, safePayload);
        },
        onSuccess: () => {
            // fuerza refetch de la tabla
            queryClient.invalidateQueries({ queryKey: ["evaluations"] });
        },
    });

    return {
        update: mutation.mutateAsync,
        isSaving: mutation.isPending,
        error: mutation.error ? String(mutation.error) : null,
    };
}
