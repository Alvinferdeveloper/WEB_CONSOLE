import { helpData } from "../data/helpData";
import { commandStore } from "../store/commandStore";
import { userStore } from "../store/userStore";

export function help({ commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }) {
    if (helpData[commandParams[0]]) {
        return helpData[commandParams[0]].output;;
    }
    return helpData.default.output;
}

export function history() {
    const history = commandStore.getState().history;
    return {
        list: history
    }
}

export function echo({ commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }) {
    return {
        list: [commandParams.join(' ')]
    }
}

export function pwd({ commandName, commandFlags, commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }, currentPath: { id: number, absolutePath: string }) {
    return {
        list: [currentPath.absolutePath]
    }
}

export function whoami() {
    const userName = userStore.getState().user?.name;
    return {
        list: [userName || '']
    }
}

export function date() {
    return {
        list: [new Date().toString()]
    }
}

