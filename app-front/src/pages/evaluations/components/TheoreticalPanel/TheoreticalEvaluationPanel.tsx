// src/components/evaluations/TheoreticalEvaluationPanel/TheoreticalEvaluationPanel.tsx
import React, { useMemo } from 'react';
import type { StudentEvaluation } from '@/models';
import styles from './TheoreticalEvaluationPanel.module.css';
import { useStudentMutations } from '@/hooks/useStudentMutations';

interface Props {
  students: StudentEvaluation[]; // lista ya filtrada/ordenada por el padre
  evalCode: string;
  onOpenEdit?: (student: StudentEvaluation) => void;
}

export const TheoreticalEvaluationPanel: React.FC<Props> = ({ students, evalCode, onOpenEdit }) => {
  const { gradeMutation } = useStudentMutations(evalCode);

  const pending = useMemo(() => students.filter(s => s.grade === null), [students]);
  const graded = useMemo(() => students.filter(s => s.grade !== null), [students]);

  const handleQuickGrade = (studentId: number, grade: number) => {
    gradeMutation.mutate({ studentEvaluationId: studentId, finalGrade: grade });
  };






  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <section className={styles.listSection}>
          <h4>Alumnos pendientes ({pending.length})</h4>
          <ul className={styles.list}>
            {pending.map(s => (
              <li key={s.studentEvaluationId} className={styles.item}>
                <div className={styles.name}>{s.fullName}</div>
                <div className={styles.actions}>
                  <button onClick={() => onOpenEdit?.(s)} className={styles.btn}>Abrir</button>
                  <button onClick={() => handleQuickGrade(s.studentEvaluationId, 10)} className={styles.btnAlt}>10</button>
                  <button onClick={() => handleQuickGrade(s.studentEvaluationId, 15)} className={styles.btnAlt}>15</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={styles.right}>
        <h4>Alumnos calificados ({graded.length})</h4>
        <table className={styles.table}>
          <thead>
            <tr><th>Alumno</th><th>Nota</th><th>Intentos</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {graded.map(s => (
              <tr key={s.studentEvaluationId}>
                <td>{s.fullName}</td>
                <td>{s.grade}</td>
                <td>{s.attempts ?? '—'}</td>
                <td>
                  <button onClick={() => onOpenEdit?.(s)} className={styles.smallBtn}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TheoreticalEvaluationPanel;
