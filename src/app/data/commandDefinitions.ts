import { Ls } from "../components/outputs/Ls"
import { clear, cd} from "../services/commandActions";
import { BasicOutPut } from "../types/command"

type commandDefinition = {
    commandName: string,
    miniumExpectedParams:number,
    availableFlags:string[],
    component?: (output:any) => JSX.Element,
    accionNeeded?: ({ commandName, commandFlags, commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }, currentPath:{id:number, absolutePath:string})=>Promise<BasicOutPut | void>;
}

export const remoteCommandsAvailable : Record<string, commandDefinition> = {
    LS : {
        commandName: "ls",
        miniumExpectedParams: 0,
        availableFlags:['a','b'],
        component:Ls,
    },

    MKDIR:{
        commandName: "mkdir",
        miniumExpectedParams: 1,
        availableFlags:[],
    },

    CD:{
        commandName:'cd',
        miniumExpectedParams:1,
        availableFlags:[],
        accionNeeded:cd
    },

    TOUCH:{
        commandName:'touch',
        miniumExpectedParams:1,
        availableFlags:[],
    }
}

export const  localCommandsAvailable:Record<string, commandDefinition> =  {
    HELP : {
            commandName: "help",
            miniumExpectedParams: 1,
            availableFlags:['a','b'],
    },
    CLEAR: {
        commandName:"clear",
        miniumExpectedParams:0,
        availableFlags:[],
        accionNeeded: clear,
    }
}

export const commandDefinitions = [
    ...Object.values(remoteCommandsAvailable),
    ...Object.values(localCommandsAvailable)
]