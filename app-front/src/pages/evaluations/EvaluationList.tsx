import { useState } from 'react';
import EvaluationModal from './EvaluationModal';
import type { EvaluationResponse } from '../../models';
import styles from './EvaluationList.module.css';
import { useEvaluations } from '@evaluations/hooks';

const EvaluationList = () => {
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationResponse | null>(null);

  const { data: evaluations = [], isLoading, error } = useEvaluations();

  if (isLoading) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.error}>Error al cargar las evaluaciones</div>;

  return (
    <div className={styles.evaluationList}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Evaluación</th>
            <th className={styles.th}>Fecha planificación</th>
            <th className={styles.th}>Código</th>
            <th className={styles.th}>Estado</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {evaluations?.map((ev: EvaluationResponse) => (
            <tr
              className={`${styles.tr} ${selectedEvaluation?.id === ev.id ? styles.selected : ''
                }`}
              key={ev.evalCode}
              onClick={() => setSelectedEvaluation(ev)}
            >
              <td className={styles.td}>{ev.name}</td>
              <td className={styles.td}>{ev.plannedDate}</td>
              <td className={styles.td}>{ev.evalCode}</td>
              <td className={styles.td}>{ev.statusName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEvaluation && (
        <EvaluationModal
          evaluation={selectedEvaluation}
          isOpen={true}
          onClose={() => setSelectedEvaluation(null)}
        />
      )}
    </div>
  );
};

export default EvaluationList;
