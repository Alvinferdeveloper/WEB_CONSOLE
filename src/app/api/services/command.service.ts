import db from "@/app/libs/db"
import { findPathToGo, findPath, getTypeOfFile, findFile } from "../utils/commandUtils";
import { TYPE_OF_FILES } from "../constants";
import { createFile } from "./file.service";

export interface commandExecutionParams {
    userId: number,
    commandElements: { commandName: string, commandFlags: string[], commandParams: string[] },
    currentPath: { id: number, absolutePath: string }
}

export async function Mkdir({ userId, commandElements, currentPath }: commandExecutionParams) {
    for (let commandName of commandElements.commandParams) {
        const { pathToGo, resourceName } = findPathToGo(commandName)
        const pathFound = await findPath(currentPath.id, pathToGo, userId);
        if (!pathFound) return {
            error: 'No such file or directory',
            outputList: ['mkdir: cannot create directory: No such file or directory']
        }
        const isCurrentPathRoot = pathFound.absolutePath == '/';
        const directoryAbsolutePath = pathFound.absolutePath.concat(`${isCurrentPathRoot ? '' : '/'}${resourceName}`);
        const newDirectoryExists = await db.directory.findFirst({ where: { name: resourceName, parentId: pathFound.id, userId } });
        if (newDirectoryExists) return { list: [`mkdir: cannot create directory '${commandName}': File exists`] }
        await db.directory.create({ data: { name: resourceName, parentId: pathFound.id, userId, absolutePath: directoryAbsolutePath } })
    }
}


