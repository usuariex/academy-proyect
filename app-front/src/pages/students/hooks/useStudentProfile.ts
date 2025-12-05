
import { useQuery } from "@tanstack/react-query";
import type { StudentProfileResponse } from "@/models";
import { getStudentProfile } from '@/services';


export const useStudentProfile = (uuid: string) => {
  return useQuery<StudentProfileResponse, Error>({
    queryKey: ["studentProfile", uuid],
    queryFn: () => getStudentProfile(uuid),
    enabled: false
  });
};