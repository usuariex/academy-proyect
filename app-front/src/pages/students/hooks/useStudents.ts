
import { useQuery } from "@tanstack/react-query";
import type { Student } from "@/models";
import { getStudents } from '@/services';
import { StudentResponseAdapter } from '@/adapters'


export const useStudents = (isActive?: boolean) => {
  return useQuery<Student[]>({

    queryKey: ["students", isActive],
    queryFn: async () => {
      const raw = await getStudents(isActive);
      return raw.map(StudentResponseAdapter);
    },
  });
};

