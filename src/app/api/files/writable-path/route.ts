import { getServerSession } from "next-auth/next";
import { ApiError } from "../../utils/ApiError";
import globalExceptionHandler from "../../middlewares/globalExceptionHandler";
import { authOptions } from "@/app/libs/authOptions";
import { writableFilePath } from "../../services/file.service";

async function writablePathPOST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) throw new ApiError(404, "unauthorized access");
    const { filePath, currentPath } = await req.json();
    const fileExist = await writableFilePath(filePath, parseInt(session.user.id), currentPath);
    if (!fileExist.isFilePathWritable) return { exists: false };
    return { exists: fileExist.isFilePathWritable, id: fileExist.fileId };
}

export const POST = globalExceptionHandler(writablePathPOST);

