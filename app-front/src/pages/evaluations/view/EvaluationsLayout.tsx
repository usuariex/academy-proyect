// EvaluationsLayout.tsx
import { ModuleLayout } from "@/components/layout";

export const EvaluationsLayout = () => (
  <ModuleLayout
    title="Evaluaciones"
    tabs={[
      { label: "Lista de Evaluaciones", path: "/evaluations", exact: true },
      { label: "Crear", path: "/evaluations/create" } // permission aún no usado
    ]}
  />
);

