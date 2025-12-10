

import { TheoryConfigAdapter } from "@/adapters/evaluation";
import type { TheoryConfigResponse, TheoryConfig } from "@evaluations/models";
import { api } from "@/services";

export const getTheoryConfigs = async (): Promise<TheoryConfig[]> => {
    const res = await api.get<TheoryConfigResponse[]>("/evaluations/theory-config/");
    const data = res.data;
    return data.map(TheoryConfigAdapter);
};
