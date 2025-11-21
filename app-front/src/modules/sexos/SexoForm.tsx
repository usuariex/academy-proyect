import React, { useState, useEffect } from 'react';
import InputText from '../../components/forms/InputText';
import { createSexo, updateSexo } from '../../api/sexos';

interface Props {
  sexo?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const SexoForm: React.FC<Props> = ({ sexo, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (sexo) {
      setNombre(sexo.nombre);
    }
  }, [sexo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sexo) {
      await updateSexo(sexo.id, { nombre });
    } else {
      await createSexo({ nombre });
    }
    onSuccess();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{sexo ? 'Editar Sexo' : 'Nuevo Sexo'}</h3>
      <InputText label="Nombre" value={nombre} onChange={setNombre} />
      <button type="submit">Guardar</button>
      <button type="button" onClick={onClose}>Cancelar</button>
    </form>
  );
};

export default SexoForm;
