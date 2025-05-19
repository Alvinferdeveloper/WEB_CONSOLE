import db from "@/app/libs/db";
import { TYPE_OF_FILES } from "../constants";
export async function findPath(currentDirectoryId: number, pathToGo: string, userId: number) {
    const splitedRoute = pathToGo.split('/');
    let routeFoundId;
    if (pathToGo.startsWith('/')) {
        const nextPath = await db.directory.findFirst({ where: { userId, absolutePath: pathToGo } });
        if (nextPath) {
            routeFoundId = nextPath?.id;
            return db.directory.findFirst({ where:{ id: routeFoundId}});
        }
    }
    for (let route of splitedRoute) {

        if (route == '..') {
            const currentPath = await db.directory.findFirst({ where: { id: currentDirectoryId, userId } });
            if (currentPath && currentPath.parentId ) {
                currentDirectoryId = currentPath?.parentId;
            }
            routeFoundId = currentPath?.parentId;
            
        }
        else if (route == ".") {
            routeFoundId = currentDirectoryId;
        }
        else {
            const nextPath = await db.directory.findFirst({ where: { parentId: currentDirectoryId, name: route, userId } });
            if (nextPath) {
                routeFoundId = nextPath?.id
                currentDirectoryId = nextPath?.id;
            }
            else {
                return null;
            }

        }
    }
    if(routeFoundId ){
        return await db.directory.findFirst({ where: { id: routeFoundId}})
    }
    return null;
}

export function divideRouteInChunks(route: string[]){
    const routeWithNoResource = route.slice(0,-1).join('/');
    const resourceName = route.pop() || '';
    return {
        routeWithNoResource,
        resourceName
    }

}

export function findPathToGo(fullRoute: string){
    const splitRoute = fullRoute.split("/");
    const { routeWithNoResource, resourceName} = divideRouteInChunks([...splitRoute]);
    let pathToGo = splitRoute.length == 1 ? '.' : routeWithNoResource;
    if(fullRoute.startsWith("/")) pathToGo = '/';
    return { pathToGo,  resourceName }
}

export async function getTypeOfFile(pathId: number, fileName: string){
    const isDirectory = await db.directory.findFirst({ where: { name: fileName, parentId: pathId}});
    return isDirectory ? TYPE_OF_FILES.DIRECTORY : TYPE_OF_FILES.REGULAR_FILE;
}

export  async function findFile(pathId: number, fileName: string){
    const file =  await db.file.findFirst({ where: { name: fileName, directoryId: pathId}});
    if(file) return file;
    const directory = await  db.directory.findFirst({ where: { name: fileName, parentId: pathId}});
    return directory || false;
    


}