import api from "./axiosConfig";
import type { AlumnoEvaluacion } from "../types/AlumnoEvaluacion";

export const getAlumnosByEvaluacion = async (evaluacionId: number): Promise<AlumnoEvaluacion[]> => {
  const res = await api.get(`evaluaciones/alumnos/?evaluacionId=${evaluacionId}`);
  return res.data.results.map((a: any) => ({
    evaluacion_alumno_id: a.evaluacion_alumno_id,
    evaluacion_id: a.evaluacion_id,
    alumno_id: a.alumno_id,
    nombres: a.nombres,
    nombre_completo: a.nombre_completo,
    celular: a.celular,
    nota: a.calificacion_final ? parseFloat(a.calificacion_final) : null,
    estado: a.estado,
  }));
};


export const searchAlumnosByEvaluacion = async ( evaluacionId: number, search: string, filtro: string ): Promise<AlumnoEvaluacion[]> => {
  const res = await api.get(
    `evaluaciones/alumnos/?evaluacionId=${evaluacionId}&search=${search}&filtro=${filtro}&page=1&limit=100`
  );

  return res.data.results.map((a: any) => ({
    evaluacion_alumno_id: a.evaluacion_alumno_id,
    evaluacion_id: a.evaluacion_id,
    alumno_id: a.alumno_id,
    nombres: a.nombres,
    celular: a.celular,
    nota: a.calificacion_final ? parseFloat(a.calificacion_final) : null,
    estado: a.estado,
  }));
};
