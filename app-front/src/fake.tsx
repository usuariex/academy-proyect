import { EvaluationPanelView } from "@evaluations/view";
import { EvaluationCard } from "@evaluations/components";
import { EvaluationTableRow } from "@evaluations/components";
import type { Evaluation } from "@/models/evaluation";
import styles from "./EvaluationListView.module.css";
import type { Column/* , SelectOption */ } from "@/models/ui";
import { /* useMemo, */ useState } from "react";
import { DataTable } from "@/components/data-display";
import { useEvaluations } from "@evaluations/hooks";
/*import { SelectField } from "@/components/forms"; */

export const EvaluationListView = () => {

    const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
    const [openPanel, setOpenPanel] = useState<boolean>(false);


    const { data: evaluations = [], isLoading, error } = useEvaluations();
    if (isLoading) return <div className={styles.loading}>Cargando...</div>;
    if (error) return <div className={styles.error}>Error al cargar las evaluaciones</div>;
    /*
    
      const [statusFilter, setStatusFilter] = useState<string>("all");
      const [typeFilter, setTypeFilter] = useState<string>("all");
      const [searchCode, setSearchCode] = useState<string>("");
      const [dateFrom, setDateFrom] = useState<string>(""); // fecha inicial
      const [dateTo, setDateTo] = useState<string>("");     // fecha final opcional
    
    
      const filteredEvaluations = useMemo(() => {
        return evaluations.filter((ev) => {
          // 🔹 Estado
          if (statusFilter !== "all" && ev.statusName !== statusFilter) return false;
    
          // 🔹 Tipo (Fisica / Teorica)
          if (typeFilter !== "all" && ev.typeName !== typeFilter) return false;
    
          // 🔹 Fecha planificación (exacta o rango)
          if (dateFrom) {
            const planned = new Date(ev.plannedDate);
            const from = new Date(dateFrom);
            if (planned < from) return false; // antes del "desde"
          }
          if (dateTo) {
            const planned = new Date(ev.plannedDate);
            const to = new Date(dateTo);
            if (planned > to) return false; // después del "hasta"
          }
    
          // 🔹 Búsqueda por código
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
    
    
    
    
     */


    const columns: Column<Evaluation>[] = [
        { key: "name", label: "Evaluación", render: (ev) => ev.name },
        { key: "plannedDate", label: "Fecha planificación", render: (ev) => ev.plannedDate },
        { key: "code", label: "Código", render: (ev) => ev.code },
        { key: "statusName", label: "Estado", render: (ev) => ev.statusName },
        { key: "actions", label: "Acciones", render: () => null }, // se maneja en RowComponent
    ];

    return (
        <div className={styles.evaluationList}>

            {/*  <div>
                <SelectField
                    id="status"
                    label="Estado"
                    value={statusFilter}
                    options={statusOptions}
                    onChange={(e) => setStatusFilter(e.target.value)}
                />
                <SelectField
                    id="type"
                    label="Tipo"
                    value={typeFilter}
                    options={typeOptions}
                    onChange={(e) => setTypeFilter(e.target.value)}
                />

                <div>
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

                </div>
                <input
                    type="text"
                    id="codeSearch"
                    placeholder="Buscar por código"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                />



            </div> */}

            <div className={styles.content__main}>
                <div className={styles.conteiner_table}>

                    <DataTable<Evaluation>
                        columns={columns}
                        data={evaluations}
                        rowKey={(ev) => ev.code}
                        className={styles.modify_table}
                        RowComponent={(props) => (
                            <EvaluationTableRow
                                {...props}
                                onSelect={(ev) => setSelectedEvaluation(ev)}
                            />
                        )}
                    />
                </div>

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
                    <p className={styles.card}>Haz click en una evaluación para ver detalles.</p>
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
