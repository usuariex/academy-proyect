
import api from './axiosConfig';

// Obtener todos los sexos
export const getSexos = async () => {
   const res = await api.get('sexos/');
  return res.data;
};

// Crear un nuevo sexo
export const createSexo = async (data: { nombre: string }) => {
  const res = await api.post('sexos/', data);
  return res.data;
};

// Actualizar un sexo existente
export const updateSexo = async (id: number, data: { nombre: string }) => {
  const res = await api.put(`sexos/${id}/`, data);
  return res.data;
};

// Eliminar un sexo
export const deleteSexo = async (id: number) => {
  const res = await api.delete(`sexos/${id}/`);
  return res.data;
};
