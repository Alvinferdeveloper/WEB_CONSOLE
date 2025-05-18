import { findPathToGo, findPath } from "../utils/commandUtils";
export async function fileExists(filePath: string, userId: number, currentPath: { id: number, absolutePath: string }) {
    const { pathToGo } = findPathToGo(filePath);
    const pathFound = await findPath(currentPath.id, pathToGo, userId);
    return !!pathFound;
}