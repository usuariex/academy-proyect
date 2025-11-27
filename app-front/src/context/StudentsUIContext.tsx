
import React, { createContext, useContext, useState, useMemo } from "react";
import type {  StudentResponse } from "../types";


interface StudentsUIContextValue {
  selectedStudent: StudentResponse | null;
  setSelectedStudent: (s: StudentResponse | null) => void;
  panelMode: "profile" | "create" | "edit";
  setPanelMode: (m: "profile" | "create" | "edit") => void;
  isAssignModalOpen: boolean;
  setAssignModalOpen: (v: boolean) => void;
}


// Creamos el contexto con el tipo definido
const StudentsUIContext = createContext<StudentsUIContextValue | undefined>(undefined);

// ✅ Provider del contexto
export const StudentsUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);
  const [panelMode, setPanelMode] = useState<"profile" | "create" | "edit">("profile");
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);




  const value: StudentsUIContextValue = useMemo(
    () => ({
      selectedStudent,
      setSelectedStudent,
      panelMode,
      setPanelMode,
      isAssignModalOpen,
      setAssignModalOpen,
    }),
    [selectedStudent, panelMode, isAssignModalOpen]
  );

  return <StudentsUIContext.Provider value={value}>{children}</StudentsUIContext.Provider>;
};

// Hook para consumir el contexto
export const useStudentsUI = (): StudentsUIContextValue => {
  const ctx = useContext(StudentsUIContext);
  if (!ctx) throw new Error("useStudentsUI must be used within StudentsUIProvider");
  return ctx;
};
