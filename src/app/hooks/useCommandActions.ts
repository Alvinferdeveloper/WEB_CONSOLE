import { User } from "../types/user";
import { commandStore } from "../store/commandStore";
import { validateCommand, isCommandLocal, isCommandRemote, isCommandWithActionNeeded, parseCommand } from "../utils/commandUtils";
import { executeRemoteCommand, executeLocalCommand, executeActionCommand } from "../services/command";
import BasicOutput from "../components/outputs/BasicOutput";
import { CommandPromptOutput } from "../types/command";

export default function useCommandActions() {
    const { commandsExecutions, addNewCommandExecution, path, addHistory } = commandStore();
    const executeCommand = async (command: string, time: string, user: User) => {
        const { commandName, commandFlags, commandParams } = parseCommand(command);
        let commandPromptOutput: CommandPromptOutput | void = undefined;
        
        const validation = validateCommand(commandName, commandParams, commandFlags);
        
        if (validation.isValid) {
            if (isCommandWithActionNeeded(commandName)) {// commands that need to execute actions on the local state
                commandPromptOutput = await executeActionCommand({ commandName, commandFlags, commandParams }, time, user.name, path);
            }
            else if (isCommandLocal(commandName)) {
                commandPromptOutput = executeLocalCommand(
                    { commandName, commandFlags, commandParams },
                    time,
                    user.name,
                    path,
                );
            } else if (isCommandRemote(commandName)) {
                commandPromptOutput = await executeRemoteCommand(
                    { commandName, commandFlags, commandParams },
                    time,
                    user.name,
                    path
                );
            }
        } else {
            // Si hay un error de validación, mostrarlo
            commandPromptOutput = {
                userName: user.name,
                time: time,
                input: command,
                absolutePath: path.absolutePath,
                output: {
                    list: validation.error ? [validation.error] : [`${commandName}: command not found`]
                },
                component: BasicOutput
            };
        }

        commandPromptOutput && addNewCommandExecution({ ...commandPromptOutput, input: command });
        addHistory(command);
    };

    /**
     * Executes a command by determining its type (local, remote, or action needed),
     * and processes it accordingly. If the command is valid, it is executed and 
     * the result is added to the command history. If the command is invalid, 
     * a "command not found" message is returned.
     * 
     * @param command - The command string entered by the user.
     * @param time - The time at which the command was executed.
     * @param user - The user executing the command.
     */
    return { commandsExecutions, executeCommand };
}
