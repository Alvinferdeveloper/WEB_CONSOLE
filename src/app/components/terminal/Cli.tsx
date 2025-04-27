"use client"
import { useEffect, useRef, KeyboardEvent } from "react";
import { commandStore } from "../../store/commandStore";
import Commands from "./Commands";
import Prompt from "./Prompt";
import { useSession } from "next-auth/react";
import { inconsolata } from "../../fonts/nextfonts";
import useFiglet from "../../hooks/useFiglet";
import { useState } from "react";
import SignInPrompts from "../auth/SignInPrompt";
import InputPrompt from "./InputPrompt";
import RegisterPrompt from "../auth/RegisterPrompt";

export default function Cli() {
    const { commandsExecutions } = commandStore();
    const cliRef = useRef<HTMLDivElement>(null);
    const { data: session, status } = useSession();
    const { banner} = useFiglet(session?.user.name || '');
    const [ accountOption, setAccountOption] = useState('');
    const [ register, setRegister] = useState<boolean | null>(null);
    useEffect(() => {
        setScroll();
    }, [commandsExecutions]);


    function setScroll() {
        if (cliRef.current) {
            cliRef.current.scrollTop = cliRef.current.scrollHeight
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if(accountOption.toUpperCase() === "Y") setRegister(false);
            if(accountOption.toUpperCase() === "N") setRegister(true);
        }
    }

    return (
        <div className={`w-6/12 m-auto h-full pb-20 overflow-hidden pt-8 text-2xl  bg-black text-terminal-green border border-terminal-glow shadow-terminal`} ref={cliRef}>
            <pre className=" text-center text_shadow ">{banner}</pre>
            <Commands commands={commandsExecutions}></Commands>
            {
                status == 'loading' && <p>Loading...</p>
            }
            {
                status == 'authenticated' && <Prompt/>
            }
            
            {
                status == 'unauthenticated' && register === null && <InputPrompt handleKeyDown={handleKeyDown} setInputData={setAccountOption} inputData={accountOption} promptInfo={{tittle: "Do you already have an account (y/n)"}} focused={true}/>
            }
            {
                register && !session && <RegisterPrompt/>
            }
            {
                register === false && !session && <SignInPrompts/> 
            }
        </div>

    )
}