import React, { useEffect, useState } from 'react';
import { getGenders, deleteGender } from '../../api/';
import GenderForm from './GenderForm';

const GenderList: React.FC = () => {

  interface Gender {
    id: number;
    name: string;
  }

  const [genders, setGenders] = useState<Gender[]>([]);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadGenders();
  }, []);

  const loadGenders = async () => {
    const data = await getGenders();
    setGenders(data);
  };

  const handleEdit = (gender: Gender) => {
    setSelectedGender(gender);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    await deleteGender(id);
    loadGenders();
  };

  return (
    <div>
      <h2>Listado de Sexos</h2> {/* 👈 Texto visible se mantiene en español */}
      <button onClick={() => { setSelectedGender(null); setShowForm(true); }}>
        Añadir Sexo {/* 👈 Texto visible se mantiene en español */}
      </button>

      <ul>
        {genders.map(g => (
          <li key={g.id}>
            {g.name}
            <button onClick={() => handleEdit(g)}>Editar</button> {/* 👈 Texto visible en español */}
            <button onClick={() => handleDelete(g.id)}>Eliminar</button> {/* 👈 Texto visible en español */}
          </li>
        ))}
      </ul>

      {showForm && (
        <GenderForm
          gender={selectedGender}
          onClose={() => setShowForm(false)}
          onSuccess={loadGenders}
        />
      )}
    </div>
  );
};

export default GenderList;
