import db from "@/app/libs/db"

export async function Mkdir(userId: number, { commandName, commandFlags, commandParams, path }: { commandName: string, commandFlags: string[], commandParams: string[], path:{id:number, absolutePath:string} }) {
    const isDirectoryOwnedByUser = await db.directory.findFirst({ where:{ id:path.id,  userId}})
    if(!isDirectoryOwnedByUser)  return { output:{
        list:['not ownes']
    }}
    const directoryAbsolutePath = isDirectoryOwnedByUser.absolutePath.concat(`${commandParams[0]}/`);
    await db.directory.create({data:{ name: commandParams[0], parentId:path.id, userId, absolutePath:directoryAbsolutePath }})
}


export async function Ls(userId:number){
    const directoriesDoc = await db.directory.findMany({where:{ userId}})
    const filesDoc = await db.file.findMany({where:{ userId}});
    const directories = directoriesDoc.map(({id, name}) => ({id, name, type:'DIRECTORY'}));
    const files = filesDoc.map(({id ,name}) => ({id, name, type:'FILE'}));
    
    return [...directories, ...files]
}

export async function Cd(){
    return {
        id:10,
        newPath:"Glory to god"
    }
}


export async function Touch(userId: number, { commandName, commandFlags, commandParams, path }: { commandName: string, commandFlags: string[], commandParams: string[], path:{id:number, absolutePath:string} }){
    const isDirectoryOwnedByUser = await db.directory.findFirst({ where:{ id:path.id,  userId}})
    if(!isDirectoryOwnedByUser)  return { output:{
        list:['not ownes']
    }}

    const fileAbsolutePath = isDirectoryOwnedByUser.absolutePath.concat(`${commandParams[0]}`);
    await db.file.create({data:{ name: commandParams[0], directoryId:path.id, userId, absolutePath:fileAbsolutePath}})

}



