import { userSchema } from "@/app/schemas/userSchema"
interface User {
    name: string,
    email: string,
    lastName: string,
    username: string,
    password: string
}
export function isUserValid(user: User) {
    const result = userSchema.safeParse(user);
    if (!result.success) {
        return false;
    }
    return true;
}