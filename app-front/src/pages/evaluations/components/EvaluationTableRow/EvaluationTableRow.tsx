import { useDeleteEvaluation } from "@evaluations/hooks";
import { BaseActionButton } from "@/components/ui";
import { evaluationActions } from "@evaluations/constants";
import type { Evaluation } from "@/models/evaluation";
import type { Column } from "@/models/ui";
import { useState, type MouseEvent } from 'react'
import { ConfirmModal } from "@/components/modals";

interface Props {
    row: Evaluation;
    columns: Column<Evaluation>[];
    onSelect?: (ev: Evaluation) => void;
    onEdit?: (ev: Evaluation) => void;
}
export const EvaluationTableRow = ({ row, onSelect, onEdit }: Props) => {

    const [showConfirm, setShowConfirm] = useState(false);

    const { remove, canDelete, isDeleting } = useDeleteEvaluation(row.code, row.studentsCount);

    const handleDelete = async (e: MouseEvent) => {
        e.stopPropagation();
        if (canDelete) {
            setShowConfirm(true);
        }

    };
    const handleEdit = async (e: MouseEvent) => {
        e.stopPropagation();
        onEdit?.(row);

    };
    const handleConfirm = async () => {
        try {
            await remove();
            console.log("Eliminado correctamente");
        } catch (err) {
            console.error("Error al eliminar", err);
        }
        setShowConfirm(false);
    };

    return (
        <tr onClick={() => onSelect?.(row)}>
            <td>{row.name}</td>
            <td>{row.plannedDate}</td>
            <td>{row.code}</td>
            <td>{row.statusName}</td>
            <td>
                <BaseActionButton {...evaluationActions.edit} onClick={handleEdit} />
                <BaseActionButton
                    {...evaluationActions.delete}
                    onClick={handleDelete}
                    disabled={!canDelete || isDeleting}
                />


                <ConfirmModal
                    visible={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={handleConfirm}
                    message="¿Estás seguro de que deseas eliminar esta evaluación?"
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                />

            </td>
        </tr>
    );
};

