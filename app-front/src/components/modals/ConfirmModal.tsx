import React from 'react';
import './ConfirmModal.css'; // estilos externos opcionales

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  message,
}) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container small danger">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Sí</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
