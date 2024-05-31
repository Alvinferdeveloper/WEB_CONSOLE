
export enum remoteCommandsAvailable {
    LS = "ls",
    MV = "mv",
    CP = "cp",
    MKDIR = "mkdir",
}


export enum localCommandsAvailable {
    HELP = "help",
}


// Interfaz para definir el número de parámetros esperados para cada comando
interface CommandBody {
    command: remoteCommandsAvailable | localCommandsAvailable;
    expectedParams:  number;
    isLocal?: boolean;
}

// Objeto que mapea cada comando con el número de parámetros esperados
export const commandDefinitions: CommandBody[] = [
 {command: remoteCommandsAvailable.LS, expectedParams:0},
 {command: remoteCommandsAvailable.CP, expectedParams:2},
 {command: remoteCommandsAvailable.MKDIR, expectedParams:1},
 {command: remoteCommandsAvailable.MV, expectedParams:2},
 {command: localCommandsAvailable.HELP, expectedParams:0, isLocal:true},
];

export type OutPut = {
    header?:string,
    list?:string[]
}
export type Command = {
    userName: string,
    time:string,
    input:string,
    output?:OutPut,
    notValid?: boolean,
    component?: ({output}:{output:OutPut | undefined}) => JSX.Element;
}

export type Commands = Command[];

export type User = {
    id:number,
    name:string,
}
