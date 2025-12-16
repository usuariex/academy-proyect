// hooks/useAssignStudents.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedEvaluation } from "@evaluations/hooks";
import { assignStudentsToEvaluation } from "@/services/evaluation";
import type { AssignStudents, AssignStudentsRequest } from "@evaluations/models";

export const useAssignStudents = () => {
    const { selectedEvaluation } = useSelectedEvaluation();
    const queryClient = useQueryClient();

    return useMutation<AssignStudents, Error, AssignStudentsRequest>({
        mutationFn: async (payload) => {
            if (!selectedEvaluation) throw new Error("No evaluation selected");
            return assignStudentsToEvaluation(selectedEvaluation.code, payload);
        },
        onSuccess: () => {
            if (selectedEvaluation) {
                queryClient.invalidateQueries({
                    queryKey: ["studentsByEvaluation", selectedEvaluation.code],
                });
            }
        },
    });
};
