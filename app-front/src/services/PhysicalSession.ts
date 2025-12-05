import api from "./axiosConfig";
import type { PhysicalSessionRequest, PhysicalSessionResponse } from "../models/PhysicalSession";

export const createPhysicalSession = async ( data: PhysicalSessionRequest ): Promise<PhysicalSessionResponse> => {
  const res = await api.post("evaluaciones/sesiones/", data);
  return res.data;
};