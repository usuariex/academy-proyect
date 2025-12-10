import { useState } from "react";
import { EvaluationPanelView } from "@evaluations/view";
import { EvaluationCard } from "@evaluations/components";
import { StudentByEvaluationRow } from "@evaluations/components";
import type { Evaluation } from "@/models/evaluation";
import type { Column } from "@/models/ui";
import styles from "./EvaluationListView.module.css";
import { useEvaluations } from "@evaluations/hooks";
import { DataTable } from "@/components/data-display";

export const EvaluationListView = () => {
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [openPanel, setOpenPanel] = useState<boolean>(false);

  const { data: evaluations = [], isLoading, error } = useEvaluations();

  if (isLoading) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.error}>Error al cargar las evaluaciones</div>;

  const columns: Column<Evaluation>[] = [
    { key: "name", label: "Evaluación", render: (ev) => ev.name },
    { key: "plannedDate", label: "Fecha planificación", render: (ev) => ev.plannedDate },
    { key: "code", label: "Código", render: (ev) => ev.code },
    { key: "statusName", label: "Estado", render: (ev) => ev.statusName },
    { key: "actions", label: "Acciones", render: () => null }, // se maneja en RowComponent
  ];

  return (
    <div className={styles.evaluationList}>
      <div className={styles.content__main}>
        <DataTable<Evaluation>
          columns={columns}
          data={evaluations}
          rowKey={(ev) => ev.code}
          RowComponent={(props) => (
            <StudentByEvaluationRow
              {...props}
              onSelect={(ev) => setSelectedEvaluation(ev)}
            />
          )}
        />

        {selectedEvaluation ? (
          <div className={styles.card}>
            <EvaluationCard
              evaluation={selectedEvaluation}
              onView={(ev) => {
                setSelectedEvaluation(ev);
                setOpenPanel(true);
              }}
              onAssign={(ev) => console.log("assign", ev)}
            />
          </div>
        ) : (
          <p>Haz click en una evaluación para ver detalles.</p>
        )}
      </div>

      {openPanel && selectedEvaluation && (
        <EvaluationPanelView
          evaluation={selectedEvaluation}
          isOpen
          onClose={() => setOpenPanel(false)}
        />
      )}
    </div>
  );
};
