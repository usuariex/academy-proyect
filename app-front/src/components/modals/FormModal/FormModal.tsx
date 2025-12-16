/* import React from 'react';


interface FormModalProps {
  visible: boolean;            
  onClose: () => void;           
  title?: string;                
  children: React.ReactNode;     
  size?: 'small' | 'medium' | 'large'; 
  variant?: 'default' | 'danger' | 'success'; 
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
 */