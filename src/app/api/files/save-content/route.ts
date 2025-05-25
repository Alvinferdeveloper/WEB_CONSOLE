import { getServerSession } from "next-auth/next";
import { ApiError } from "../../utils/ApiError";
import globalExceptionHandler from "../../middlewares/globalExceptionHandler";
import { authOptions } from "../../auth/[...nextauth]/route";
import { saveFileContent } from "../../services/file.service";

async function saveContentPOST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) throw new ApiError(404, "unauthorized access");
    const { filePath, currentPath, content, fileId, fileName } = await req.json();
    await saveFileContent(filePath, parseInt(session.user.id), currentPath, content, fileId, fileName);
}

export const POST = globalExceptionHandler(saveContentPOST);

