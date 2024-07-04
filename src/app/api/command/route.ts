import { ApiError } from "../utils/ApiError";
import { NextApiRequest, NextApiResponse } from "next";
import globalExceptionHandler from "../middlewares/globalExceptionHandler";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { commandExecutables } from "../data/commandExecutables";

async function executeCommand (req:Request){
    const session = await getServerSession();
    if(!session) throw new ApiError(404,"unauthorized access");
    const { commandName, flags, parameters } = await req.json();
    console.log(commandName,flags,parameters);
    if(!(commandName in commandExecutables)) throw new ApiError(402,'Invalid command');
    const commandOutput = await commandExecutables[commandName as keyof typeof commandExecutables](session.user.name);
    return commandOutput;
}

export const POST = globalExceptionHandler(executeCommand);

