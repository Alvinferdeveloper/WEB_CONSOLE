import { User } from "../types/user";
import { commandStore } from "../store/commandStore";
import {
    isCommandLocal,
    isCommandRemote,
    isCommandValid,
    parseCommand,
} from "../utils/commandUtils";
import { executeRemoteCommand, executeLocalCommand } from "../services/command";
import BasicComponenent from "../components/outputs/BasicOutput";

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
                const commandResponse = executeRemoteCommand(
                    commandName,
                    time,
                    user.name
                );
                //addNewCommandExecution(commandResponse);
            }
        } else {
            const commandResponse = {
                userName: user.name,
                time: time,
                input: commandName,
                output: {
                    list:['Command not valid']
                },
                component: BasicComponenent
            };

            addNewCommandExecution(commandResponse);
        }
    };

    return { commandsExecutions, executeCommand };
}
