import { helpData } from "../data/helpData";
import { commandStore } from "../store/commandStore"
import { BasicOutPut } from "../types/command";

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
    return undefined;

}

export function clear(){
    commandStore.getState().clear();
    return Promise.resolve(); // all action need to return a promise
}
