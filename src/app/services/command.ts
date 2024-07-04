import { localComponentaData } from "../data/localCommandData";
import { CommandPromptOutput } from "../types/command";
import BasicOutput from "../components/outputs/BasicOutput";
import { localCommandsAvailable, remoteCommandsAvailable } from "../data/commandDefinitions";

export const executeLocalCommand = (commandName: string, time: string, userName: string): CommandPromptOutput => {
    const commandType = commandName.toUpperCase() as keyof typeof localComponentaData;
    const command = localComponentaData[commandType];
    const componentToRender = localCommandsAvailable[commandName as keyof typeof remoteCommandsAvailable].component;
    return {
        input: commandName.toLowerCase(),
        output: command.output,
        userName,
        time,
        component: componentToRender || BasicOutput,
    }
}



export const executeRemoteCommand = async ({ commandName, commandFlags, commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }, time: string, userName: string): Promise<CommandPromptOutput> => {
    const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commandName, commandFlags, commandParams })
    })

    if (!res.ok) {
        return {
            userName,
            time,
            input: commandName,
            output: {
                list: ['Server Error']
            },
            component: BasicOutput,       
         }
    }

    const commandOutput = await res.json();
    const componentToRender = remoteCommandsAvailable[commandName.toUpperCase() as keyof typeof remoteCommandsAvailable].component;
    return {
        userName,
        time: time,
        input: commandName,
        component:componentToRender || BasicOutput,
       ...commandOutput, 
    }


}



