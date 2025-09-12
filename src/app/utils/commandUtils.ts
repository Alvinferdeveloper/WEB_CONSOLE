import { commandDefinitions, localCommandsAvailable, remoteCommandsAvailable } from "../data/commandDefinitions";

export const validateCommand = (commandValue: string, commandParams: string[], flags: string[]) => {

    if (commandValue == "") return { isValid: false, error: '' };
    const commandExists = commandDefinitions.find(command => command.commandName === commandValue);

    if (!commandExists) {
        return { isValid: false, error: `${commandValue}: command not found` };
    }

    const invalidFlags = flags.filter(flag => !commandExists.availableFlags.includes(flag));
    if (invalidFlags.length > 0) {
        return {
            isValid: false,
            error: `${commandValue}: invalid option -- '${invalidFlags[0]}'\nTry '${commandValue} --help' for more information.`
        };
    }

    if (commandParams.length < commandExists.miniumExpectedParams) {
        return {
            isValid: false,
            error: `${commandValue}: missing file operand\nTry '${commandValue} --help' for more information.`
        };
    }

    return { isValid: true };
};

export const isCommandValid = (commandValue: string, commandParams: string[], flags: string[]) => {
    return validateCommand(commandValue, commandParams, flags).isValid;

}

export const isCommandLocal = (commandValue: string) => {
    return Object.values(localCommandsAvailable).some(localCommand => localCommand.commandName == commandValue);
}

export const isCommandRemote = (commandValue: string) => {
    return Object.values(remoteCommandsAvailable).some(remoteCommand => remoteCommand.commandName == commandValue);
}

export const isCommandWithActionNeeded = (commandValue: string) => {
    return Object.values(commandDefinitions).some(command => command.commandName === commandValue && command.accionNeeded)
}

export const parseCommand = (command: string) => {
    const splitedCommand = command.trim().split(" ");
    const commandName = splitedCommand[0];
    const commandFlags = splitedCommand.filter(value => value.startsWith('-') || value.startsWith('--'));
    const lastFlagindex = splitedCommand.reverse().findIndex(value => value.startsWith('--') || value.startsWith('-'));
    const commandParams = splitedCommand.slice(0, lastFlagindex).reverse();
    return {
        commandName,
        commandFlags,
        commandParams,
    }

}