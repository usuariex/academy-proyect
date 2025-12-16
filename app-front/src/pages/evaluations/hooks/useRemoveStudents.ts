import { useSelectedEvaluation } from "@evaluations/hooks";
import { removeStudentsFromEvaluation } from "@/services/evaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RemoveStudentsRequest } from "@evaluations/models/";

export const useRemoveStudents = () => {
    const { selectedEvaluation } = useSelectedEvaluation();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: RemoveStudentsRequest) =>
            removeStudentsFromEvaluation(selectedEvaluation!.code, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["studentsByEvaluation", selectedEvaluation!.code] });
        },
    });
};