export async function Ls({ userId, currentPath, commandElements }: commandExecutionParams) {
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

export async function Cd({ userId, commandElements, currentPath }: commandExecutionParams) {
    if (commandElements.commandParams.length > 1) {
        return {
            error: 'Too many arguments',
            outputList: ['cd: too many arguments']
        }
    }
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


export async function Touch({ userId, commandElements, currentPath }: commandExecutionParams) {
    const file = await createFile(userId, commandElements.commandParams[0], currentPath);
    if (!file.fileId) return {
        error: 'Directory not found',
        outputList: ['Directory not found']
    }
    if (file.exists) return { list: ['touch: cannot create file ' + commandElements.commandParams[0] + ': File exists'] }
}


export async function Rm({ userId, commandElements, currentPath }: commandExecutionParams) {
    const { pathToGo, resourceName } = findPathToGo(commandElements.commandParams[0])
    const pathFound = await findPath(currentPath.id, pathToGo, userId);
    if (!pathFound) return {
        error: 'Directory not found',
        outputList: ['Directory not found']
    }
    const fileToDelete = await db.file.findFirst({ where: { name: resourceName, directoryId: pathFound.id } });
    if (!fileToDelete) return { list: ['rm: cannot remove ' + commandElements.commandParams[0] + ': No such file or directory'] };
    await db.file.delete({ where: { id: fileToDelete?.id } });

}

export async function Rmdir({ userId, commandElements, currentPath }: commandExecutionParams) {
    const { pathToGo, resourceName } = findPathToGo(commandElements.commandParams[0])
    const pathFound = await findPath(currentPath.id, pathToGo, userId);
    if (!pathFound) return {
        error: 'Directory not found',
        outputList: ['Directory not found']
    }
    const dirToDelete = await db.directory.findFirst({ where: { name: resourceName, parentId: pathFound.id, userId } });
    if (!dirToDelete) return { list: ['rmdir: failed to remove ' + commandElements.commandParams[0] + ': No such file or directory'] };
    await db.directory.delete({ where: { id: dirToDelete?.id } });
}

export async function Mv({ userId, commandElements, currentPath }: commandExecutionParams) {
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
        let resourceToMoveExist = null;
        if (typeOfFile == TYPE_OF_FILES.DIRECTORY) {
            resourceToMoveExist = await db.directory.findFirst({ where: { name: fileToMoveName, parentId: targetDirectory.id } });
            !resourceToMoveExist && await db.directory.update({ where: { id: fileToMove.id }, data: { name: fileToMoveName, parentId: targetDirectory.id, absolutePath: newAbsolutePath } });
        }
        else if (typeOfFile == TYPE_OF_FILES.REGULAR_FILE) {
            resourceToMoveExist = await db.file.findFirst({ where: { name: fileToMove.name, directoryId: targetDirectory.id } });
            !resourceToMoveExist && await db.file.update({ where: { id: fileToMove.id }, data: { name: fileToMoveName, directoryId: targetDirectory.id, absolutePath: newAbsolutePath } });
        }
        if (resourceToMoveExist) {
            return {
                error: 'File exists',
                outputList: ['This file already exists in the current directory']
            }
        }
    } else {
        return {
            error: 'some path does not exist',
            outputList: ['Some of the path specified is invalid']
        }
    }

}

export async function Cp({ userId, commandElements, currentPath }: commandExecutionParams) {
    const resources = commandElements.commandParams;
    const copyFrom = resources[0];
    let copyTo = resources[1];
    let { pathToGo: pathToCopy, resourceName: fileToCopyName } = findPathToGo(copyFrom);
    const pathToCopyFromFound = await findPath(currentPath.id, pathToCopy, userId);
    const pathCopyToFound = await findPath(currentPath.id, copyTo, userId);
    const fileToCopy = await findFile(pathToCopyFromFound?.id || 0, fileToCopyName)
    if (pathToCopyFromFound && pathCopyToFound && fileToCopy) {
        const typeOfFile = await getTypeOfFile(pathToCopyFromFound.id, fileToCopyName);
        const isCurrentPathRoot = pathCopyToFound.absolutePath == '/';
        const newAbsolutePath = pathCopyToFound.absolutePath.concat(`${isCurrentPathRoot ? '' : '/'}${fileToCopyName}`);
        const resourceToMoveExists = await findFile(pathCopyToFound.id, fileToCopyName);
        if (typeOfFile == TYPE_OF_FILES.DIRECTORY) {
            !resourceToMoveExists && await db.directory.create({ data: { ...fileToCopy, parentId: pathCopyToFound.id, absolutePath: newAbsolutePath, id: undefined } });
        }
        else if (typeOfFile == TYPE_OF_FILES.REGULAR_FILE) {
            !resourceToMoveExists && await db.file.create({ data: { ...fileToCopy, absolutePath: newAbsolutePath, directoryId: pathCopyToFound.id, id: undefined } })
        }
        if (resourceToMoveExists) {
            return {
                error: 'File exists',
                outputList: ['This file already exists in the current directory']
            }
        }
    } else {
        return {
            error: 'some path does not exist',
            outputList: ['Some of the path specified is invalid']
        }
    }
}

export async function Cat({ userId, commandElements, currentPath }: commandExecutionParams) {
    const { pathToGo, resourceName } = findPathToGo(commandElements.commandParams[0])
    const pathFound = await findPath(currentPath.id, pathToGo, userId);
    if (!pathFound) return {
        error: 'File not found',
        outputList: ['Cannot find path ' + commandElements.commandParams[0] + ' because it does not exist']
    }
    const fileToRead = await db.file.findFirst({ where: { name: resourceName, directoryId: pathFound.id } });
    if (!fileToRead) return { list: ['cat: ' + commandElements.commandParams[0] + ': No such file or directory'] };
    return { list: [fileToRead.content] };
}

export async function Head({ userId, commandElements, currentPath }: commandExecutionParams) {
    const { pathToGo, resourceName } = findPathToGo(commandElements.commandParams[0])
    const pathFound = await findPath(currentPath.id, pathToGo, userId);
    if (!pathFound) return {
        error: 'File not found',
        outputList: ['Cannot find path ' + commandElements.commandParams[0] + ' because it does not exist']
    }
    const fileToRead = await db.file.findFirst({ where: { name: resourceName, directoryId: pathFound.id, userId } });
    if (!fileToRead) return { list: ['head: cannot open \'' + commandElements.commandParams[0] + '\' for reading: No such file or directory'] };

    const lines = fileToRead.content.split('\n').slice(0, 10);
    return { list: lines };
}

export async function Tail({ userId, commandElements, currentPath }: commandExecutionParams) {
    const { pathToGo, resourceName } = findPathToGo(commandElements.commandParams[0])
    const pathFound = await findPath(currentPath.id, pathToGo, userId);
    if (!pathFound) return {
        error: 'File not found',
        outputList: ['Cannot find path ' + commandElements.commandParams[0] + ' because it does not exist']
    }
    const fileToRead = await db.file.findFirst({ where: { name: resourceName, directoryId: pathFound.id, userId } });
    if (!fileToRead) return { list: ['tail: cannot open \'' + commandElements.commandParams[0] + '\' for reading: No such file or directory'] };

    const lines = fileToRead.content.split('\n').slice(-10);
    return { list: lines };
}