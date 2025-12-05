// StudentsLayout.tsx
import { ModuleLayout } from "@/components";
import { SelectedStudentProvider } from "@/contexts";

const StudentsLayout = () => (
  <ModuleLayout
    title="Estudiantes"
    tabs={[
      { label: "Listar alumnos", path: "/students", exact: true },
      { label: "Crear", path: "/students/create" } // permission aún no usado
    ]}
    provider={SelectedStudentProvider}
  />
);

export default StudentsLayout;


