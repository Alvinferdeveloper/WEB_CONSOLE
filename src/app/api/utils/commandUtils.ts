import db from "@/app/libs/db";
export async function findRoute(currentDirectoryId: number, pathToGo: string, userId: number) {
    const splitedRoute = pathToGo.split('/');
    let routeFoundId;
    if (pathToGo.startsWith('/')) {
        const nextPath = await db.directory.findFirst({ where: { userId, absolutePath: pathToGo } });
        if (nextPath) {
            routeFoundId = nextPath?.id;
            return routeFoundId;
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
    return routeFoundId;
}