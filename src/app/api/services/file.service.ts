import { ApiError } from "../utils/ApiError";
import { findPathToGo, findPath } from "../utils/commandUtils";
import db from "@/app/libs/db"

export async function writableFilePath(filePath: string, userId: number, currentPath: { id: number, absolutePath: string }) {
    const { pathToGo, resourceName } = findPathToGo(filePath);
    const pathFound = await findPath(currentPath.id, pathToGo, userId);
    const file = await db.file.findFirst({ where: { name: resourceName, directoryId: pathFound?.id }, select: { id: true } });
    if (file) return { isFilePathWritable: true, fileId: file.id };
    if (pathFound) return { isFilePathWritable: true, fileId: null };
    return { isFilePathWritable: false, fileId: null };
}

export async function createFile(userId: number, path: string, currentPath: { id: number, absolutePath: string }, content?: string) {
    const { pathToGo, resourceName } = findPathToGo(path);
    const pathFound = await findPath(currentPath.id, pathToGo, userId);
    if (!pathFound) return { exists: null, fileId: null };
    const isCurrentPathRoot = pathFound.absolutePath == '/';
    const fileAbsolutePath = pathFound.absolutePath.concat(`${isCurrentPathRoot ? '' : '/'}${resourceName}`);
    const newFileExist = await db.file.findFirst({ where: { name: resourceName, directoryId: pathFound.id, userId } });
    if (newFileExist) return { exists: true, fileId: newFileExist.id };
    const newFile = await db.file.create({ data: { name: resourceName, directoryId: pathFound.id, userId, absolutePath: fileAbsolutePath, content } })
    return { exists: false, fileId: newFile.id };
}

export async function saveFileContent(filePath: string, userId: number, currentPath: { id: number, absolutePath: string }, content: string, fileId: number, fileName?: string) {
    if (fileId) {
        const file = await db.file.findUnique({ where: { id: fileId }, select: { absolutePath: true, name: true } });
        let absolutePath = file?.absolutePath;
        if (file?.name != fileName && file) {
            const fileExist = await db.file.findFirst({ where: { name: fileName, directoryId: currentPath.id } });
            if (fileExist) throw new ApiError(409, `File '${fileName}' already exists`);
            const path = file.absolutePath.split('/');
            path.pop();
            absolutePath = '/'.concat(path.concat(`${path.length > 1 ? '/' : ''}${fileName}`).join(''));
        }
        const fileUpdated = await db.file.update({ where: { id: fileId }, data: { content, name: fileName, absolutePath } })
        return fileUpdated.id;
    }
    else{
        const newFile = await createFile(userId, filePath, currentPath, content);
        return newFile.fileId;
    }
}

export async function getFileContent(id: number) {
    const file = await db.file.findUnique({ where: { id }, select: { content: true } });
    return file?.content;
}