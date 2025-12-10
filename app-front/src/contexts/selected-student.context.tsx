import { createContext, useState, useMemo } from "react";
import type { FC, ReactNode } from "react";
import type { Student, SelectedStudentValue } from "@/models/student";



// Contexto
export const SelectedStudentContext = createContext<SelectedStudentValue | undefined>(undefined);

// Provider
export const SelectedStudentProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const value = useMemo(
    () => ({ selectedStudent, setSelectedStudent }),
    [selectedStudent]
  );

  return (
    <SelectedStudentContext.Provider value={value}>
      {children}
    </SelectedStudentContext.Provider>
  );
};

