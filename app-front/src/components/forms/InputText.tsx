import React from 'react';

interface InputTextProps {
  label: string;                     // Etiqueta del campo
  value: string;                     // Valor actual
  onChange: (val: string) => void;   // Función para actualizar el valor
  placeholder?: string;              // Texto de ayuda opcional
  required?: boolean;                // Si es obligatorio
  disabled?: boolean;                // Si está deshabilitado
}

const InputText: React.FC<InputTextProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
}) => {
  return (
    <div className="input-text-container">
      <label className="input-text-label">
        {label} {required && <span>*</span>}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="input-text-field"
      />
    </div>
  );
};

export default InputText;
