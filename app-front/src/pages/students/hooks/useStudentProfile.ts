
import { useQuery } from "@tanstack/react-query";
import type { StudentProfileResponse } from "@/models/student";
import { getStudentProfile } from '@/services/student';


export const useStudentProfile = (uuid: string) => {
  return useQuery<StudentProfileResponse, Error>({
    queryKey: ["studentProfile", uuid],
    queryFn: () => getStudentProfile(uuid),
    enabled: false
  });
};