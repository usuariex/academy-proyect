import type { MouseEvent, ChangeEvent } from 'react'
import type { Column } from "@/models";
import type { StudentEvaluation } from "@/models/student";
import { useTheoryRow } from "@evaluations/hooks";
import { BaseActionButton } from "@/components/ui";
import styles from "./TheoryTableRow.module.css";
import { evaluationActions } from "@evaluations/constants";

interface Props {
  row: StudentEvaluation;
  columns: Column<StudentEvaluation>[];
}

export const TheoryTableRow = ({ row: student }: Props) => {
  const {
    row,
    isEditing,
    draftResult,
    setDraftResult,
    startEdit,
    cancelEdit,
    save,
    isSaving,
  } = useTheoryRow(student);



  function handleResultClick(e: MouseEvent<HTMLTableCellElement>) {
    if (e.detail === 2 && !student.grade) {
      startEdit();
    }
  }

  function handleResultChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setDraftResult(val === "" ? null : Number(val));
  }




  return (
    <tr className={styles.row}>
      <td className={styles.cell}>{student.studentFullName}</td>
      <td className={styles.cell}>{row.grade ?? "—"}</td>

      <td className={styles.cell} onClick={handleResultClick}>
        {isEditing ? (
          <input
            type="number"
            value={draftResult ?? ""}
            onChange={handleResultChange}
            className={styles.input}
          />
        ) : (
          <>
            {typeof row.result === "number" && row.result > 0
              ? row.result
              : <span className={styles.icon}>✏️</span>}
          </>
        )}
      </td>
      <td className={`${styles.cell} ${styles.actions}`}>
        {isEditing ? (
          <>
            <BaseActionButton {...evaluationActions.save} onClick={save} disabled={isSaving} />
            <BaseActionButton {...evaluationActions.cancel} onClick={cancelEdit} disabled={isSaving} />

          </>
        ) : (
          <BaseActionButton
            {...(row.grade ? evaluationActions.save : evaluationActions.grade)}
            onClick={startEdit}
          />

        )}
      </td>
    </tr>

  );
};
