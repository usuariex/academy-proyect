import React from 'react';
import './FormModal.css'; // estilos externos opcionales

interface FormModalProps {
  visible: boolean;              // controla si se muestra
  onClose: () => void;           // función para cerrar
  title?: string;                // título opcional
  children: React.ReactNode;     // contenido dinámico (ej. un formulario)
  size?: 'small' | 'medium' | 'large'; // tamaño opcional
  variant?: 'default' | 'danger' | 'success'; // estilos opcionales
}

const FormModal: React.FC<FormModalProps> = ({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  variant = 'default',
}) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-container ${size} ${variant}`}>
        {title && <h2>{title}</h2>}
        <div className="modal-content">{children}</div>
        <div className="modal-actions">
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
