import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvaluationTypes, createEvaluation, createEvaluationConfig } from "../../services";
import type { EvaluationTypes, EvaluationRequest, EvaluationResponse, EvaluationConfigRequest } from "../../models";
import './EvaluationWizard.css';
import Swal from "sweetalert2";

import StepEvaluationBase from "./FormSteps/StepEvaluationBase";
import StepTheoryConfig from "./FormSteps/StepTheoryConfig";

const EvaluationWizard = () => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<number | null>(null);
  const [evaluationId, setEvaluationId] = useState<number | null>(null);
  const [createdEvaluation, setCreatedEvaluation] = useState<EvaluationResponse | null>(null);

  const { data: evaluationTypes, isLoading, error } = useQuery<EvaluationTypes[]>({
    queryKey: ["evaluationTypes"],
    queryFn: getEvaluationTypes,
    staleTime: 1000 * 60 * 5,
  });

  const handleCreateEvaluation = async (payload: EvaluationRequest) => {
    try {
      const res = await createEvaluation(payload);
      setEvaluationId(res.id);
      setType(res.typeId);
      setCreatedEvaluation(res);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Error al crear evaluación base");
    }
  };

  const resetWizard = () => {
    setStep(1);
    setEvaluationId(null);
    setCreatedEvaluation(null);
    setType(null);
  };



  const handleSaveConfig = async (payload: EvaluationConfigRequest) => {
    try {
      await createEvaluationConfig(payload);
      await Swal.fire({
        icon: "success",
        title: "Configuración teórica creada",
        text: "La configuración se guardó correctamente",
        timer: 2000,              // ⏱ se cierra en 2 segundos
        timerProgressBar: true,   // barra de progreso opcional
        showConfirmButton: false, // no muestra botón
      });
      resetWizard();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la configuración teórica"
      });
    }
  };

  if (isLoading) return <p>Cargando tipos de evaluación...</p>;
  if (error) return <p>Error al cargar tipos de evaluación</p>;

  return (
    <div className="evaluation-wizard">
      <h2>Crear evaluación</h2>
      <p>Paso {step}</p>

      {step === 1 && (
        <StepEvaluationBase
          onCreate={handleCreateEvaluation}
          evaluationTypes={evaluationTypes ?? []}
        />
      )}

      {step === 2 && createdEvaluation && (
        <div className="evaluation-summary">
          <h3 className="summary-title">Evaluación creada</h3>

          <div className="summary-details">
            <p><strong>Fecha de creación:</strong> {createdEvaluation.createdAt}</p>
            <p><strong>Descripción:</strong> {createdEvaluation.description}</p>
            <p><strong>Fecha planificada:</strong> {createdEvaluation.plannedDate}</p>
            <p><strong>Estado:</strong> {createdEvaluation.statusName}</p>
            <p><strong>Tipo:</strong> {createdEvaluation.typeName}</p>
          </div>


          <div className="summary-actions">
            <button className="btn-secondary" onClick={resetWizard}>
              Crear otra evaluación
            </button>

            {type === 2 && (
              <button className="btn-primary" onClick={() => setStep(3)}>
                Configurar sesión teórica
              </button>
            )}
          </div>


        </div>

      )}

      {step === 3 && type === 2 && evaluationId && (
        <StepTheoryConfig
          evaluationId={evaluationId}
          plannedDate={createdEvaluation?.plannedDate ?? ""}
          onSave={handleSaveConfig}
        />
      )}

    </div>
  );
};

export default EvaluationWizard;
