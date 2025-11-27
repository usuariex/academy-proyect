
interface ActionButtonProps {
  type: 'save' | 'edit' | 'evaluate' | 'grade';
  onClick: () => void;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ type, onClick, disabled }) => {
  const getLabel = () => {
    switch (type) {
      case 'save': return 'Guardar';
      case 'edit': return 'Editar';
      case 'evaluate': return 'Evaluar';
      case 'grade': return 'Calificar';
      default: return 'Acción';
    }
  };

  return (
    <button
      className={`btn-${type}`}
      onClick={onClick}
      disabled={disabled}
    >
      {getLabel()}
    </button>
  );
};
