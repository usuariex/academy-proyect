import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudent } from "@/services";

export const useDeleteStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (uuid: string) => deleteStudent(uuid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
};
