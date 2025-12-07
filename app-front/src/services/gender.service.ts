import api from './axiosConfig';
import type { GenderResponse } from "@/models";


export const getGenders = async (): Promise<GenderResponse[]> => {
  const res = await api.get('students/genders/');
  return res.data;
};






















// Create a new gender
export const createGender = async (data: { name: string }) => {
  const res = await api.post('genders/', data);
  return res.data;
};

// Update an existing gender
export const updateGender = async (id: number, data: { name: string }) => {
  const res = await api.put(`genders/${id}/`, data);
  return res.data;
};

// Delete a gender
export const deleteGender = async (id: number) => {
  const res = await api.delete(`genders/${id}/`);
  return res.data;
};
