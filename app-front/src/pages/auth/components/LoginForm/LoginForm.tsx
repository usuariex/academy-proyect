/* import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputLogin } from "@auth/components";
import { schema } from "@auth/models";
import type { FormValues } from "@auth/models";
import { useLogin } from "@auth/hooks";

const LoginForm = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onBlur",
    });

    const { handleLogin, loading, error } = useLogin();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const result = await handleLogin(data);
            if (result.role === "Admin") {
                window.location.href = "/admin-dashboard";
            } else if (result.role === "Teacher") {
                window.location.href = "/teacher-dashboard";
            } else {
                window.location.href = "/student-dashboard";
            }
        } catch {
            // el error ya está manejado en el hook
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputLogin
                name="username"
                control={control}
                label="Usuario"
                type="text"
                error={errors.username}
            />
            <InputLogin
                name="password"
                control={control}
                label="Contraseña"
                type="password"
                error={errors.password}
            />
            <button type="submit">Log in</button>
        </form>
    );
};

export default LoginForm;
 */