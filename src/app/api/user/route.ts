import * as userService from '../services/user.service'
import globalExceptionHandler from "../middlewares/globalExceptionHandler";
import { isUserValid } from '../utils/validation';
import { ApiError } from '../utils/ApiError';

async function registerUser (req:Request){
    const userReq = await req.json();
    if(!isUserValid(userReq)){
        throw new ApiError(400, "Datos ingresados invalidos");
    }
    const user = await userService.register(userReq);
    return user;
}

export const POST = globalExceptionHandler(registerUser);