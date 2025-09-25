import globalExceptionHandler from "../middlewares/globalExceptionHandler";
import db from "@/app/libs/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/libs/authOptions";
import { ApiError } from "../utils/ApiError";

async function getInitialPath() {
    const session = await getServerSession(authOptions);
    if (!session) throw new ApiError(404, "unauthorized access");
    const path = await db.directory.findFirst({ where: { userId: parseInt(session.user.id), absolutePath: '/' } });
    return path;
}

export const GET = globalExceptionHandler(getInitialPath);

