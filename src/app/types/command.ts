
type Command = {
    commandName: string;
    availableFlags: string[],
    miniumExpectecParams:number
}
export const remoteCommandsAvailable :Record<string, Command> = {
    LS : {
        commandName: "ls",
        miniumExpectecParams: 1,
        availableFlags:['a','b']
    },
}

export const  localCommandsAvailable:Record<string,Command>  ={
    HELP : {
            commandName: "help",
            miniumExpectecParams: 1,
            availableFlags:['a','b']
    }
}

export const commandDefinitions = [
    ...Object.values(remoteCommandsAvailable),
    ...Object.values(localCommandsAvailable)
]


export type OutPut = {
    header?:string,
    list?:string[]
}
export type CommandOutput = {
    userName: string,
    time:string,
    input:string,
    output?:OutPut,
    notValid?: boolean,
    component?: ({output}:{output:OutPut | undefined}) => JSX.Element;
}

export type CommandsOutput = CommandOutput[];

export type User = {
    id:number,
    name:string,
}
