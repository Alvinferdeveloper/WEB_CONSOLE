"use client";
import {
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import InputPrompt from "./InputPrompt";
import useCommandActions from "../../hooks/useCommandActions";
import useGetinitalPath from "../../hooks/useGetInitialPath";
import { commandStore } from "@/app/store/commandStore";

export default function Prompt() {
  const [currentCommandTime, setCurrentCommandTime] = useState<string>("");
  const [command, setCommand] = useState<string>("");
  const { commandsExecutions, executeCommand } = useCommandActions();
  const { data: session } = useSession();
  const [_, setCurrentHistoryIndex] = useState(0);
  useGetinitalPath();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key == "Enter" && session?.user) {
      executeCommand(command, currentCommandTime, session.user);
      setCommand("");
    }
  };

  useEffect(() => {
    setCurrentHistoryIndex(commandsExecutions.length);
    setCurrentCommandTime(new Date().toLocaleTimeString());
  }, [commandsExecutions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const history = commandStore.getState().history;
      if (history.length == 0) return;
      if (e.key == 'ArrowUp') {
        setCurrentHistoryIndex(prev => {
          const before = Math.max(0, prev - 1)
          setCommand(history[before]);
          return before;
        });
      }
      else if (e.key == 'ArrowDown') {
        setCurrentHistoryIndex(prev => {
          const next = Math.min(history.length - 1, prev + 1);
          setCommand(history[next]);
          return next;
        });
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [])


  return (
    <InputPrompt handleKeyDown={handleKeyDown} setInputData={setCommand} inputData={command} promptInfo={{ username: session?.user?.name, currentCommandTime }} />
  );
}
