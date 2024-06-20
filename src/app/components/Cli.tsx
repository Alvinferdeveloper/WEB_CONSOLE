"use client"
import { useEffect, useRef } from "react";
import { commandStore } from "../store/commandStore";
import Commands from "./Commands";
import Prompt from "./Prompt";
import { useSession } from "next-auth/react";
import { inconsolata } from "../fonts/nextfonts";
import useFiglet from "../hooks/useFiglet";
import SignInPrompts from "./SignInPrompt";



export default function Cli() {
    const { commandsExecutions } = commandStore();
    const cliRef = useRef<HTMLDivElement>(null);
    const { data: session, status } = useSession();
    const { banner} = useFiglet(session?.user.name || '');
    useEffect(() => {
        setScroll();
        console.log(commandsExecutions)
    }, [commandsExecutions]);

    function setScroll() {
        if (cliRef.current) {
            cliRef.current.scrollTop = cliRef.current.scrollHeight
        }
    }

    return (
        <div className={`w-6/12 m-auto h-full pb-20 overflow-hidden bg-red-600  pt-8 text-2xl ${inconsolata.className}`} ref={cliRef}>
            <pre className=" text-center text_shadow ">{banner}</pre>
            <Commands commands={commandsExecutions}></Commands>
            {
                status == 'loading' && <p>Loading...</p>
            }
            {
                status == 'authenticated' && <Prompt/>
            }

            {
                status == 'unauthenticated' && <SignInPrompts/>
            }
        </div>

    )
}