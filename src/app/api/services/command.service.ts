import db from "@/app/libs/db"
import { ApiError } from "../utils/ApiError";

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


export async function Ls({ userId, currentPath }:Params){
    const directoriesDoc = await db.directory.findMany({where:{ userId, parentId: currentPath.id}})
    const filesDoc = await db.file.findMany({where:{ userId, directoryId: currentPath.id}});
    const directories = directoriesDoc.map(({id, name}) => ({id, name, type:'DIRECTORY'}));
    const files = filesDoc.map(({id ,name}) => ({id, name, type:'FILE'}));
    return [...directories, ...files]
}

export async function Cd({userId, commandElements, currentPath}:Params){
    const newPathToGo = commandElements.commandParams[0];
    let newPath ;
    if(newPathToGo.startsWith('/'))
        newPath = await db.directory.findFirst({where:{ userId, absolutePath: newPathToGo}})
    else if(newPathToGo == '..'){
        const currentDirectory = await db.directory.findFirst({where:{ userId ,id: currentPath.id}});
        if(currentDirectory?.parentId)
        newPath = await db.directory.findFirst({where:{ userId, id:currentDirectory?.parentId}});
    }
    else if(newPathToGo == '.'){
        newPath = await db.directory.findFirst({where:{ userId ,id: currentPath.id}});
    }
    else 
        newPath = await db.directory.findFirst({where:{userId, name: newPathToGo, parentId: currentPath.id}});

        if(!newPath) return {
            error: 'Directory not found',
            outputList:['Directory not found']
        }
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


