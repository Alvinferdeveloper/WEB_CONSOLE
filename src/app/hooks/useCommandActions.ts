import { User } from "../types/user";
import { commandStore } from "../store/commandStore";
import {
    isCommandLocal,
    isCommandRemote,
    isCommandValid,
    parseCommand,
} from "../utils/commandUtils";
import { executeRemoteCommand, executeLocalCommand } from "../services/command";
import BasicOutput from "../components/outputs/BasicOutput";

export default function useCommandActions() {
    const { commandsExecutions, addNewCommandExecution } = commandStore();

    const executeCommand = async (command: string, time: string, user: User) => {
        const { commandName, commandFlags, commandParams } = parseCommand(command);
        if (isCommandValid(commandName, commandParams, commandFlags)) {
            if (isCommandLocal(commandName)) {
                const commandResponse = executeLocalCommand(
                    commandName,
                    time,
                    user.name
                );

                addNewCommandExecution(commandResponse);
            } else if (isCommandRemote(commandName)) {
                const commandResponse = await executeRemoteCommand(
                    {commandName, commandFlags, commandParams},
                    time,
                    user.name
                );
                addNewCommandExecution(commandResponse)
            }
        } else {
            const commandResponse = {
                userName: user.name,
                time: time,
                input: commandName,
                output: {
                    list:['Command not valid']
                },
                component: BasicOutput
            };

            addNewCommandExecution(commandResponse);
        }
    };

    return { commandsExecutions, executeCommand };
}
