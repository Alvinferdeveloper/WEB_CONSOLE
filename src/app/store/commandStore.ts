import { create } from "zustand";
import { CommandPromptOutput, CommandPromptOutputs} from "../types/command";

type States = {
    commandsExecutions: CommandPromptOutputs,
    path: {
        id:number,
        absolutePath:string
    },
    history: string[]
}

type Actions = {
   addNewCommandExecution: (commandExecution:CommandPromptOutput) => void;
   clear:()=>void;
   setPath:({id, absolutePath}:{id:number, absolutePath:string}) => void;
   reset: ()=>void;
   addHistory: (command: string) => void;
}

export const commandStore = create<States & Actions>((set,get)=>(
    {
        commandsExecutions:[],
        history:[],
        clear:()=>set({commandsExecutions:[]}),
        addNewCommandExecution: (commandExecution: CommandPromptOutput) => set((state)=>({commandsExecutions:[...state.commandsExecutions,commandExecution]})),
        path:{id:0, absolutePath:'/'},//this is temporary
        setPath:({id, absolutePath}) => set({ path:{
            id,
            absolutePath
        } }),
        reset:()=> set({ commandsExecutions:[], path:{id:0, absolutePath:'/'} }),
        addHistory: (command: string) => set((state) => {console.log(command);return { history: [...state.history, command] }}),
        
    }
))

