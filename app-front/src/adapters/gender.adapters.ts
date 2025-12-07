import type { GenderResponse, SelectOption } from "@/models";

export const genderResponseAdapter = (data: GenderResponse[]): SelectOption[] => {
    return data.map((item) => ({
        label: item.name,
        value: String(item.id),
    }));
};