import { localComponentaData } from "../data/localCommandData";
import { CommandOutput } from "../types/command";

export const executeLocalCommand = (commandValue:string, time:string, userName:string):CommandOutput => {
    const commandType = commandValue.toUpperCase() as keyof typeof localComponentaData;
    const command = localComponentaData[commandType];
    return {
        input:commandValue.toLowerCase(),
        output:command.output,
        userName,
        time,
        component: command.component,
    }
}

export const executeRemoteCommand = (commandValue: string, time:string, userName:string):void => {
    
}



