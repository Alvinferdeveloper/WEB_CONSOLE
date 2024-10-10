import * as commandServices from '../services/command.service'

export const commandExecutables = {
    mkdir:commandServices.Mkdir,
    ls: commandServices.Ls,
    cd:commandServices.Cd,
    touch: commandServices.Touch,
    rm: commandServices.Rm,
    rmdir: commandServices.Rmdir
}

