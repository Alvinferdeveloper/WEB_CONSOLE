import { ApiError } from "../utils/ApiError";
import { NextApiRequest, NextApiResponse } from "next";
import globalExceptionHandler from "../middlewares/globalExceptionHandler";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

async function executeCommand (req:Request){
    const session = await getServerSession();
    if(session) throw new ApiError(404,"unauthorized access");
    const body = await req.json();
    console.log(body);
    return {name:"albin"}
}

export const POST = globalExceptionHandler(executeCommand);

