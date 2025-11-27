import type { EvaluationResponse } from "./Evaluation";


export type StudentStatus = "Matriculado" | "Retirado" | "Suspendido";

export interface Student {
  id: number;
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  fullName: string;
  birthDate: string; 
  email: string ;
  phone: string ;
  statusId: number;
  statusName: string;
  genderId: number;
  genderName: string;
  weight?: number | null;
  height: number;
  dni: string;
  isActive: boolean;
  registeredAt: string;
}

export interface StudentRequest {
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  birthDate: string;
  email: string ;
  phone: string ;
  statusId: number;
  genderId: number;
  weight: number;
  height: number;
  dni: string;
  isActive: boolean
}


export interface StudentResponse {
  id: number;
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
  height: number;
  dni: string;
  isActive: boolean;
  creatAt: string;
}


export interface StudentEvaluation {
  studentEvaluationId: number;
  evaluationId: number;
  studentId: number;
  names: string;
  fullName: string;
  finalGrade: number | null;
  status: number | string; 
}




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
  creatAt: string;
  reference?: string | null;
  student: number;
}

export interface Sexo {
  id: number;
  nombre: string;
}