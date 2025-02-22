import { NextResponse } from "next/server";
import { ApiError } from "../utils/ApiError";

const globalExceptionHandler = (fn:(req:Request)=>Promise<any>) => async (req:Request) => {
    try{
        const resp = await fn(req);
        return NextResponse.json(resp);
    }
   catch(err){
    const typedError = err as ApiError;
    return NextResponse.json({message:typedError.message,status:typedError.httpStatusCode},{status:typedError.httpStatusCode});
   };
}

export default globalExceptionHandler;