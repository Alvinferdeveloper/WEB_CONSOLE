import { getServerSession } from "next-auth/next";
import { ApiError } from "../../../utils/ApiError";
import globalExceptionHandler from "../../../middlewares/globalExceptionHandler";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getFileContent } from "../../../services/file.service";

async function getContentGET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) throw new ApiError(404, "unauthorized access");
    const { id } = await params;
    const fileContent = await getFileContent(parseInt(id));
    return { content: fileContent };
}

export const GET = globalExceptionHandler(getContentGET);

