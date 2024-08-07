import { localComponentaData } from "../data/localCommandData";
import { CommandPromptOutput, LsOutPut } from "../types/command";
import BasicOutput from "../components/outputs/BasicOutput";
import { commandDefinitions, localCommandsAvailable, remoteCommandsAvailable } from "../data/commandDefinitions";
import { comma } from "postcss/lib/list";

export  const  executeActionCommand = async ({ commandName, commandFlags, commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }, time:string, userName:string, currentPath:{id:number, absolutePath:string} ):Promise<CommandPromptOutput | void>=>{
    const commandAction = commandDefinitions.find(command => command.commandName === commandName);
    if(commandAction?.accionNeeded) {
         const output = await commandAction.accionNeeded({ commandName, commandFlags, commandParams},currentPath);
         if( commandName == 'clear') return undefined;
         return {
            input: commandName,
            output,
            userName,
            absolutePath:currentPath.absolutePath,
            time,
            component: BasicOutput,
        }
    
    }

}

export const executeLocalCommand = (commandName: string, time: string, userName: string, absolutePath:string): CommandPromptOutput => {
    const commandType = commandName.toUpperCase() as keyof typeof localComponentaData;
    const command = localComponentaData[commandType];
    const componentToRender = localCommandsAvailable[commandName as keyof typeof remoteCommandsAvailable].component;
    return {
        input: commandName,
        output: command.output,
        userName,
        absolutePath,
        time,
        component: componentToRender || BasicOutput,
    }
}


export const executeRemoteCommand = async ({ commandName, commandFlags, commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }, time: string, userName: string, currentPath:{id:number,absolutePath:string }): Promise<CommandPromptOutput> => {
    const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commandName, commandFlags, commandParams,currentPath })
    })

    const commandOutput = await res.json();
    const componentToRender = remoteCommandsAvailable[commandName.toUpperCase() as keyof typeof remoteCommandsAvailable].component;
    return {
        userName,
        input: commandName,
        absolutePath: currentPath.absolutePath,
        output: commandOutput,
        time,
        component:componentToRender || BasicOutput,
    }


}



