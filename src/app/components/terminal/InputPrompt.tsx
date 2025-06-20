import { useRef, KeyboardEvent, useEffect, InputHTMLAttributes } from "react"
import { ChangeEvent, MouseEvent } from "react";
import { commandStore } from "../../store/commandStore";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void,
    setInputData: (data: string) => void,
    inputData: string,
    promptInfo: {
        username?: string | null,
        currentCommandTime?: string,
        tittle?: string,
    },
    focused?: boolean
}

export default function InputPrompt({ handleKeyDown, setInputData, inputData, promptInfo, focused = true, ...inputProps }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { commandsExecutions, path } = commandStore();
    const handleCommandChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target?.value);
    };

    const handleCaretClick = (e: MouseEvent<HTMLSpanElement>) => {
        inputRef.current?.focus();
    };

    useEffect(() => {
        if (inputRef.current && focused) {
            inputRef.current.style.width = inputData.length + "ch";
        }
        if (focused)
            inputRef.current?.focus();
    }, [focused, inputData]);


    return (
        <div className="relative">
            <pre className="inline-block text-xl">
                {promptInfo.username && promptInfo.currentCommandTime ? `${promptInfo.username}@${promptInfo?.currentCommandTime}:${path?.absolutePath}$ ` : promptInfo.tittle + ": "}
                <input
                    ref={inputRef}
                    onChange={handleCommandChange}
                    onKeyDown={handleKeyDown}
                    value={inputData}
                    autoFocus
                    className=" w-1 bg-inherit outline-none caret-transparent"
                    disabled={!focused}
                    {...inputProps}
                />
            </pre>
            {
                focused && <span
                    className={` inline-block h-7 w-3 bg-terminal-green cursor absolute bottom-0 cursor-text`}
                    onClick={handleCaretClick}
                >

                </span>
            }
        </div>

    )
}