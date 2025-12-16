import { EvaluationPanelView } from "@evaluations/view";
import { EditEvaluationModal, EvaluationCard } from "@evaluations/components";
import { EvaluationTableRow } from "@evaluations/components";
import type { Evaluation } from "@/models/evaluation";
import styles from "./EvaluationListView.module.css";
import type { Column, SelectOption } from "@/models/ui";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-display";
import { useEvaluations, useTheoryConfigs } from "@evaluations/hooks";
import { SearchInput, SelectField } from "@/components/forms";
import { FilterChips } from "@/components/ui";
import { buildFilterChips } from "@/utilities/";
import { useExercises } from "@/hooks/exercise";
import { useEvaluationStatus } from "@/hooks/evaluation";
import { SelectedEvaluationProvider } from "@/contexts/selected-evaluation.context";
import { AssignStudentsModal } from "@evaluations/components";


export const EvaluationListView = () => {
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [openEvaluacionPanel, setOpenEvaluacionPanel] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [OpenAssignStudents, setOpenAssignStudents] = useState<boolean>(false);


  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchCode, setSearchCode] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const { data: evaluationStatus = [] } = useEvaluationStatus();
  const { data: theoryConfigs = [] } = useTheoryConfigs();
  const { data: exercises = [] } = useExercises();
  const { data: evaluations = [], isLoading, error } = useEvaluations();

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((ev) => {
      if (statusFilter !== "all" && ev.statusName !== statusFilter) return false;
      if (typeFilter !== "all" && ev.typeName !== typeFilter) return false;

      if (dateFrom) {
        const planned = new Date(ev.plannedDate);
        const from = new Date(dateFrom);
        if (planned < from) return false;
      }
      if (dateTo) {
        const planned = new Date(ev.plannedDate);
        const to = new Date(dateTo);
        if (planned > to) return false;
      }

      if (searchCode.trim()) {
        const q = searchCode.trim().toLowerCase();
        if (!ev.code.toLowerCase().includes(q)) return false;
      }

      return true;
    });
  }, [evaluations, statusFilter, typeFilter, dateFrom, dateTo, searchCode]);

  const statusOptions: SelectOption[] = [
    { label: "Todos los estados", value: "all" },
    { label: "Archivada", value: "Archivada" },
    { label: "Cancelada", value: "Cancelada" },
    { label: "Completada", value: "Completada" },
    { label: "Pendiente", value: "Pendiente" },
    { label: "Programada", value: "Programada" },
    { label: "Sin asignar", value: "Sin asignar" },
  ];

  const typeOptions: SelectOption[] = [
    { label: "Todos los tipos", value: "all" },
    { label: "Física", value: "Fisica" },
    { label: "Teórica", value: "Teorica" },
  ];

  const columns: Column<Evaluation>[] = [
    { key: "name", label: "Evaluación", render: (ev) => ev.name },
    { key: "plannedDate", label: "Fecha planificación", render: (ev) => ev.plannedDate },
    { key: "code", label: "Código", render: (ev) => ev.code },
    { key: "statusName", label: "Estado", render: (ev) => ev.statusName },
    { key: "actions", label: "Acciones", render: () => null },
  ];

  const chips = buildFilterChips([
    {
      active: statusFilter !== "all",
      label: `Estado: ${statusFilter}`,
      onRemove: () => setStatusFilter("all"),
    },
    {
      active: typeFilter !== "all",
      label: `Tipo: ${typeFilter}`,
      onRemove: () => setTypeFilter("all"),
    },
    {
      active: !!dateFrom,
      label: `Desde: ${dateFrom}`,
      onRemove: () => setDateFrom(""),
    },
    {
      active: !!dateTo,
      label: `Hasta: ${dateTo}`,
      onRemove: () => setDateTo(""),
    },
    {
      active: !!searchCode,
      label: `Código contiene "${searchCode}"`,
      onRemove: () => setSearchCode(""),
    },
  ]);

  if (isLoading) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.error}>Error al cargar las evaluaciones</div>;

  return (

    <SelectedEvaluationProvider selectedEvaluation={selectedEvaluation}>

      <div className={styles.evaluationList}>
        {/* 🔹 Barra de filtros */}
        <div className={styles.filtersBar}>
          <SearchInput
            className={styles.searchInput}
            value={searchCode}
            onChange={setSearchCode}
            onClear={() => setSearchCode("")}
            onSubmit={() => console.log("Buscar código:", searchCode)}
            placeholder="Buscar código"
          />

          <div className={styles.filtersRight}>
            <SelectField
              className={styles.selectField}
              id="type"
              label="Tipo"
              value={typeFilter}
              options={typeOptions}
              onChange={(e) => setTypeFilter(e.target.value)}
            />

            <SelectField
              className={styles.selectField}
              id="status"
              label="Estado"
              value={statusFilter}
              options={statusOptions}
              onChange={(e) => setStatusFilter(e.target.value)}
            />

            <div className={styles.dateFilters}>
              <label>
                Desde:
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </label>

              <label>
                Hasta:
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </label>
            </div></div>
        </div>


        <div className={styles.activeChips}>
          <FilterChips chips={chips} />
        </div>


        <div className={styles.content__main}>

          <DataTable<Evaluation>
            columns={columns}
            data={filteredEvaluations}
            rowKey={(ev) => ev.code}
            className={styles.table__custom}
            RowComponent={(props) => (
              <EvaluationTableRow
                {...props}
                onSelect={(ev) => setSelectedEvaluation(ev)}
                onEdit={(ev) => {
                  setSelectedEvaluation(ev);
                  setOpenEditModal(true);
                }}
              />
            )}
          />


          {selectedEvaluation ? (
            <EvaluationCard
              className={styles.card__custom}
              evaluation={selectedEvaluation}
              onView={(ev) => {
                setSelectedEvaluation(ev);
                setOpenEvaluacionPanel(true);

              }}
              onAssign={() => setOpenAssignStudents(true)}
            />
          ) : (
            <p className={`${styles.card__custom} ${styles.card__placeholder}`}>Haz click en una evaluación para ver detalles.</p>
          )}
        </div>




        {openEvaluacionPanel && selectedEvaluation && (
          <EvaluationPanelView
            evaluation={selectedEvaluation}
            isOpen={openEvaluacionPanel}
            onClose={() => setOpenEvaluacionPanel(false)}
          />
        )}


        {openEditModal && selectedEvaluation && (
          <EditEvaluationModal
            configs={theoryConfigs}
            status={evaluationStatus}
            exercises={exercises}
            evaluation={selectedEvaluation}
            onClose={() => setOpenEditModal(false)}
          />
        )}
      </div>


      {OpenAssignStudents && selectedEvaluation && (
        <AssignStudentsModal
          isOpen={OpenAssignStudents}
          onClose={() => setOpenAssignStudents(false)}
        />
      )}

    </SelectedEvaluationProvider>
  );
};
