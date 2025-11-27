import { useState } from "react";
import type { PhysicalSessionRequest } from "../../../types";
import '../FormSteps.css';

interface Props {
  evaluationId: number;
  plannedDate: string;
  onSave: (data: PhysicalSessionRequest) => Promise<void> | void;
}

const StepPhysicalSession = ({ evaluationId, plannedDate, onSave }: Props) => {
  const [localData, setLocalData] = useState<PhysicalSessionRequest>({
    evaluationId,
    realizationDate: plannedDate,
    place: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = <K extends keyof PhysicalSessionRequest>(
    field: K,
    value: PhysicalSessionRequest[K]
  ) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!localData.realizationDate || !localData.place) {
      alert("Todos los campos son obligatorios");
      return;
    }
    try {
      setSaving(true);
      await onSave(localData);
      setSaved(true);
    } catch (err) {
      console.error(err);
      alert("Error al guardar sesión física");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-step">
      <h3>Sesión física</h3>
      <p>Fecha de planificación: {plannedDate}</p>

      {!saved ? (
        <form>
          <label>
            Fecha de realización:
            <input
              type="date"
              value={localData.realizationDate}
              onChange={(e) => handleChange("realizationDate", e.target.value)}
            />
          </label>

          <label>
            Lugar:
            <input
              value={localData.place}
              onChange={(e) => handleChange("place", e.target.value)}
            />
          </label>

          <button type="button" disabled={saving} onClick={handleSubmit}>
            {saving ? "Guardando..." : "Guardar sesión"}
          </button>
        </form>
      ) : (
        <div className="result-block">
          <h4>Sesión física creada correctamente</h4>
          <ul>
            <li><strong>Evaluación ID:</strong> {evaluationId}</li>
            <li><strong>Fecha de planificación:</strong> {plannedDate}</li>
            <li><strong>Fecha de realización:</strong> {localData.realizationDate}</li>
            <li><strong>Lugar:</strong> {localData.place}</li>
          </ul>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Añadir alumnos a evaluación
          </a>
        </div>
      )}
    </div>
  );
};

export default StepPhysicalSession;
