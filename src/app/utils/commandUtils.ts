import { commandDefinitions, localCommandsAvailable, remoteCommandsAvailable} from "../data/commandDefinitions";

export const isCommandValid = (commandValue: string, commandParams:string[], flags:string[])=>{
    const commandExists = commandDefinitions.find(command => command.commandName === commandValue);
    const areFlagsValid = flags.every(flag=> commandExists?.availableFlags.includes(flag));
    const miniumExpectecParams = commandParams.length == commandExists?.miniumExpectecParams;
    if(commandExists && areFlagsValid && miniumExpectecParams) return true;
    return false;
    
}

export const isCommandLocal = (commandValue:string) => {
    return Object.values(localCommandsAvailable).some(localCommand => localCommand.commandName == commandValue );
}

export const isCommandRemote = (commandValue:string) => {
    return Object.values(remoteCommandsAvailable).some(remoteCommand => remoteCommand.commandName == commandValue );
}

export const isCommandClear = (commandValue:string) => {
    return commandValue == "clear";
}

export const parseCommand = (command:string) => {
    const splitedCommand = command.trim().split(" ");
    const commandName = splitedCommand[0];
    const commandFlags = splitedCommand.filter( value => value.startsWith('-') || value.startsWith('--'));
    const lastFlagindex = splitedCommand.reverse().findIndex(value => value.startsWith('--') ||  value.startsWith('-'));
    const commandParams = splitedCommand.slice(0, lastFlagindex);
    return {
        commandName,
        commandFlags,
        commandParams,
    }

}