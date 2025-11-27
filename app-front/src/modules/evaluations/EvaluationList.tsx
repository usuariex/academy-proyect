import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvaluations } from '../../api/evaluation';
import EvaluationModal from './EvaluationModal';
import type { EvaluationResponse } from '../../types';
import './EvaluationList.css';

const EvaluationList = () => {
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationResponse | null>(null);

  const { data: evaluations = [], isLoading, error } = useQuery({
    queryKey: ['evaluations'],
    queryFn: getEvaluations,
  });

  if (isLoading) return <div>Cargando...</div>; 
  if (error) return <div>Error al cargar las evaluaciones</div>; 

  return (
    <div className="evaluation-list">
      <ul>
        {evaluations.map((ev: EvaluationResponse) => (
          <li
            className='evaluation-list__li'
            key={ev.id}
            onClick={() => setSelectedEvaluation(ev)}
          >
            <strong>{ev.description}</strong> - {ev.plannedDate}
          </li>
        ))}
      </ul>

      {selectedEvaluation && (
        <EvaluationModal
          evaluation={selectedEvaluation}
          onClose={() => setSelectedEvaluation(null)}
        />
      )}
    </div>
  );
};

export default EvaluationList;
