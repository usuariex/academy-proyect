import { useState } from "react";
import type { StudentEvaluation } from "@/models/student";
import { updateTheoryEvaluationByStudent } from "@/services/evaluation";
import { TheoryEvaluationMergeAdapter } from "@/adapters/evaluation";

export const useTheoryRow = (base: StudentEvaluation) => {
    const [row, setRow] = useState<StudentEvaluation>(base);
    const [isEditing, setEditing] = useState(false);
    const [draftResult, setDraftResult] = useState<number | null>(row.result);
    const [isSaving, setSaving] = useState(false);

    const startEdit = () => setEditing(true);
    const cancelEdit = () => {
        setEditing(false);
        setDraftResult(row.result);
    };

    const save = async () => {
        if (draftResult == null) return;
        setSaving(true);
        try {
            const model = await updateTheoryEvaluationByStudent({
                studentEvaluationId: row.studentEvaluationId,
                result: draftResult,
                observations: row.observations,
                performedAt: row.performedAt,
            });

            // Fusiona model con StudentEvaluation base
            setRow(TheoryEvaluationMergeAdapter(model, row));
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    return { row, isEditing, draftResult, setDraftResult, startEdit, cancelEdit, save, isSaving };
};
