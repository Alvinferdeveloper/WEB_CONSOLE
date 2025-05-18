import { getServerSession } from "next-auth/next";
import { ApiError } from "../../utils/ApiError";
import globalExceptionHandler from "../../middlewares/globalExceptionHandler";
import { authOptions } from "../../auth/[...nextauth]/route";
import { fileExists } from "../../services/file.service";

async function fileExistsPOST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) throw new ApiError(404, "unauthorized access");
    const { filePath, currentPath } = await req.json();
    const fileExist = await fileExists(filePath, parseInt(session.user.id), currentPath);
    return { exists: fileExist };
}

export const POST = globalExceptionHandler(fileExistsPOST);

