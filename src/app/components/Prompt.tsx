"use client";
import {
  KeyboardEvent,
  useEffect,
  useState,
} from "react";
import { useCommandStore } from "../store/commandStore";
import { useSession } from "next-auth/react";
import InputPrompt from "./InputPrompt";
import { Session } from "next-auth";



export default function Prompt() {
  const [currentCommandTime, setCurrentCommandTime] = useState<string>("");
  const [command, setCommand] = useState<string>("");
  const {  executeCommand, clear, commands } = useCommandStore();
  const { data: session } = useSession();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key == "Enter" ) {
        if(command == "clear") clear();
        else executeCommand(command, currentCommandTime);
        setCommand("");
    }
  };

  useEffect(() => {
    setCurrentCommandTime(new Date().toLocaleTimeString());
  }, [commands]);


  return (
 <InputPrompt handleKeyDown={handleKeyDown} setInputData={setCommand} inputData={command} promptInfo={{username:session?.user?.name, currentTime:currentCommandTime}}/>
  );
}
