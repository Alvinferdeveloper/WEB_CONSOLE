import { create } from "zustand";
import { isCommandValid, isCommandLocal,executeLocalCommand, isCommandClear, isCommandRemote} from "../utils/command";
import { Commands, localCommandsAvailable, User} from "../types/command";
import Error from "../components/Error";
import { Ls } from "../components/Ls";

type States = {
    commands: Commands,
    user:User,
}

type Actions = {
   executeCommand: (command: string, time:string) => void;
   clear:()=>void;
}

export const useCommandStore = create<States & Actions>((set,get)=>(
    {
        user: {
            id:1,
            name:"Albin-Fernandez"
        },
        commands:[],
        clear:()=>set({commands:[]}),
        executeCommand: (command: string, time:string) => {
        const commandValue = command.trim().split(" ")[0];
        const commandParams = command.trim().split(" ").filter(value => value != "").slice(1);
        if(isCommandValid(commandValue, commandParams)){
            if(isCommandLocal(commandValue)){
                const localCommand = Object.entries(localCommandsAvailable).filter(([key,value]) => value == commandValue)[0][0] as keyof typeof localCommandsAvailable;
                const commandResponse = executeLocalCommand(localCommand,time,get().user.name);
                set(state => ({commands:[...state.commands,commandResponse]}));
            }
            else if(isCommandRemote(commandValue)){
                set(state => ({commands:[...state.commands,{input:command,component:Ls,userName:state.user.name,time,notValid:true}]}));
            }
        }
        else{
            set(state => ({commands:[...state.commands,{input:command,component:Error,userName:state.user.name,time,notValid:true}]}));
        }
        },
    }
))

