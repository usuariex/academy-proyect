import { useDeleteEvaluation } from "@evaluations/hooks";
import { BaseActionButton } from "@/components/ui";
import { evaluationActions } from "@evaluations/constants";
import type { Evaluation } from "@/models/evaluation";
import type { Column } from "@/models/ui";

interface Props {
  row: Evaluation;
  columns: Column<Evaluation>[];
  onSelect?: (ev: Evaluation) => void;
}

export const StudentByEvaluationRow = ({ row, onSelect }: Props) => {
  const { remove, canDelete, isDeleting, error } = useDeleteEvaluation(row.code, row.studentsCount);


  const handleDelete = async (e: MouseEvent) => {
    e.stopPropagation();
    const ok = await remove();
    if (ok) {
      console.log("Eliminado correctamente", row);
      // aquí puedes llamar a refetch() o disparar un callback hacia EvaluationListView
    }
  };

  return (
    <tr onClick={() => onSelect?.(row)}>
      <td>{row.name}</td>
      <td>{row.plannedDate}</td>
      <td>{row.code}</td>
      <td>{row.statusName}</td>
      <td>
        <BaseActionButton {...evaluationActions.edit} onClick={() => console.log("Editar", row)} />
        <BaseActionButton {...evaluationActions.status} onClick={() => console.log("Cambiar estado", row)} />
        <BaseActionButton
          {...evaluationActions.delete}
          onClick={handleDelete}   // 👉 aquí solo asignas la función
          disabled={!canDelete || isDeleting}
        />
        {error && <span className={styles.error}>{error}</span>}
      </td>
    </tr>
  );
};
