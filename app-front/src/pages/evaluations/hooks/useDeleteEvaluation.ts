
import { useState } from "react";
import { deleteEvaluation } from "@/services/evaluation";

export function useDeleteEvaluation(code: string, studentsCount: number) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canDelete = studentsCount === 0;

    async function remove(): Promise<boolean> {
        if (!canDelete) {
            setError("La evaluación tiene alumnos relacionados. Elimina los alumnos primero.");
            return false;
        }
        setIsDeleting(true);
        setError(null);
        try {
            await deleteEvaluation(code);
            return true;
        } catch (err: any) {
            setError(err?.message ?? "No se pudo eliminar la evaluación.");
            return false;
        } finally {
            setIsDeleting(false);
        }
    }

    return { remove, canDelete, isDeleting, error };
}
