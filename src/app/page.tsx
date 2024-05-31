'use client'
import Cli from "./components/Cli"
import { SessionProvider } from "next-auth/react"

export default function App() {

  return (
    <SessionProvider>
      <div className=' h-screen overflow-x-auto bg-gradient-to-r from-emerald-800 to-teal-900'>
      <Cli/>
    </div>
    </SessionProvider>
  )
}
