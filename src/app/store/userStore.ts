import { create } from "zustand";
import { User } from "../types/user";

type States = {
    user: User | null,
}

type Actions = {
    setUser: (user: User) => void,
    reset: ()=>void
}

export const userStore = create<States & Actions>((set,get)=>(
    {
        user: null,
        setUser: (user: User) =>set({ user }),
        reset: () => set({ user:null })
    }
))

