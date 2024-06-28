export const remoteCommandsAvailable = {
    LS : {
        commandName: "ls",
        miniumExpectecParams: 0,
        availableFlags:['a','b']
    },
}

export const  localCommandsAvailable ={
    HELP : {
            commandName: "help",
            miniumExpectecParams: 1,
            availableFlags:['a','b']
    }
}

export const commandDefinitions = [
    ...Object.values(remoteCommandsAvailable),
    ...Object.values(localCommandsAvailable)
]