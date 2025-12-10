import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { StudentResponse, StudentRequest } from "@/models/student";
import { createStudent } from '@/services/student';


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