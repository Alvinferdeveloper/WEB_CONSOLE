"use client"
import Cli from "./components/Cli"
import { SessionProvider } from "next-auth/react"

export default function App() {

  return (
    <SessionProvider>
      <div className=' h-screen overflow-x-auto bg-zinc-950'>
        <Cli />
      </div>
    </SessionProvider>
  )
}
