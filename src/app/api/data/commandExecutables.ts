import * as commandServices from '../services/command.service'

type commandExecution = (params: commandServices.commandExecutionParams) => any;
export const commandExecutables: Record<string, commandExecution> = {
    mkdir: commandServices.Mkdir,
    ls: commandServices.Ls,
    cd: commandServices.Cd,
    touch: commandServices.Touch,
    rm: commandServices.Rm,
    rmdir: commandServices.Rmdir,
    mv: commandServices.Mv,
    cp: commandServices.Cp,
    cat: commandServices.Cat,
    head: commandServices.Head,
    tail: commandServices.Tail,
    wc: commandServices.Wc
}

