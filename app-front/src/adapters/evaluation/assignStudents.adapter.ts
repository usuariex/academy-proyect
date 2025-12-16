import type { AssignStudents, AssignStudentsResponse } from "@evaluations/models";

export const AssignStudentsAdapter = (
    response: AssignStudentsResponse
): AssignStudents => {
    return {
        newStudents: response.assigned,
        skippedStudents: response.already_assigned,
    };
};
