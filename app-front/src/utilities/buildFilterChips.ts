import type { FilterChip } from "@/models/ui"

interface FilterDefinition {
    active: boolean;
    label: string;
    onRemove: () => void;
}

export const buildFilterChips = (filters: FilterDefinition[]): FilterChip[] => {
    return filters
        .filter((f) => f.active)
        .map((f) => ({ label: f.label, onRemove: f.onRemove }));
};
