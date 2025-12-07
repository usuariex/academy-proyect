import { useEffect, useState } from "react";
import { getGenders } from "@/services";
import { genderResponseAdapter } from "@/adapters";
import type { SelectOption } from "@/models";

export const useGenders = () => {
    const [options, setOptions] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getGenders(); // servicio crudo
                const adapted = genderResponseAdapter(response); // adapter
                setOptions(adapted);
            } catch (err) {
                setError("Error al cargar géneros");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { options, loading, error };
};
