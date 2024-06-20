import { create } from "zustand";
import { User } from "../types/command";

type States = {
    user: User | null,
}

type Actions = {
    setUser: (user: User) => void,
}

export const useUserStore = create<States & Actions>((set,get)=>(
    {
        user: null,
        setUser: (user: User) =>set({ user })
    }
))

