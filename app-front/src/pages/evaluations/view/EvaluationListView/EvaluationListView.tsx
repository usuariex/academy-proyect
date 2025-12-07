import { useState } from 'react';
import { EvaluationPanelView } from '@evaluations/view';
import type { Evaluation } from '@/models';
import styles from './EvaluationListView.module.css';
import { useEvaluations } from '@evaluations/hooks';

export const EvaluationListView = () => {

  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  const { data: evaluations = [], isLoading, error } = useEvaluations();


  /* CREAR FILTRO POR TIPO Y ESTADO DE EVALUACION EN LA TABLA  "evaluations"*/


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
          {evaluations?.map((ev: Evaluation) => (
            <tr
              className={`${styles.tr} ${selectedEvaluation?.code === ev.code ? styles.selected : ''
                }`}
              key={ev.code}
              onClick={() => setSelectedEvaluation(ev)}
            >
              <td className={styles.td}>{ev.name}</td>
              <td className={styles.td}>{ev.plannedDate}</td>
              <td className={styles.td}>{ev.code}</td>
              <td className={styles.td}>{ev.statusName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEvaluation && (
        <EvaluationPanelView
          evaluation={selectedEvaluation}
          isOpen={true}
          onClose={() => setSelectedEvaluation(null)}
        />
      )}
    </div>
  );
};

