import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvaluaciones } from '../../api/evaluaciones';
import EvaluacionModal from './EvaluacionModal';
import type { Evaluacion } from '../../types/Evaluacion';
import './EvaluacionList.css';

const EvaluacionList = () => {
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<Evaluacion | null>(null);

  const { data: evaluaciones = [], isLoading, error } = useQuery({
    queryKey: ['evaluaciones'],
    queryFn: getEvaluaciones,
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar las evaluaciones</div>;

  return (
    <div className="evaluacion-list">
      <h2>Lista de Evaluaciones</h2>
      <ul>
        {evaluaciones.map((ev: Evaluacion) => (
          <li key={ev.id} onClick={() => setSelectedEvaluacion(ev)}>
            <strong>{ev.descripcion}</strong> - {ev.fecha_planificada}
          </li>
        ))}
      </ul>

      {selectedEvaluacion && (
        <EvaluacionModal
          evaluacion={selectedEvaluacion}
          onClose={() => setSelectedEvaluacion(null)}
        />
      )}
    </div>
  );
};

export default EvaluacionList;
