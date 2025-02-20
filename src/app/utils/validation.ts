import { userSchema } from "@/app/schemas/userSchema"
interface User {
    name: string,
    email: string,
    lastName: string,
    username: string,
    password: string
}
export function validateUserRegistration(user: User) {
    const result = userSchema.safeParse(user);
    if (!result.success) {
        throw new Error(result.error.errors.map(err => err.message).join('\n'));
    }
}