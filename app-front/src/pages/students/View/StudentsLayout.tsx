// StudentsLayout.tsx
import { ModuleLayout } from "@/components/layout";
import { SelectedStudentProvider } from "@/contexts";

export const StudentsLayout = () => (
  <ModuleLayout
    title="Estudiantes"
    tabs={[
      { label: "Listar alumnos", path: "/students", exact: true },
      { label: "Crear", path: "/students/create" } // permission aún no usado
    ]}
    provider={SelectedStudentProvider}
  />
);


