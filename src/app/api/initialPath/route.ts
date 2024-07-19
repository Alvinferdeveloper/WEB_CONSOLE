import { ApiError } from "../utils/ApiError";
import globalExceptionHandler from "../middlewares/globalExceptionHandler";
import { getServerSession } from "next-auth";
import db from "@/app/libs/db";
import { authOptions } from "../auth/[...nextauth]/route";

async function getInitialPath (req:Request){
    const session = await getServerSession(authOptions);
    if(!session) throw new ApiError(404,"unauthorized access");
    const path = await db.directory.findFirst({where:{userId:parseInt(session.user.id), absolutePath:'/'}});
    return path;
}

export const GET = globalExceptionHandler(getInitialPath);

