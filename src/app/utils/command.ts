import { Command, commandDefinitions, localCommandsAvailable} from "../types/command";
import { localComponentaData } from "./commandData";

export const isCommandValid = (commandValue: string, commandParams:string[])=>{
    return commandDefinitions.find(command => commandValue ==  command.command && commandParams.length == command.expectedParams
     ) 
}

export const isCommandLocal = (commandValue:string) => {
    return commandDefinitions.find(command => commandValue == command.command && command.isLocal)
}

export const isCommandRemote = (commandValue:string) => {
    return commandDefinitions.find(command => commandValue == command.command && !command.isLocal);
}

export const isCommandClear = (commandValue:string) => {
    return commandValue == "clear";
}
export const executeLocalCommand = (commandValue:keyof typeof localCommandsAvailable, time:string, userName:string):Command => {
    const tipo = localComponentaData[commandValue];
    return {
        input:commandValue.toLowerCase(),
        output:tipo.output,
        userName,
        time,
        component: tipo.component,
    }
}