import globalExceptionHandler from "../middlewares/globalExceptionHandler";
import db from "@/app/libs/db";

async function getInitialPath (){
    const path = await db.directory.findFirst({where:{userId:parseInt("7"), absolutePath:'/'}});
    return path;
}

export const GET = globalExceptionHandler(getInitialPath);

