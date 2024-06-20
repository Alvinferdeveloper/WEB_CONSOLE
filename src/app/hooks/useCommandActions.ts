import { commandDefinitions, OutPut, User } from "../types/command";
import { commandStore } from "../store/commandStore";
import {
    executeLocalCommand,
    isCommandLocal,
    isCommandRemote,
    isCommandValid,
    parseCommand,
    executeRemoteCommand,
} from "../services/command";
import { localCommandsAvailable } from "../types/command";
import { localComponentaData } from "../data/commandData";
import BasicComponenent from "../components/BasicComponent";

export default function useCommandActions() {
    const { commandsExecutions, addNewCommandExecution } = commandStore();

    const executeCommand = async (command: string, time: string, user: User) => {
        const { commandName, commandFlags, commandParams } = parseCommand(command);
        console.log(commandName, commandFlags, commandParams);
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
            console.log('aqui')
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
