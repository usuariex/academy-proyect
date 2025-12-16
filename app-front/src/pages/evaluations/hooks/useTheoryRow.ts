import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { StudentEvaluation } from "@/models/student";
import { updateTheoryEvaluationByStudent } from "@/services/evaluation";
import { TheoryEvaluationMergeAdapter } from "@/adapters/evaluation";
import { useSelectedEvaluation } from "@evaluations/hooks";

export const useTheoryRow = (base: StudentEvaluation) => {
    const [row, setRow] = useState<StudentEvaluation>(base);
    const [isEditing, setEditing] = useState(false);
    const [draftResult, setDraftResult] = useState<number | null>(row.result);

    const queryClient = useQueryClient();
    const { selectedEvaluation } = useSelectedEvaluation(); // 👈 acceso al objeto completo

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            return updateTheoryEvaluationByStudent(payload);
        },
        onSuccess: (model) => {
            // actualiza la fila local
            setRow(TheoryEvaluationMergeAdapter(model, row));
            setEditing(false);

            // invalida la query global para refrescar la lista
            if (selectedEvaluation) {
                queryClient.invalidateQueries({
                    queryKey: ["studentsByEvaluation", selectedEvaluation.code],
                });
            }
        },
    });

    const startEdit = () => setEditing(true);

    const cancelEdit = () => {
        setEditing(false);
        setDraftResult(row.result);
    };

    const save = async () => {
        if (draftResult == null) return;

        const payload: any = {
            studentEvaluationId: row.studentEvaluationId,
            result: draftResult,
        };
        if (row.observations != null) payload.observations = row.observations;
        if (row.performedAt != null) payload.performedAt = row.performedAt;

        mutation.mutate(payload);
    };

    return {
        row,
        isEditing,
        draftResult,
        setDraftResult,
        startEdit,
        cancelEdit,
        save,
        isSaving: mutation.isPending,
    };
};
