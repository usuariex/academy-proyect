import type { EvaluationResponse } from "./Evaluation";


export interface Student {
  id: number;
  uuid: string;
  code: number;
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  fullName: string;
  birthDate: string;
  email?: string | null;
  phone?: string | null;
  statusId: number;
  statusName: string;
  genderId: number;
  genderName: string;
  weight?: number | null;
  height?: number | null;
  dni: string;
  isActive: boolean;
  createdAt: string;
}





export interface StudentResponse {
  id: number;
  uuid: string;
  code: number;
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  fullName: string;
  birthDate: string;
  email?: string | null;
  phone?: string | null;
  statusId: number;
  statusName: string;
  genderId: number;
  genderName: string;
  weight?: number;
  height?: number;
  dni: string;
  isActive: boolean;
  createdAt: string;
}




export interface SelectedStudentValue {
  selectedStudent: Student | null;
  setSelectedStudent: (s: Student | null) => void;
}





/* ================================================================= */

export interface StudentRequest {
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  birthDate: string;
  email: string;
  phone: string;
  statusId: number;
  genderId: number;
  weight: number;
  height: number;
  dni: string;
  isActive: boolean
}





/* export interface StudentEvaluation {
  studentEvaluationId: number;
  evaluationId: number;
  studentId: number;
  names: string;
  fullName: string;
  status: number | string; 
} */




// Para el modal (detalle completo)

export interface StudentProfileResponse extends StudentResponse {
  address: Address;
  evaluations: EvaluationResponse[];
  sexo: Sexo;
}


export interface Region {
  id: number;
  name: string;
}

export interface Province {
  id: number;
  name: string;
  region: Region;
}

export interface District {
  id: number;
  name: string;
  province: Province;
}

export interface Address {
  id: number;
  street: string;
  district: District;
  createdAt: string;
  reference?: string | null;
  student: number;
}


export interface SexoResponse {
  id: number;
  nombre: string;
}


export interface Sexo {
  id: number;
  nombre: string;
}



/* ============================================= */

// src/models/student.ts

/** Allowed statuses for a student's evaluation */

export type StudentStatus = 'Sin calificar' | 'Calificado' | 'Aprobado' | 'Desaprobado' | string;

export interface StudentEvaluation {

  studentEvaluationId: number;
  evaluationId: number;
  evaluationName: string;
  studentId: number;
  names: string;
  fullName: string;
  status: StudentStatus;
  grade: number | null;
  result: number | null;




  /** Fields specific to physical evaluations */
  reps?: number | null;
  seconds?: number
  /** Fields specific to theoretical evaluations */
  attempts?: number | null;
  observations?: string | null;
}

