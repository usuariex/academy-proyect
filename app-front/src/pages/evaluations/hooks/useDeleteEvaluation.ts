import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEvaluation } from "@/services/evaluation";

export function useDeleteEvaluation(code: string, studentsCount: number) {
    const queryClient = useQueryClient();

    const canDelete = studentsCount === 0;

    const mutation = useMutation({
        mutationFn: async () => {
            if (!canDelete) {
                throw new Error("La evaluación tiene alumnos relacionados. Elimina los alumnos primero.");
            }
            await deleteEvaluation(code);
            return true;
        },
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["evaluations"] });
        },
        onError: (err: unknown) => {
            console.error("Error al eliminar evaluación:", err);
        },
    });

    return {
        remove: mutation.mutateAsync,              // función para ejecutar el delete
        canDelete,                                 // validación previa
        isDeleting: mutation.isPending,            // estado de carga
        error: mutation.error ? String(mutation.error) : null, // error si ocurre
    };
}
