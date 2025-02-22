"use client";
import {
  KeyboardEvent,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import InputPrompt from "./InputPrompt";
import useCommandActions from "../hooks/useCommandActions";
import useGetinitalPath from "../hooks/useGetInitialPath";

export default function Prompt() {
  const [currentCommandTime, setCurrentCommandTime] = useState<string>("");
  const [command, setCommand] = useState<string>("");
  const { commandsExecutions, executeCommand} = useCommandActions();
  const { data: session } = useSession();
  useGetinitalPath();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key == "Enter" && session?.user) {
      executeCommand(command, currentCommandTime, session.user);
      setCommand("");
    }
  };

  useEffect(() => {
    setCurrentCommandTime(new Date().toLocaleTimeString());
  }, [commandsExecutions]);


  return (
    <InputPrompt handleKeyDown={handleKeyDown} setInputData={setCommand} inputData={command} promptInfo={{ username: session?.user?.name, currentCommandTime }} />
  );
}
