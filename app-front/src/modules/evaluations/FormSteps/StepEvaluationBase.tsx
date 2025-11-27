import { useState } from "react";
import type { EvaluationTypes, EvaluationRequest } from "../../../types";
import '../FormSteps.css';

interface Props {
  onCreate: (data: EvaluationRequest) => void;
  evaluationTypes: EvaluationTypes[];
}

const StepEvaluationBase = ({ onCreate, evaluationTypes }: Props) => {
  const [localData, setLocalData] = useState<EvaluationRequest>({
    description: null,
    typeId: 0,
    plannedDate: null,
    statusId: 1,
  });

  const handleChange = <K extends keyof EvaluationRequest>(
    field: K,
    value: EvaluationRequest[K]
  ) => {
    setLocalData({ ...localData, [field]: value });
  };

  const handleSubmit = () => {
    if (!localData.description || !localData.typeId || !localData.plannedDate || !localData.statusId) {
      alert("Todos los campos son obligatorios");
      return;
    }
    onCreate(localData); // pasa el objeto completo validado
  };

  return (
    <form className="form-step">
      <h3>Detalles de evaluación</h3>


      <label>
        Tipo de Evaluación:
        <select
          value={localData.typeId || ""}
          onChange={(e) => handleChange("typeId", Number(e.target.value))}
        >
          <option value={0}>Seleccione tipo</option>
          {evaluationTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Fecha planificada:
        <input
          type="date"
          value={localData.plannedDate ?? ""}
          onChange={(e) => handleChange("plannedDate", e.target.value)}
        />
      </label>

      <label>
        Estado:
        <select
          value={localData.statusId}
          onChange={(e) => handleChange("statusId", Number(e.target.value))}
        >
          <option value={1}>Activa</option>
          <option value={2}>Pendiente</option>
          <option value={3}>Finalizada</option>
        </select>
      </label>
      
      <label>
        Descripción:
        <input
          value={localData.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </label>

      <button type="button" onClick={handleSubmit}>Crear evaluación</button>
    </form>
  );
};

export default StepEvaluationBase;
