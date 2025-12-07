/* import React, { useMemo } from 'react'; */
import type { StudentEvaluation } from '@/models';
import styles from './TheoreticalEvaluationPanel.module.css';

interface Props {

  students: StudentEvaluation[];
  evaluationCode: string;
  onOpenEdit?: (student: StudentEvaluation) => void;
}

export const TheoreticalEvaluationPanel: React.FC<Props> = ({ students, /* evaluationCode, */ onOpenEdit }) => {


  return (
    <div className={styles.container}>
      <div className={styles.right}>
        <h4>Alumnos calificados</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Intento</th>
              <th>Nota</th>
              <th>Resultado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.studentUuid}>
                <td>{s.studentFullName}</td>
                <td>{s.theoryAttemptNumber}</td>
                <td>{s.grade}</td>
                <td>{s.result ?? '—'}</td>
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
