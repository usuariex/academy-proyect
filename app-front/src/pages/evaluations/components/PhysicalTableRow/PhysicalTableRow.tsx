import type { Column } from "@/models";
import type { StudentEvaluation } from "@/models/student";
import { usePhysicalRow, useSelectedEvaluation } from "@evaluations/hooks";
import { BaseActionButton } from "@/components/ui";
import styles from "./PhysicalTableRow.module.css";
import { evaluationActions } from "@evaluations/constants";
import { TimeResultInput, DecimalResultInput } from "@evaluations/components/InputsResult";

interface Props {
    row: StudentEvaluation;
    columns: Column<StudentEvaluation>[];
}

export const PhysicalTableRow = ({ row: student }: Props) => {

    const { selectedEvaluation } = useSelectedEvaluation()

    if (!selectedEvaluation) {
        return <p>No hay evaluación seleccionada</p>;

    }
    const evaluation = selectedEvaluation

    const {
        row, isEditing, draftResult, isSaving, setDraftResult, startEdit, cancelEdit, save,
    } = usePhysicalRow(student);


    const shouldActivateEdit = (grade: string | number | null): boolean => {
        if (grade == null) return true;
        const num = Number(grade);
        return isNaN(num);
    }


    return (
        <tr className={styles.row}>
            <td className={styles.cell}>{student.studentFullName}</td>
            <td className={styles.cell}>{row.grade ?? "—"}</td>
            <td className={styles.cell}>
                {isEditing ? (
                    (evaluation.exerciseUnit?.toLowerCase() ?? "") === "segundos" ? (
                        <TimeResultInput
                            value={draftResult ?? ""}
                            onChange={setDraftResult}
                            placeholder={`3'34"`}
                        />
                    ) : (
                        <DecimalResultInput
                            value={draftResult ?? ""}
                            onChange={setDraftResult}
                            min={0}
                            max={100}
                            placeholder="0.00"
                        />
                    )
                ) : (
                    row.result && row.result.trim() !== ""
                        ? row.result
                        : (
                            <span
                                className={styles.icon}
                                onDoubleClick={() => {
                                    if (shouldActivateEdit(row.grade)) {
                                        startEdit();
                                    }
                                }}
                            >
                                ✏️
                            </span>
                        )
                )}
            </td>


            <td className={`${styles.cell} ${styles.actions}`}>
                {isEditing ? (
                    <>
                        <BaseActionButton
                            {...evaluationActions.save}
                            onClick={save}
                            disabled={isSaving}
                        />
                        <BaseActionButton
                            {...evaluationActions.cancel}
                            onClick={cancelEdit}
                            disabled={isSaving}
                        />
                    </>
                ) : (
                    <>
                        {row.grade != null ? (
                            <BaseActionButton
                                {...evaluationActions.edit}
                                onClick={startEdit}
                            />
                        ) : (
                            <BaseActionButton
                                {...evaluationActions.grade}
                                onClick={startEdit}
                            />
                        )}
                    </>
                )}
            </td>
        </tr>
    );
};
