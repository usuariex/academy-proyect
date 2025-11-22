import api from './axiosConfig';
import type { Evaluacion } from '../types/Evaluacion';


export const getEvaluaciones = async (): Promise<Evaluacion[]> => {
  const res = await api.get('evaluaciones/'); 
  return res.data.results ?? res.data;
};


