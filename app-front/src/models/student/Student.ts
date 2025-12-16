import type {
  EvaluationResponse,
} from "@/models/evaluation";


export interface Student {
  id: number;
  uuid: string;
  code: string;
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
  code: string;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
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



export type StudentStatus = 'Matriculado' | 'Suspendido' | 'Retirado' | ' Egresado'


export interface SelectedStudentValue {
  selectedStudent: Student | null;
  setSelectedStudent: (s: Student | null) => void;
}





/* ================================================================= */

export interface StudentRequest {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
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




export interface StudentsByEvaluationResponse {
  assigned: StudentEvaluationResponse[];
  available: StudentResponse[];
  pagination: {
    assigned: PaginationMeta;
    available: PaginationMeta;
  };
}
export interface StudentsByEvaluation {
  assigned: StudentEvaluation[];
  available: Student[];
  pagination: {
    assigned: PaginationMeta;
    available: PaginationMeta;
  };
}





export interface PaginationMeta {
  count: number;
  next: string | null;
  previous: string | null;
  results?: unknown;
}





export interface StudentEvaluationResponse {
  studentEvaluationId: number;
  studentUuid: string;
  studentFullName: string;
  grade: number | null;
  result: number | null;
  performedAt: string | null;
  observations?: string | null;
  status?: string | null;
  assigned_exercise?: assignedExerciseResponse | null;
  assigned_config?: assignedConfigResponse | null;
  [key: string]: unknown;
}

export interface StudentEvaluation {
  studentEvaluationId: number;
  studentUuid: string;
  studentFullName: string;
  grade: number | null;
  result: number | null;
  performedAt?: string | null;
  observations?: string | null;
  status?: string | null;
  exerciseId: number | null;
  exerciseName: string | null;
  configId: number | null;
  configName: string | null;
}



export interface assignedExerciseResponse {
  id: number;
  name: string;
}
export interface assignedConfigResponse {
  id: number;
  name: string;
}


export interface AssignedExercise {
  id: number;
  name: string;
}
export interface AssignedConfig {
  id: number;
  name: string;
}
