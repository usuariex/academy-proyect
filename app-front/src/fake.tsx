/* import type { StudentEvaluation } from "@/models/student";
import styles from "./TheoreticalEvaluationPanel.module.css";
import { useTheoryRow } from "@evaluations/hooks";
import { BaseActionButton } from "@/components/ui";

interface Props {
    students: StudentEvaluation[];
    evaluationCode: string;
}

export const TheoreticalEvaluationPanel = ({ students }: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.right}>
                <h4>Alumnos calificados</h4>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Alumno</th>
                            <th>Nota</th>
                            <th>Respuestas correctas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s) => {
                            const {
                                row,
                                isEditing,
                                draftResult,
                                setDraftResult,
                                startEdit,
                                cancelEdit,
                                save,
                                isSaving,
                            } = useTheoryRow(s);

                            return (
                                <tr key={s.studentEvaluationId}>
                                    <td>{s.studentFullName}</td>
                                    <td>{row.grade ?? "—"}</td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={draftResult ?? ""}
                                                onChange={(e) => setDraftResult(Number(e.target.value))}
                                                className={styles.input}
                                            />
                                        ) : (
                                            row.result ?? "—"
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <>
                                                <BaseActionButton
                                                    type="save"
                                                    onClick={save}
                                                    disabled={isSaving}
                                                />
                                                <BaseActionButton
                                                    type="edit"
                                                    onClick={cancelEdit}
                                                    disabled={isSaving}
                                                />
                                            </>
                                        ) : (
                                            <BaseActionButton
                                                type={row.grade ? "edit" : "grade"}
                                                onClick={startEdit}
                                            />
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
 */