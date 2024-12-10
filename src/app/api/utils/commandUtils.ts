import db from "@/app/libs/db";
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