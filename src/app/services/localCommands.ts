import { helpData } from "../data/helpData";
export function help({ commandParams }: { commandName: string, commandFlags: string[], commandParams: string[] }){
    if(helpData[commandParams[0] as keyof typeof helpData]){
        return helpData[commandParams[0] as keyof typeof helpData].output;
    }
    return {
        list:['No existe entrada para este comando']
    } 
}