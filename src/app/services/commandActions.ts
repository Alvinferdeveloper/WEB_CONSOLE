import { commandStore } from "../store/commandStore"
import { OutPut } from "../types/command";

export async function cd({ commandName, commandFlags, commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }):Promise<OutPut | void>{
    const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commandName, commandFlags, commandParams })
    })

    const json = await res.json();
    if(!res.ok){
        return {
            list:json.output,
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