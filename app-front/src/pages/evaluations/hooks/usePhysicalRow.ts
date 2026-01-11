import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { StudentEvaluation } from "@/models/student";
import { updatePhysicalEvaluationByStudent } from "@/services/evaluation";
import { PhysicalEvaluationMergeAdapter } from "@/adapters/evaluation";
import { useSelectedEvaluation } from "@evaluations/hooks";



export const usePhysicalRow = (base: StudentEvaluation) => {
    // Estado local de la fila
    const [row, setRow] = useState<StudentEvaluation>(base);
    const [isEditing, setEditing] = useState(false);
    const [draftResult, setDraftResult] = useState<string | null>(row.result);

    const queryClient = useQueryClient();
    const { selectedEvaluation } = useSelectedEvaluation();

    // Mutación para actualizar la evaluación física
    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            return updatePhysicalEvaluationByStudent(payload);
        },
        onSuccess: (model) => {
            // Fusiona el modelo físico con la fila base
            setRow(PhysicalEvaluationMergeAdapter(model, row));
            setEditing(false);

            // Invalida la query global para refrescar la lista
            if (selectedEvaluation) {
                queryClient.invalidateQueries({
                    queryKey: ["studentsByEvaluation", selectedEvaluation.code],
                });
            }
        },
    });

    // Acciones de edición
    const startEdit = () => setEditing(true);

    const cancelEdit = () => {
        setEditing(false);
        setDraftResult(row.result);
    };

    const save = async () => {
        if (!draftResult) return;

        const payload: any = {
            studentEvaluationId: row.studentEvaluationId,
            result: draftResult,
        };
        if (row.observations) payload.observations = row.observations;
        if (row.performedAt) payload.performedAt = row.performedAt;

        // 👇 Aquí imprimes el payload antes de enviarlo 
        console.log("Enviando payload a updatePhysicalEvaluationByStudent:", payload);

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
