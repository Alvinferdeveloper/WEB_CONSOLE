import { User } from "../types/user";
import { commandStore } from "../store/commandStore";
import {
    isCommandLocal,
    isCommandRemote,
    isCommandValid,
    isCommandWithActionNeeded,
    parseCommand,
} from "../utils/commandUtils";
import { executeRemoteCommand, executeLocalCommand, executeActionCommand } from "../services/command";
import BasicOutput from "../components/outputs/BasicOutput";
import { CommandPromptOutput } from "../types/command";

export default function useCommandActions() {
    const { commandsExecutions, addNewCommandExecution, path } = commandStore();
    const executeCommand = async (command: string, time: string, user: User) => {
        const { commandName, commandFlags, commandParams } = parseCommand(command);
        let commandPromptOutput: CommandPromptOutput | void = undefined;
        if (isCommandValid(commandName, commandParams, commandFlags)) {
            if(isCommandWithActionNeeded(commandName)){// commands that need to execute actions on the local state
                commandPromptOutput = await executeActionCommand({ commandName, commandFlags, commandParams}, time, user.name, path);
            }
            else if (isCommandLocal(commandName)) {
                commandPromptOutput = executeLocalCommand(
                    { commandName, commandFlags, commandParams},
                    time,
                    user.name,
                    path,
                );
            } else if (isCommandRemote(commandName)) {
                commandPromptOutput = await executeRemoteCommand(
                    {commandName, commandFlags, commandParams},
                    time,
                    user.name,
                    path
                );
            }
        } else {
            commandPromptOutput = {
                userName: user.name,
                time: time,
                input: commandName,
                absolutePath: path.absolutePath,
                output: {
                    list:['Command not valid']
                },
                component: BasicOutput
            };
        }

        commandPromptOutput && addNewCommandExecution({...commandPromptOutput, input: command});
    };

    return { commandsExecutions, executeCommand };
}
