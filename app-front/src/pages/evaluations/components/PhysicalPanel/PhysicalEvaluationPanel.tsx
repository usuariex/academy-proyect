/* import React, { useMemo } from 'react'; */
import type { StudentEvaluation } from '@/models';
import styles from './PhysicalEvaluationPanel.module.css';
/* import { useStudentMutations } from '@/hooks/students'; */

interface Props {
  students: StudentEvaluation[];
  evalCode: string;
  onOpenEdit?: (student: StudentEvaluation) => void;
}

export const PhysicalEvaluationPanel: React.FC<Props> = ({ students,/*  evalCode, */ onOpenEdit }) => {
  /*  const { gradeMutation, editMutation } = useStudentMutations(evalCode);
 
   const byReps = useMemo(
     () => students.slice().sort((a, b) => (b.reps ?? 0) - (a.reps ?? 0)),
     [students]
   ); */

  /*  const handleRecord = (studentEvaluationId: number, reps?: number, seconds?: number) => {
     editMutation.mutate({ studentEvaluationId, payload: { reps, seconds } });
   }; */

  /* const handleGrade = (studentEvaluationId: number, grade: number) => {
    gradeMutation.mutate({ studentEvaluationId, finalGrade: grade });
  }; */

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3 className={styles.title}>Registra repeticiones o tiempo</h3>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Alumno</th>
              <th>otro</th>
              <th>Resultado</th>
              <th>Nota</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.studentUuid}>
                <td>{s.studentFullName}</td>
                <td>{s.grade ?? '—'}</td>
                <td>{s.result ?? '—'}</td>
                <td>{s.status ?? '—'}</td>
                <td className={styles.actions}>
                  {s.status === 'Sin calificar' ? (
                    <button
                      /*  onClick={() => handleGrade(s.studentEvaluationId, 0)} */
                      className={`${styles.btn} ${styles.btnCalificar}`}
                    >
                      Calificar
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenEdit?.(s)}
                      className={`${styles.btn} ${styles.btnEditar}`}
                    >
                      Editar
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhysicalEvaluationPanel;
