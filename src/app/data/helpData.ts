type Data = {
    output: {
        list: string[]
    }
}

export const helpData: Record<string, Data> = {
    // Comandos del sistema
    default: {
        output: {
            list: [
                'ls - List directory contents',
                'mkdir - Make directories',
                'cd - Change the shell working directory',
                'touch - Change file timestamps',
                'rm - Remove files or directories',
                'rmdir - Remove empty directories',
                'mv - Move (rename) files',
                'cp - Copy files and directories',
                'nano - Simple text editor',
                'cat - Concatenate files and print on the standard output',
                'echo - Display a line of text',
                'pwd - Print name of current/working directory',
                'whoami - Print effective user id',
                'date - Print or set the system date and time',
                'help - Display information about builtin commands',
                'clear - Clear the terminal screen',
                'exit - Exit the shell',
                'history - Display the command history'
            ]
        }
    },
    ls: {
        output: {
            list: [
                'ls - List directory contents',
                'Usage: ls [OPTION]... [FILE]...',
                '',
                'The default sort order is alphabetical.'
            ]
        }
    },

    cd: {
        output: {
            list: [
                'cd - Change the shell working directory',
                'Usage: cd [DIRECTORY]',
                '',
                'Change the current directory to DIRECTORY.',
                'The default DIRECTORY is the home directory.'
            ]
        }
    },

    mkdir: {
        output: {
            list: [
                'mkdir - Make directories',
                'Usage: mkdir DIRECTORY...',
                '',
                'Create the DIRECTORY(ies), if they do not already exist.'
            ]
        }
    },

    touch: {
        output: {
            list: [
                'touch - Change file timestamps',
                'Usage: touch FILE...',
                '',
                'Update the access and modification times of each FILE to the current time.',
                'A FILE argument that does not exist is created empty.'
            ]
        }
    },

    rm: {
        output: {
            list: [
                'rm - Remove files or directories',
                'Usage: rm FILE...',
                '',
                'By default, rm does not remove directories.'
            ]
        }
    },

    rmdir: {
        output: {
            list: [
                'rmdir - Remove empty directories',
                'Usage: rmdir DIRECTORY...',
                '',
                'Remove the DIRECTORY(ies), if they are empty.'
            ]
        }
    },

    mv: {
        output: {
            list: [
                'mv - Move (rename) files',
                'Usage: mv SOURCE... DIRECTORY',
                '   or: mv SOURCE... DIRECTORY',
                '',
                'Rename SOURCE to DEST, or move SOURCE(s) to DIRECTORY.'
            ]
        }
    },

    cp: {
        output: {
            list: [
                'cp - Copy files and directories',
                'Usage: cp SOURCE... DIRECTORY',
                '   or: cp SOURCE... DIRECTORY',
                '',
                'Copy SOURCE to DEST.'
            ]
        }
    },

    nano: {
        output: {
            list: [
                'nano - Simple text editor',
                'Usage: nano [OPTION]... [FILE]...',
                '',
                'Open FILE for editing.',
                'Basic controls:',
                '  Ctrl+O  Save file',
                '  Ctrl+X  Exit',
            ]
        }
    },

    // Comandos locales
    help: {
        output: {
            list: [
                'help - Display information about builtin commands',
                'Usage: help [COMMAND]',
                '',
                'Display helpful information about builtin commands.',
                'If COMMAND is specified, prints help for that command.'
            ]
        }
    },

    clear: {
        output: {
            list: [
                'clear - Clear the terminal screen',
                'Usage: clear',
                '',
                'Clear the terminal screen.'
            ]
        }
    },

    exit: {
        output: {
            list: [
                'exit - Exit the shell',
                'Usage: exit',
                '',
                'Exit the terminal session.'
            ]
        }
    },

    history: {
        output: {
            list: [
                'history - Display the command history',
                'Usage: history',
                '',
                'Display the command history with line numbers.'
            ]
        }
    },
    echo: {
        output: {
            list: [
                'echo - Display a line of text',
                'Usage: echo [STRING]...',
                '',
                'Print the STRING(s) to standard output.'
            ]
        }
    },
    pwd: {
        output: {
            list: [
                'pwd - Print name of current/working directory',
                'Usage: pwd',
                '',
                'Print the full filename of the current working directory.'
            ]
        }
    },
    whoami: {
        output: {
            list: [
                'whoami - Print effective user id',
                'Usage: whoami',
                '',
                'Print the user name associated with the current effective user ID.'
            ]
        }
    },
    date: {
        output: {
            list: [
                'date - Print or set the system date and time',
                'Usage: date',
                '',
                'Display the current time in the given FORMAT, or set the system time.'
            ]
        }
    }
}