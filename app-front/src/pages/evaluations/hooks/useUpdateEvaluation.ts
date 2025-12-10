
import { useState } from "react";
import { updateEvaluation } from "@/services/evaluation";
import type { EvaluationRequest, Evaluation } from "@/models/evaluation";

export function useUpdateEvaluation(code: string, hasGradedStudents: boolean) {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function update(payload: Partial<EvaluationRequest>): Promise<Evaluation | null> {
        setIsSaving(true);
        setError(null);
        try {
            const safePayload = {
                ...payload,
                plannedDate: hasGradedStudents ? undefined : payload.plannedDate,
            };
            const evaluation = await updateEvaluation(code, safePayload);
            return evaluation;
        } catch (err: any) {
            setError(err?.message ?? "No se pudo actualizar la evaluación.");
            return null;
        } finally {
            setIsSaving(false);
        }
    }

    return { update, isSaving, error };
}
