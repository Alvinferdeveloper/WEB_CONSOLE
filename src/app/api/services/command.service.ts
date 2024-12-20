import db from "@/app/libs/db"
import { findPathToGo, findPath, getTypeOfFile, findFile } from "../utils/commandUtils";
import { TYPE_OF_FILES } from "../constants";

interface Params {
    userId: number,
    commandElements: { commandName: string, commandFlags: string[], commandParams: string[] },
    currentPath: { id: number, absolutePath: string }
}

export async function Mkdir({ userId, commandElements, currentPath }: Params) {
    const { pathToGo, resourceName } = findPathToGo(commandElements.commandParams[0])
    const pathFound = await findPath(currentPath.id, pathToGo, userId);
    if (!pathFound) return {
        error: 'Directory not found',
        outputList: ['Directory not found']
    }
    const isCurrentPathRoot = pathFound.absolutePath == '/';
    const directoryAbsolutePath = pathFound.absolutePath.concat(`${isCurrentPathRoot ? '' : '/'}${resourceName}`);
    const newDirectoryExists = await db.directory.findFirst({ where: { name: resourceName, parentId: pathFound.id } });
    if (newDirectoryExists) return { list: ['Error: Este directorio ya existe'] }
    await db.directory.create({ data: { name: resourceName, parentId: pathFound.id, userId, absolutePath: directoryAbsolutePath } })
}


export async function Ls({ userId, currentPath, commandElements }: Params) {
    let directoryToListId = currentPath.id;
    if (commandElements.commandParams[0]) {
        const routeFound = await findPath(directoryToListId, commandElements.commandParams[0], userId);
        directoryToListId = routeFound ? routeFound.id : directoryToListId;
    }

    const directoriesDoc = await db.directory.findMany({ where: { userId, parentId: directoryToListId } })
    const filesDoc = await db.file.findMany({ where: { userId, directoryId: directoryToListId } });
    const directories = directoriesDoc.map(({ id, name }) => ({ id, name, type: 'DIRECTORY' }));
    const files = filesDoc.map(({ id, name }) => ({ id, name, type: 'FILE' }));
    return [...directories, ...files]
}

export async function Cd({ userId, commandElements, currentPath }: Params) {
    const newPathToGo = commandElements.commandParams[0];
    const newPathFound = await findPath(currentPath.id, newPathToGo, userId);
    if (!newPathFound) return {
        error: 'Directory not found',
        outputList: ['Directory not found']
    }
    const newPath = await db.directory.findFirst({ where: { id: newPathFound.id } })
    return {
        id: newPath?.id,
        newPath: newPath?.absolutePath
    }
}


export async function Touch({ userId, commandElements, currentPath }: Params) {
    const { pathToGo, resourceName } = findPathToGo(commandElements.commandParams[0]);
    const pathFound = await findPath(currentPath.id, pathToGo, userId);
    if (!pathFound) return {
        error: 'Directory not found',
        outputList: ['Directory not found']
    }
    const isCurrentPathRoot = pathFound.absolutePath == '/';
    const fileAbsolutePath = pathFound.absolutePath.concat(`${isCurrentPathRoot ? '' : '/'}${resourceName}`);
    const newFileExist = await db.file.findFirst({ where: { name: resourceName, directoryId: pathFound.id } });
    if (newFileExist) return { list: ['Error: Este archivo ya existe'] }
    await db.file.create({ data: { name: resourceName, directoryId: pathFound.id, userId, absolutePath: fileAbsolutePath } })

}


export async function Rm({ userId, commandElements, currentPath }: Params) {
    const { pathToGo, resourceName } = findPathToGo(commandElements.commandParams[0])
    const pathFound = await findPath(currentPath.id, pathToGo, userId);
    if (!pathFound) return {
        error: 'Directory not found',
        outputList: ['Directory not found']
    }
    const fileToDelete = await db.file.findFirst({ where: { name: resourceName, directoryId: pathFound.id } });
    if (!fileToDelete) return { list: ['Error: No se encontro el archivo a eliminar'] };
    await db.file.delete({ where: { id: fileToDelete?.id } });

}

export async function Rmdir({ userId, commandElements, currentPath }: Params) {
    const { pathToGo, resourceName } = findPathToGo(commandElements.commandParams[0])
    const pathFound = await findPath(currentPath.id, pathToGo, userId);
    if (!pathFound) return {
        error: 'Directory not found',
        outputList: ['Directory not found']
    }
    const dirToDelete = await db.directory.findFirst({ where: { name: resourceName, parentId: pathFound.id, userId } });
    if (!dirToDelete) return { list: ['Error: No se encontro el directorio a eliminar'] };
    await db.directory.delete({ where: { id: dirToDelete?.id } });
}

export async function Mv({ userId, commandElements, currentPath }: Params) {
    const resources = commandElements.commandParams;
    let { pathToGo: pathToMove, resourceName: fileToMoveName } = findPathToGo(resources[0]);
    let { pathToGo: pathToPaste, resourceName: targetFileName } = findPathToGo(resources[1]);
    pathToPaste = targetFileName == ".." ? ".." : pathToPaste
    const pathToMoveFound = await findPath(currentPath.id, pathToMove, userId);
    const pathToPasteFound = await findPath(currentPath.id, pathToPaste, userId);
    const fileToMove = await findFile(pathToMoveFound?.id || -1, fileToMoveName);
    if (pathToMoveFound && pathToPasteFound && fileToMove) {
        let targetDirectory = await db.directory.findFirst({ where: { name: targetFileName, parentId: pathToPasteFound?.id } });
        const typeOfFile = await getTypeOfFile(pathToMoveFound.id, fileToMoveName);
        fileToMoveName = targetDirectory || targetFileName == "." || targetFileName == ".." ? fileToMoveName : targetFileName;
        targetDirectory = targetDirectory ? targetDirectory : pathToPasteFound;
        const isCurrentPathRoot = targetDirectory.absolutePath == '/';
        const newAbsolutePath = targetDirectory.absolutePath.concat(`${isCurrentPathRoot ? '' : '/'}${fileToMoveName}`);
        if (typeOfFile == TYPE_OF_FILES.DIRECTORY) {
            await db.directory.update({ where: { id: fileToMove.id }, data: { name: fileToMoveName, parentId: targetDirectory.id, absolutePath: newAbsolutePath } });
        }
        else if (typeOfFile == TYPE_OF_FILES.REGULAR_FILE) {
            await db.file.update({ where: { id: fileToMove.id }, data: { name: fileToMoveName, directoryId: targetDirectory.id, absolutePath: newAbsolutePath } })
        }
    }

}
