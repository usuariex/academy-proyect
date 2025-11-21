import { useState } from 'react';
import type { Evaluacion } from '../../types/Evaluacion';
import './EvaluacionModal.css';

interface EvaluacionModalProps {
  evaluacion: Evaluacion;
  onClose: () => void;
}

const EvaluacionModal: React.FC<EvaluacionModalProps> = ({ evaluacion, onClose }) => {
  const [activeTab, setActiveTab] = useState<'calificaciones' | 'otros'>('calificaciones');

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h3>Calificaciones de {evaluacion.nombre}</h3>
        
        {/* Sección 1: métricas */}
        <div className="metrics">
          <div className="card">Alumnos sin calificar: 5</div>
          <div className="card">Alumnos calificados: 20</div>
          <div className="card">Alumnos desaprobados: 3</div>
        </div>

        {/* Sección 2: menú de tabs */}
        <div className="tabs">
          <button 
            className={activeTab === 'calificaciones' ? 'active' : ''} 
            onClick={() => setActiveTab('calificaciones')}
          >
            Calificaciones
          </button>
          <button 
            className={activeTab === 'otros' ? 'active' : ''} 
            onClick={() => setActiveTab('otros')}
          >
            Otros
          </button>
        </div>

        {/* Sección 3: contenido dinámico */}
        <div className="tab-content">
          {activeTab === 'calificaciones' && (
            <div>
              
              <ul>
                <li>Juan Pérez - 15 <button>Editar</button> <button>Eliminar</button></li>
                <li>María López - 18 <button>Editar</button> <button>Eliminar</button></li>
              </ul>
            </div>
          )}
          {activeTab === 'otros' && (
            <div>
              <h3>Otros datos de la evaluación</h3>
              <p>Información adicional...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluacionModal;

