import { create } from "zustand";
import { CommandPromptOutput, CommandPromptOutputs } from "../types/command";

type States = {
    commandsExecutions: CommandPromptOutputs,
    path: {
        id: number,
        absolutePath: string
    },
    history: string[],
    nanoInfo: {
        isOpen: boolean,
        filePath?: string,
        id?: number
    }
}

type Actions = {
    addNewCommandExecution: (commandExecution: CommandPromptOutput) => void;
    clear: () => void;
    setPath: ({ id, absolutePath }: { id: number, absolutePath: string }) => void;
    reset: () => void;
    addHistory: (command: string) => void;
    setNanoInfo: ({ isOpen, filePath, id }: { isOpen: boolean, filePath?: string, id?: number }) => void;
}

export const commandStore = create<States & Actions>((set, get) => (
    {
        commandsExecutions: [],
        history: [],
        nanoInfo: { isOpen: false, filePath: undefined },
        clear: () => set({ commandsExecutions: [] }),
        addNewCommandExecution: (commandExecution: CommandPromptOutput) => set((state) => ({ commandsExecutions: [...state.commandsExecutions, commandExecution] })),
        path: { id: 0, absolutePath: '/' },//this is temporary
        setPath: ({ id, absolutePath }) => set({
            path: {
                id,
                absolutePath
            }
        }),
        reset: () => set({ commandsExecutions: [], path: { id: 0, absolutePath: '/' } }),
        addHistory: (command: string) => set((state) => ({ history: [...state.history, command] })),
        setNanoInfo: ({ isOpen, filePath, id }) => set({ nanoInfo: { isOpen, filePath, id } }),

    }
))

