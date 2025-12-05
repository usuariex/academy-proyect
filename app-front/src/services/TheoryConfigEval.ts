import api from "./axiosConfig";
import type { EvaluationConfigRequest, EvaluationConfigResponse } from "../models/TheoryConfigEval";

export const createEvaluationConfig = async ( data: EvaluationConfigRequest ): Promise<EvaluationConfigResponse> => {
  const res = await api.post("evaluaciones/configuracion/", data);
  return res.data;
};