import db from "@/app/libs/db"
import { findPathToGo, findPath } from "../utils/commandUtils";

interface Params {
    userId:number,
    commandElements:  { commandName: string, commandFlags: string[], commandParams: string[]},
    currentPath:{id:number, absolutePath:string} 
}

export async function Mkdir({userId, commandElements, currentPath}: Params) {
    const { pathToGo, resourceName} = findPathToGo(commandElements.commandParams[0])
    const pathFound = await findPath(currentPath.id, pathToGo, userId );
    if(!pathFound) return {
        error: 'Directory not found',
        outputList:['Directory not found']
    }
    const isCurrentPathRoot = pathFound.absolutePath == '/';
    const directoryAbsolutePath = pathFound.absolutePath.concat(`${isCurrentPathRoot ? '' : '/'}${resourceName}`);
    const newDirectoryExists = await db.directory.findFirst({ where: { name:resourceName, parentId:pathFound.id}});
    if(newDirectoryExists) return { list: [ 'Error: Este directorio ya existe']}
    await db.directory.create({data:{ name:resourceName, parentId:pathFound.id, userId, absolutePath:directoryAbsolutePath }})
}


export async function Ls({ userId, currentPath, commandElements }:Params){
    let directoryToListId = currentPath.id;
    if(commandElements.commandParams[0]){
        const routeFound = await findPath(directoryToListId, commandElements.commandParams[0], userId);
        directoryToListId = routeFound ? routeFound.id : directoryToListId;
    }
   
    const directoriesDoc = await db.directory.findMany({where:{ userId, parentId: directoryToListId}})
    const filesDoc = await db.file.findMany({where:{ userId, directoryId: directoryToListId}});
    const directories = directoriesDoc.map(({id, name}) => ({id, name, type:'DIRECTORY'}));
    const files = filesDoc.map(({id ,name}) => ({id, name, type:'FILE'}));
    return [...directories, ...files]
}

export async function Cd({userId, commandElements, currentPath}:Params){
    const newPathToGo = commandElements.commandParams[0];
    const newPathFound = await findPath(currentPath.id, newPathToGo, userId);
    if(!newPathFound) return {
        error: 'Directory not found',
        outputList:['Directory not found']
    }
    const newPath = await db.directory.findFirst({ where:{ id: newPathFound.id }})
    return {
        id:newPath?.id,
        newPath:newPath?.absolutePath
    }
}


export async function Touch({ userId, commandElements, currentPath}:Params){
    const { pathToGo,  resourceName } = findPathToGo(commandElements.commandParams[0]);
    const pathFound = await findPath(currentPath.id, pathToGo, userId );
    if(!pathFound) return {
        error: 'Directory not found',
        outputList:['Directory not found']
    }
    const isCurrentPathRoot = pathFound.absolutePath == '/';
    const fileAbsolutePath = pathFound.absolutePath.concat(`${isCurrentPathRoot ? '' : '/'}${resourceName}`);
    const newFileExist = await db.file.findFirst({ where: { name:resourceName, directoryId:pathFound.id}});
    if(newFileExist) return  { list: [ 'Error: Este archivo ya existe']}
    await db.file.create({data:{ name: resourceName, directoryId:pathFound.id, userId, absolutePath:fileAbsolutePath}})

}


export async function Rm({ userId, commandElements, currentPath}:Params){
   const { pathToGo, resourceName } = findPathToGo(commandElements.commandParams[0])
    const pathFound = await findPath(currentPath.id, pathToGo, userId );
    if(!pathFound) return {
        error: 'Directory not found',
        outputList:['Directory not found']
    }
    const fileToDelete = await db.file.findFirst({ where: { name: resourceName, directoryId: pathFound.id}});
    if(!fileToDelete) return { list: [ 'Error: No se encontro el archivo a eliminar']};
    await db.file.delete({ where: { id: fileToDelete?.id}});

}

export async function Rmdir({commandElements, currentPath}:Params){
    const dirToDelete =  await db.directory.findFirst({ where: { name: commandElements.commandParams[0], parentId: currentPath.id}});
    if(!dirToDelete) return { list: [ 'Error: No se encontro el directorio a eliminar']};
    await db.directory.delete({ where: { id: dirToDelete?.id}});
}


