
import type { StudentEvaluation } from '@/models/student';
import styles from './PhysicalEvaluationPanel.module.css';

interface Props {
  students: StudentEvaluation[];
  evalCode: string;
  onOpenEdit?: (student: StudentEvaluation) => void;
}

export const PhysicalEvaluationPanel: React.FC<Props> = ({ students,/*  evalCode, */ onOpenEdit }) => {

  const Exercise = students.find(s => typeof s.exerciseName === 'string' && s.exerciseName.trim() !== '')?.exerciseName ?? null;

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
              <th>Estado</th>
              <th>Nota</th>
              <th>{`Cantidad ${Exercise ? `${Exercise}` : ''}`}</th>
              <th>Ejercicio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.studentUuid}>
                <td>{s.studentFullName}</td>
                <td>{s.status}</td>
                <td>{s.grade ?? '—'}</td>
                <td>{s.result ?? '—'}</td>
                <td>{s.exerciseName ?? '—'}</td>
                <td className={styles.actions}>
                  {s.status === 'Sin calificar' ? (
                    <button
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

