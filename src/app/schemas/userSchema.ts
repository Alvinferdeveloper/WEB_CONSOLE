import z from 'zod'
export const userSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("El email no es válido"),
    lastName: z.string().min(3, "El apellido debe tener al menos 3 caracteres"),
    username: z.string().min(5, "El nombre de usuario debe tener al menos 5 caracteres"),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
});