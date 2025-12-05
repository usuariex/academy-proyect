import { useContext } from "react";
import { SelectedStudentContext } from '@/contexts'
import type { SelectedStudentValue } from "@/models";


export const useSelectedStudent = (): SelectedStudentValue => {
    const ctx = useContext(SelectedStudentContext);
    if (!ctx) throw new Error("useSelectedStudent must be used within SelectedStudentProvider");
    return ctx;
};