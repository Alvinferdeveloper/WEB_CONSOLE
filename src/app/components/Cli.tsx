"use client"
import { useEffect, useRef } from "react";
import { useCommandStore } from "../store/commandStore";
import Commands from "./Commands";
import Prompt from "./Prompt";
import { signIn, useSession } from "next-auth/react";
import { inconsolata } from "../fonts/nextfonts";
import useFiglet from "../hooks/useFiglet";
import SignInPrompts from "./SignInPrompt";



export default function Cli() {
    const { commands } = useCommandStore();
    const cliRef = useRef<HTMLDivElement>(null);
    const { data: session, status } = useSession();
    const { banner} = useFiglet(session?.user?.name || '');
    useEffect(() => {
        setScroll();
    }, [commands]);

    function setScroll() {
        if (cliRef.current) {
            cliRef.current.scrollTop = cliRef.current.scrollHeight
        }
    }

    async function handleSignin() {
        const res = await signIn('credentials', { username: 'testuser', password: 'testpassword', redirect: false })
        if (res?.error) alert(res.error);
    }

    return (
        <div className={`w-6/12 m-auto h-full pb-20 overflow-hidden bg-red-600  pt-8 text-2xl ${inconsolata.className}`} ref={cliRef}>
            <pre className=" text-center text_shadow ">{banner}</pre>
            <Commands commands={commands}></Commands>
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