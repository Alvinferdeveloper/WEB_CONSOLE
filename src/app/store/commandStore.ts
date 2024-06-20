import { create } from "zustand";
import { CommandOutput, CommandsOutput} from "../types/command";

type States = {
    commandsExecutions: CommandsOutput,
}

type Actions = {
   addNewCommandExecution: (commandExecution:CommandOutput) => void;
   clear:()=>void;
}

export const commandStore = create<States & Actions>((set,get)=>(
    {
        commandsExecutions:[],
        clear:()=>set({commandsExecutions:[]}),
        addNewCommandExecution: (commandExecution: CommandOutput) => set((state)=>({commandsExecutions:[...state.commandsExecutions,commandExecution]})),
    }
))

