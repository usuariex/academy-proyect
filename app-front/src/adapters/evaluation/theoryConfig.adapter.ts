import type { TheoryConfigResponse, TheoryConfig } from "@evaluations/models";

export const TheoryConfigAdapter = (data: TheoryConfigResponse): TheoryConfig => ({
    id: data.config_id,
    name: data.config_name ?? data.name,
    totalQuestions: data.total_questions,
    notes: data.notes,
    createdAt: new Date(data.created_at),
    isActive: data.is_active,
});