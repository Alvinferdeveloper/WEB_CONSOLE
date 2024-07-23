import { ApiError } from "../utils/ApiError";
import { NextApiRequest, NextApiResponse } from "next";
import globalExceptionHandler from "../middlewares/globalExceptionHandler";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { commandExecutables } from "../data/commandExecutables";
import { authOptions } from "../auth/[...nextauth]/route";

async function executeCommand (req:Request){
    const session = await getServerSession(authOptions);
    if(!session) throw new ApiError(404,"unauthorized access");
    const { commandName, commandFlags, commandParams, currentPath } = await req.json();
    if(!(commandName in commandExecutables)) throw new ApiError(402,'Invalid command');
    const commandOutput = await commandExecutables[commandName as keyof typeof commandExecutables]({userId:parseInt(session.user.id), commandElements:{commandFlags,commandName, commandParams},currentPath});
    return commandOutput;
}

export const POST = globalExceptionHandler(executeCommand);

