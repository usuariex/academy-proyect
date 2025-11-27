
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { StudentResponse, StudentRequest, StudentProfileResponse } from "../../../types/";
import { getAllStudents, createStudent, getStudentProfile } from "../../../api";


export const useStudents = () => {
  return useQuery<StudentResponse[]>({
    queryKey: ["students"],
    queryFn: getAllStudents,
  });
};


export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<StudentResponse, Error, StudentRequest>({
    mutationFn: createStudent,
    onSuccess: () => {
      // Invalida la lista de estudiantes para refrescar automáticamente
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      console.error(error);
      alert("Ocurrió un error al registrar el alumno ");
    },
  });
};


export const useStudentProfile = (id: number) => {
  return useQuery<StudentProfileResponse, Error>({
    queryKey: ["studentProfile", id],
    queryFn: () => getStudentProfile(id),
    enabled: false
  });
};