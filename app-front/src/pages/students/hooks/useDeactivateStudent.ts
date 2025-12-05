
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateStudent } from "@/services";

export const useDeactivateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (uuid: string) => deactivateStudent(uuid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
};
