import { useRef, KeyboardEvent, useState, useEffect } from "react"
import { ChangeEvent, MouseEvent } from "react";
import { commandStore } from "../store/commandStore";



interface Props {
    handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void,
    setInputData: (data: string) => void,
    inputData: string,
    promptInfo: {
        username?: string | null,
        currentCommandTime?: string,
        tittle?: string,
    },

    focused?:boolean
}

export default function InputPrompt({ handleKeyDown, setInputData, inputData, promptInfo, focused = true }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { commandsExecutions } = commandStore();
    const handleCommandChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (inputRef.current) {
            inputRef.current.style.width = inputRef.current.value.length + "ch";
            setInputData(e.target?.value);
        }
    };

    const handleCaretClick = (e: MouseEvent<HTMLSpanElement>) => {
        inputRef.current?.focus();
    };

    useEffect(() => {
        if (inputRef.current && focused)
            inputRef.current.style.width = 1 + "ch";
        if(focused)
            inputRef.current?.focus();
    }, [commandsExecutions, focused]);

  

    return (
        <div>
            <pre className="inline-block">
                {promptInfo.username && promptInfo.currentCommandTime ? `${promptInfo.username}@${promptInfo?.currentCommandTime}:$ ` : promptInfo.tittle + ": "}
                <input
                    ref={inputRef}
                    onChange={handleCommandChange}
                    onKeyDown={handleKeyDown}
                    value={inputData}
                    autoFocus
                    className=" w-1 bg-inherit outline-none caret-transparent"
                    type={promptInfo.tittle == "Password" ? 'password': 'text'}
                    disabled={!focused}
                />
            </pre>
            {
                focused && <span
                className={` inline-block h-6 w-3 bg-blue-500 text-blue-500 cursor`}
                onClick={handleCaretClick}
            >
                |
            </span>
            }
        </div>

    )
}