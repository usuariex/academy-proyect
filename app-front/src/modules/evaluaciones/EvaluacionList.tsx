import { useState } from 'react';
import EvaluacionModal from './EvaluacionModal';
import type { Evaluacion } from '../../types/Evaluacion';
import './EvaluacionList.css';

const EvaluacionList = () => {
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<Evaluacion | null>(null);

  const evaluaciones: Evaluacion[] = [
    { id: 1, nombre: 'Examen Matemáticas', fecha: '2025-11-10' },
    { id: 2, nombre: 'Examen Historia', fecha: '2025-11-12' },
  ];

  return (
    <div className="evaluacion-list">
      <h2>Lista de Evaluaciones</h2>
      <ul>
        {evaluaciones.map((evaluacion) => (
          <li key={evaluacion.id} onClick={() => setSelectedEvaluacion(evaluacion)}>
            <strong>{evaluacion.nombre}</strong> - {evaluacion.fecha}
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
