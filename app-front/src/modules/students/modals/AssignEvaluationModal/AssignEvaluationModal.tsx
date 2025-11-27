import React from 'react';
import styles from './AssignEvaluationModal.module.css';
import Swal from 'sweetalert2';

const AssignEvaluationModal: React.FC = () => {
  const handleAssign = () => {
    Swal.fire('Asignado', 'El alumno fue asignado correctamente', 'success');
  };

  return (
    <div className={styles.assignEvaluationModal}>
      <h3 className={styles.assignEvaluationModal__title}>Asignar alumno a evaluación</h3>
      <select className={styles.assignEvaluationModal__select}>
        <option>Evaluación 1</option>
        <option>Evaluación 2</option>
      </select>
      <button
        onClick={handleAssign}
        className={styles.assignEvaluationModal__button}
      >
        Asignar
      </button>
    </div>
  );
};

export default AssignEvaluationModal;
