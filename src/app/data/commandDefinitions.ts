import { Ls } from "../components/outputs/Ls"
import { OutPut } from "../types/command"

type commandDefinition = {
    commandName: string,
    miniumExpectedParams:number,
    availableFlags:string[],
    component?: ({output}:{output:OutPut | undefined}) => JSX.Element;
}

export const remoteCommandsAvailable : Record<string, commandDefinition> = {
    LS : {
        commandName: "ls",
        miniumExpectedParams: 0,
        availableFlags:['a','b'],
        component:Ls
    },

    MKDIR:{
        commandName: "mkdir",
        miniumExpectedParams: 1,
        availableFlags:[],
    }
}

export const  localCommandsAvailable:Record<string, commandDefinition> =  {
    HELP : {
            commandName: "help",
            miniumExpectedParams: 1,
            availableFlags:['a','b']
    }
}

export const commandDefinitions = [
    ...Object.values(remoteCommandsAvailable),
    ...Object.values(localCommandsAvailable)
]