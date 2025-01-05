import { CommandPromptOutput } from "../types/command";
import BasicOutput from "../components/outputs/BasicOutput";
import { commandDefinitions, localCommandsAvailable, remoteCommandsAvailable } from "../data/commandDefinitions";


export  const  executeActionCommand = async ({ commandName, commandFlags, commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }, time:string, userName:string, currentPath:{id:number, absolutePath:string} ):Promise<CommandPromptOutput | void>=>{
    const commandAction = commandDefinitions.find(command => command.commandName === commandName);
    if(commandAction?.accionNeeded) {
         const output = await commandAction.accionNeeded({ commandName, commandFlags, commandParams},currentPath);
         if( !output ) return undefined;
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

export const executeLocalCommand = ({ commandName, commandFlags, commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }, time: string, userName: string, currentPath:{id:number, absolutePath:string}) :CommandPromptOutput | void => {
    const localCommand = commandDefinitions.find(command => command.commandName === commandName);
    if(localCommand?.execute){
        const output = localCommand.execute({ commandName, commandFlags, commandParams},currentPath);
        return {
            input: commandName,
            output,
            userName,
            absolutePath: currentPath.absolutePath,
            time,
            component: localCommand.component || BasicOutput,
        }
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
        output: commandOutput.error ? {
            list: commandOutput.outputList
        }: commandOutput,
        time,
        component: !commandOutput.error && componentToRender ? componentToRender : BasicOutput ,
    }


}



