import { commandStore } from "../store/commandStore"
import { userStore } from "../store/userStore";
import { BasicOutPut } from "../types/command";
import { signOut } from "next-auth/react";

export async function cd({ commandName, commandFlags, commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }, currentPath:{id:number, absolutePath:string}):Promise<BasicOutPut | void>{
    const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commandName, commandFlags, commandParams, currentPath })
    })

    const json = await res.json();
    if(json.error){
        return { 
            list:json.outputList,
        }
    }

    const setPath = commandStore.getState().setPath;
    setPath({id:json.id, absolutePath:json.newPath})
    return { list:[]};

}

export function clear(){
    commandStore.getState().clear();
    return Promise.resolve(); // all action need to return a promise
}

export async function logOutAction(){
    await signOut();
    const resetCommands = commandStore.getState().reset;
    const resetUser = userStore.getState().reset;
    resetCommands();
    resetUser();

}