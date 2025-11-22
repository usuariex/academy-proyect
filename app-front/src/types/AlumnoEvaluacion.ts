
export interface AlumnoEvaluacion {
  evaluacion_alumno_id: number;
  evaluacion_id: number;
  alumno_id: number;
  nombres: string;
  nombre_completo: string;
  apellido: string;
  celular: string;
  nota: number | null;
  estado: number | string; 
}
