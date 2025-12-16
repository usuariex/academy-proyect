
import type { evaluationStatusResponse, evaluationStatus } from "@evaluations/models";

export const evaluationStatusAdapter = (resp: evaluationStatusResponse): evaluationStatus => ({
    id: resp.id,
    label: resp.name,
});
