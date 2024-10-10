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
    const newDirectoryExists = await db.directory.findFirst({ where: { name:commandElements.commandParams[0]}});
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
    const isDirectoryOwnedByUser = await db.directory.findFirst({ where:{ id:currentPath.id,  userId}})
    if(!isDirectoryOwnedByUser)  return { output:{
        list:['Error: You are not the owner of this directory']
    }}
    const isCurrentPathRoot = isDirectoryOwnedByUser.absolutePath == '/';
    const fileAbsolutePath = isDirectoryOwnedByUser.absolutePath.concat(`${isCurrentPathRoot ? '' : '/'}${commandElements.commandParams[0]}`);
    await db.file.create({data:{ name: commandElements.commandParams[0], directoryId:currentPath.id, userId, absolutePath:fileAbsolutePath}})

}



