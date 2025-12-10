import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./EvaluationForm.module.css";

import { useEvaluationTypes } from "@/hooks/evaluation";
import { useExercises } from "@/hooks/exercise";
import { useTheoryConfigs } from "@evaluations/hooks";
import { useCreateEvaluation } from "@evaluations/hooks/";

import type { EvaluationRequest, Evaluation } from "@/models/evaluation";
import type { Exercise } from "@evaluations/models";
import type { TheoryConfig } from "@evaluations/models";

export const EvaluationForm = () => {
  const [form, setForm] = useState<Partial<EvaluationRequest>>({
    description: "",
    typeId: 0,
    plannedDate: "",
    statusId: 1,
  });

  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null);

  const { data: types, isLoading: typesLoading, error: typesError } = useEvaluationTypes();
  const { data: exercises, isLoading: exLoading, error: exError } = useExercises();
  const { data: configs, isLoading: cfgLoading, error: cfgError } = useTheoryConfigs();

  const { mutateAsync, status } = useCreateEvaluation();
  const isCreating = status === "pending";

  useEffect(() => {
    setSelectedExerciseId(null);
    setSelectedConfigId(null);
  }, [form.typeId]);

  const handleChange = <K extends keyof Partial<EvaluationRequest>>(field: K, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isPhysicalType = (typeId?: number) => (typeId ?? 0) === 1;

  if (typesLoading || exLoading || cfgLoading) return <p className={styles.center}>Cargando datos...</p>;
  if (typesError) return <p className={styles.center}>Error al cargar tipos</p>;
  if (exError) return <p className={styles.center}>Error al cargar ejercicios</p>;
  if (cfgError) return <p className={styles.center}>Error al cargar configuraciones</p>;

  const handleSubmit = async () => {
    if (!form.typeId || !form.plannedDate || !form.description || !form.statusId) {
      Swal.fire({ icon: "warning", title: "Campos obligatorios", text: "Completa todos los campos." });
      return;
    }

    const payload: EvaluationRequest = {
      plannedDate: form.plannedDate as string,
      description: form.description as string,
      typeId: form.typeId as number,
      statusId: form.statusId as number,
    };

    if (isPhysicalType(form.typeId)) {
      if (!selectedExerciseId) {
        Swal.fire({ icon: "warning", title: "Selecciona ejercicio", text: "Debes elegir un ejercicio." });
        return;
      }
      payload.exerciseId = selectedExerciseId;
    } else {
      if (!selectedConfigId) {
        Swal.fire({ icon: "warning", title: "Selecciona configuración", text: "Debes elegir una configuración." });
        return;
      }
      payload.configId = selectedConfigId;
    }

    try {
      const res: Evaluation = await mutateAsync(payload);
      await Swal.fire({ icon: "success", title: "Evaluación creada", text: `Código: ${res.code}` });
      setForm({ description: "", typeId: 0, plannedDate: "", statusId: 1 });
      setSelectedExerciseId(null);
      setSelectedConfigId(null);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear la evaluación." });
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.left} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <h2 className={styles.title}>Crear evaluación</h2>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Tipo</span>
            <select
              className={styles.select}
              value={form.typeId ?? 0}
              onChange={(e) => handleChange("typeId", Number(e.target.value))}
            >
              <option value={0}>Seleccione tipo</option>
              {types?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Fecha planificada</span>
            <input
              className={styles.input}
              type="date"
              value={form.plannedDate ?? ""}
              onChange={(e) => handleChange("plannedDate", e.target.value)}
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Estado</span>
            <select
              className={styles.select}
              value={form.statusId ?? 1}
              onChange={(e) => handleChange("statusId", Number(e.target.value))}
            >
              <option value={1}>Activa</option>
              <option value={2}>Pendiente</option>
              <option value={3}>Finalizada</option>
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Descripción</span>
            <input
              className={styles.input}
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </label>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={isCreating}
          >
            {isCreating ? "Creando..." : "Crear evaluación"}
          </button>
        </div>
      </form>

      <aside className={styles.right}>
        <h3 className={styles.subtitle}>Asignación</h3>

        {(form.typeId ?? 0) === 0 && <p className={styles.muted}>Selecciona un tipo para ver opciones de asignación</p>}

        {(form.typeId ?? 0) > 0 && isPhysicalType(form.typeId) && (
          <div className={styles.assignBlock}>
            <p className={styles.muted}>Selecciona un ejercicio para la evaluación física</p>
            <select
              className={styles.selectFull}
              value={selectedExerciseId ?? 0}
              onChange={(e) => setSelectedExerciseId(Number(e.target.value) || null)}
            >
              <option value={0}>Seleccione ejercicio</option>
              {exercises?.map((ex: Exercise) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </div>
        )}

        {(form.typeId ?? 0) > 0 && !isPhysicalType(form.typeId) && (
          <div className={styles.assignBlock}>
            <p className={styles.muted}>Selecciona una configuración para la evaluación teórica</p>
            <select
              className={styles.selectFull}
              value={selectedConfigId ?? 0}
              onChange={(e) => setSelectedConfigId(Number(e.target.value) || null)}
            >
              <option value={0}>Seleccione configuración</option>
              {configs?.map((c: TheoryConfig) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
      </aside>
    </div>
  );
}
