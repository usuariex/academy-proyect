import React, { useEffect, useState } from 'react';
import { getSexos, deleteSexo } from '../../api/sexos';
import SexoForm from './SexoForm';

const SexoList: React.FC = () => {

  interface Sexo {
    id: number;
    nombre: string;
  }

  const [sexos, setSexos] = useState<Sexo[]>([]);
  const [selectedSexo, setSelectedSexo] = useState<Sexo | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarSexos();
  }, []);

  const cargarSexos = async () => {
    const data = await getSexos();
    setSexos(data);
  };

  const handleEdit = (sexo: any) => {
    setSelectedSexo(sexo);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    await deleteSexo(id);
    cargarSexos();
  };

  return (
    <div>
      <h2>Listado de Sexos</h2>
      <button onClick={() => { setSelectedSexo(null); setShowForm(true); }}>
        Añadir Sexo
      </button>

      <ul>
        {sexos.map(s => (
          <li key={s.id}>
            {s.nombre}
            <button onClick={() => handleEdit(s)}>Editar</button>
            <button onClick={() => handleDelete(s.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {showForm && (
        <SexoForm
          sexo={selectedSexo}
          onClose={() => setShowForm(false)}
          onSuccess={cargarSexos}
        />
      )}
    </div>
  );
};

export default SexoList;
