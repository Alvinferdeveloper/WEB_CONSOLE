import { create } from "zustand";
import { CommandPromptOutput, CommandPromptOutputs} from "../types/command";

type States = {
    commandsExecutions: CommandPromptOutputs,
    path: {
        id:number,
        absolutePath:string
    }
}

type Actions = {
   addNewCommandExecution: (commandExecution:CommandPromptOutput) => void;
   clear:()=>void;
   setPath:({id, absolutePath}:{id:number, absolutePath:string}) => void;
}

export const commandStore = create<States & Actions>((set,get)=>(
    {
        commandsExecutions:[],
        clear:()=>set({commandsExecutions:[]}),
        addNewCommandExecution: (commandExecution: CommandPromptOutput) => set((state)=>({commandsExecutions:[...state.commandsExecutions,commandExecution]})),
        path:{id:0, absolutePath:'/'},//this is temporary
        setPath:({id, absolutePath}) => set({ path:{
            id,
            absolutePath
        } })
        
    }
))

