import { helpData } from "../data/helpData";
import { commandStore } from "../store/commandStore";
export function help({ commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }){
    if(helpData[commandParams[0]]){
        return helpData[commandParams[0]].output;;
    }
    return {
        list:['No existe entrada para este comando']
    } 
}

export function history(){
    const history = commandStore.getState().history;
    return {
        list:history
    }
}
    
