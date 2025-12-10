// hooks/useChangeEvaluationStatus.ts
import { useState } from "react";
import { updateEvaluationStatus } from "@/services/evaluation";
import type { Evaluation } from "@/models/evaluation";

function computeNextStatusId(currentId: number): number {
    // ejemplo de ciclo: 1=Pendiente, 2=En curso, 3=Finalizada, 4=Publicada
    const order = [1, 2, 3, 4];
    const idx = order.indexOf(currentId);
    return order[idx + 1] ?? order[0];
}

export function useChangeEvaluationStatus(code: string, currentStatusId: number) {
    const [isChanging, setIsChanging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function change(nextId?: number): Promise<Evaluation | null> {
        setIsChanging(true);
        setError(null);
        try {
            const targetId = nextId ?? computeNextStatusId(currentStatusId);
            const evaluation = await updateEvaluationStatus(code, targetId);
            return evaluation;
        } catch (err: any) {
            setError(err?.message ?? "No se pudo cambiar el estado.");
            return null;
        } finally {
            setIsChanging(false);
        }
    }

    return { change, isChanging, error };
}
