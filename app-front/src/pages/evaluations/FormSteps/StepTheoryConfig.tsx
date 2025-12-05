import { useState } from "react";
import type { EvaluationConfigRequest } from "../../../models";
import '../FormSteps.css';


interface Props {
  evaluationId: number;
  plannedDate: string;
  onSave: (data: EvaluationConfigRequest) => Promise<void> | void;
}

/**
 * Ajusta las opciones de configuración teórica según tu dominio real.
 * Aquí usamos configId como un selector básico (ej. banco de preguntas / modalidad).
 */
const StepTheoryConfig = ({ evaluationId, plannedDate, onSave }: Props) => {
  const [localData, setLocalData] = useState<EvaluationConfigRequest>({
    evaluationId,
    configId: 0,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = <K extends keyof EvaluationConfigRequest>(
    field: K,
    value: EvaluationConfigRequest[K]
  ) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!localData.configId || localData.configId === 0) {
      alert("Debes seleccionar una configuración");
      return;
    }
    try {
      setSaving(true);
      await onSave(localData);
      setSaved(true);
    } catch (err) {
      console.error(err);
      alert("Error al guardar configuración teórica");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-step">
      <h3>Configuración teórica</h3>
      <p>Fecha de planificación: {plannedDate}</p>

      {!saved ? (
        <form>
          <label>
            Configuración:
            <select
              value={localData.configId}
              onChange={(e) => handleChange("configId", Number(e.target.value))}
            >
              <option value={0}>Seleccione configuración</option>
              <option value={1}>Configuacion general</option>
              <option value={2}>Configuracion recuperacion</option>
              <option value={3}>Config Básica</option>
              <option value={4}>Config Avanzada</option>
            </select>
          </label>

          <button type="button" disabled={saving} onClick={handleSubmit}>
            {saving ? "Guardando..." : "Guardar configuración"}
          </button>
        </form>
      ) : (
        <div className="result-block">
          <h4>Configuración teórica creada correctamente</h4>
          <ul>
            <li><strong>Evaluación ID:</strong> {evaluationId}</li>
            <li><strong>Fecha de planificación:</strong> {plannedDate}</li>
            <li><strong>Configuración ID:</strong> {localData.configId}</li>
          </ul>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Añadir alumnos a evaluación
          </a>
        </div>
      )}
    </div>
  );
};

export default StepTheoryConfig;
