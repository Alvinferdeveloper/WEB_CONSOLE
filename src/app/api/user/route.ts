import * as userService from '../services/user.service'
import globalExceptionHandler from "../middlewares/globalExceptionHandler";

async function registerUser (req:Request){
    const { name, email, lastName, username, password } = await req.json();
    const user = await userService.register({ name, email, lastName, username, password});
    return user;
}

export const POST = globalExceptionHandler(registerUser);