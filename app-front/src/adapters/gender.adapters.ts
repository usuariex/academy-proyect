import type { GenderResponse, GenderSelectOption } from "@/models";

export const genderResponseAdapter = (data: GenderResponse[]): GenderSelectOption[] => {
    return data.map((item) => ({
        label: item.nombre,
        value: String(item.id),
    }));
};