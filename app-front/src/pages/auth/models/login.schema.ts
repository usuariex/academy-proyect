
import { z } from "zod";

export const schema = z.object({
    username: z.string().trim().min(1, "El nombre de usuario es obligatorio"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

export type FormValues = z.infer<typeof schema>;
