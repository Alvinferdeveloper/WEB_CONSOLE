import db from "@/app/libs/db"
import { ApiError } from "../utils/ApiError";
import { findRoute } from "../utils/commandUtils";

interface Params {
    userId:number,
    commandElements:  { commandName: string, commandFlags: string[], commandParams: string[]},
    currentPath:{id:number, absolutePath:string} 
}

export async function Mkdir({userId, commandElements, currentPath}: Params) {
    const currentDirectory = await db.directory.findFirst({ where:{ id:currentPath.id,  userId}});
    if(!currentDirectory) throw new ApiError(404, 'Resource not found');
    const isCurrentPathRoot = currentDirectory.absolutePath == '/';
    const directoryAbsolutePath = currentDirectory.absolutePath.concat(`${isCurrentPathRoot ? '' : '/'}${commandElements.commandParams[0]}`);
    const newDirectoryExists = await db.directory.findFirst({ where: { name:commandElements.commandParams[0], parentId:currentPath.id}});
    if(newDirectoryExists) return { list: [ 'Error: Este directorio ya existe']}
    await db.directory.create({data:{ name: commandElements.commandParams[0], parentId:currentPath.id, userId, absolutePath:directoryAbsolutePath }})
}


export async function Ls({ userId, currentPath, commandElements }:Params){
    let newPathResponse ;
    if(commandElements.commandParams[0]){
        newPathResponse = await Cd({ userId, commandElements, currentPath});
        if(!newPathResponse.id){
            return newPathResponse;
        }
    }
   
    const directoriesDoc = await db.directory.findMany({where:{ userId, parentId: newPathResponse?.id || currentPath.id}})
    const filesDoc = await db.file.findMany({where:{ userId, directoryId: newPathResponse?.id || currentPath.id}});
    const directories = directoriesDoc.map(({id, name}) => ({id, name, type:'DIRECTORY'}));
    const files = filesDoc.map(({id ,name}) => ({id, name, type:'FILE'}));
    return [...directories, ...files]
}

export async function Cd({userId, commandElements, currentPath}:Params){
    const newPathToGo = commandElements.commandParams[0];
    const newPathFound = await findRoute(currentPath.id, newPathToGo, userId);
    if(!newPathFound) return {
        error: 'Directory not found',
        outputList:['Directory not found']
    }
    const newPath = await db.directory.findFirst({ where:{ id: newPathFound }})
    
    return {
        id:newPath?.id,
        newPath:newPath?.absolutePath
    }
}


export async function Touch({ userId, commandElements, currentPath}:Params){
    const currentDirectory = await db.directory.findFirst({ where:{ id:currentPath.id,  userId}})
    if(!currentDirectory) throw new ApiError(404, 'Resource not found');
    const isCurrentPathRoot = currentDirectory.absolutePath == '/';
    const fileAbsolutePath = currentDirectory.absolutePath.concat(`${isCurrentPathRoot ? '' : '/'}${commandElements.commandParams[0]}`);
    const newFileExist = await db.file.findFirst({ where: { name:commandElements.commandParams[0], directoryId:currentPath.id}});
    if(newFileExist) return  { list: [ 'Error: Este archivo ya existe']}
    await db.file.create({data:{ name: commandElements.commandParams[0], directoryId:currentPath.id, userId, absolutePath:fileAbsolutePath}})

}


export async function Rm({ userId, commandElements, currentPath}:Params){
    const fileToDelete = await db.file.findFirst({ where: { name: commandElements.commandParams[0], directoryId: currentPath.id}});
    if(!fileToDelete) return { list: [ 'Error: No se encontro el archivo a eliminar']};
    await db.file.delete({ where: { id: fileToDelete?.id}});

}

export async function Rmdir({commandElements, currentPath}:Params){
    const dirToDelete =  await db.directory.findFirst({ where: { name: commandElements.commandParams[0], parentId: currentPath.id}});
    if(!dirToDelete) return { list: [ 'Error: No se encontro el directorio a eliminar']};
    await db.directory.delete({ where: { id: dirToDelete?.id}});
}


