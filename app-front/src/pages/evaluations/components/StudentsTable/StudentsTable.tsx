import React from 'react';
import type { StudentEvaluation } from '@/models';
import styles from './StudentsTable.module.css';

interface Props {
  students: StudentEvaluation[];
  onOpenEdit: (student: StudentEvaluation) => void;
}

const StudentsTable: React.FC<Props> = ({ students, /* onOpenEdit  */}) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Estado</th>
            <th>Nota</th>
            <th>Resultado</th>
            <th>Observations</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.studentEvaluationId}>
              <td>{s.fullName}</td>
              <td>
                <span
                  className={`${styles.status} ${
                    s.status === 'Aprobado'
                      ? styles.aprobado
                      : s.status === 'Desaprobado'
                      ? styles.desaprobado
                      : s.status === 'Sin calificar'
                      ? styles.sinCalificar
                      : styles.calificado
                  }`}
                >
                  {s.status}
                </span>
              </td>
              <td>{s.grade ?? '-'}</td>
              <td>{s.result ?? '-'}</td>
              <td>{s.observations ?? '-'}</td>
              {/*  */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
