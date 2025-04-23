"use client"
import Cli from "./components/Cli"
import { SessionProvider } from "next-auth/react"

export default function App() {

  return (
    <SessionProvider>
      <div className=' h-screen overflow-x-auto bg-zinc-950'>
        <div className="absolute top-0 left-0 w-full h-[4px] bg-terminal-green/10 animate-scanline pointer-events-none z-10"></div>
        <Cli />
      </div>
    </SessionProvider>
  )
}
