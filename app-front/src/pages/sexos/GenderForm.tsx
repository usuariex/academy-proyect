import React, { useState, useEffect } from 'react';
import InputText from '../../components/forms/InputText';
import { createGender, updateGender } from '../../services';

interface Props {
  gender?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const GenderForm: React.FC<Props> = ({ gender, onClose, onSuccess }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (gender) {
      setName(gender.name);
    }
  }, [gender]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gender) {
      await updateGender(gender.id, { name });
    } else {
      await createGender({ name });
    }
    onSuccess();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{gender ? 'Editar Sexo' : 'Nuevo Sexo'}</h3> {/* 👈 Texto visible en español */}
      <InputText label="Nombre" value={name} onChange={setName} /> {/* 👈 Label visible en español */}
      <button type="submit">Guardar</button> {/* 👈 Texto visible en español */}
      <button type="button" onClick={onClose}>Cancelar</button> {/* 👈 Texto visible en español */}
    </form>
  );
};

export default GenderForm;
