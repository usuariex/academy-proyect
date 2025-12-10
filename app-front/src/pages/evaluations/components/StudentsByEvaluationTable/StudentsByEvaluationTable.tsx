
import type { StudentEvaluation } from '@/models/student';
import styles from './StudentsByEvaluationTable.module.css';

interface Props {
  students: StudentEvaluation[];
  onOpenEdit: (student: StudentEvaluation) => void;
}

export const StudentsByEvaluationTable = ({ students, /* onOpenEdit  */ }: Props) => {
  const Exercise = students.find(s => typeof s.exerciseName === 'string' && s.exerciseName.trim() !== '')?.exerciseName ?? null;
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Estado</th>
            <th>Calificacion</th>
            <th>Resultado de {Exercise}</th>
            <th>Observations</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.studentUuid}>
              <td>{s.studentFullName}</td>
              <td>
                <span
                  className={`${styles.status} ${s.status === 'Aprobado'
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
