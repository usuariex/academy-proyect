/* // src/auth/hooks/useLogin.ts
import { useState } from "react";
import { login } from "@/services/student";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (data: { username: string; password: string }) => {
        setLoading(true);
        setError(null);
        try {
            const result = await login(data);
            localStorage.setItem("token", result.token);
            localStorage.setItem("role", result.role);
            return result;
        } catch (err: any) {
            setError(err.message || "Error en login");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, error };
};
 */