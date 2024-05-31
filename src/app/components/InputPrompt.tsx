import { useRef, KeyboardEvent, useState, useEffect } from "react"
import { ChangeEvent, MouseEvent } from "react";
import { useCommandStore } from "../store/commandStore";



interface Props {
    handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void,
    setInputData: (data: string) => void,
    inputData: string,
    promptInfo: {
        username?: string | null,
        currentTime?: string,
        tittle?: string,
    },
}

export default function InputPrompt({ handleKeyDown, setInputData, inputData, promptInfo }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { commands } = useCommandStore();
    const [isFocused, setIsFocused] = useState(true);
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
        if (inputRef.current)
            inputRef.current.style.width = 1 + "ch";
    }, [commands]);

    const handleFocus = ()=>{
        setIsFocused(inputRef.current === document.activeElement);
    }

    useEffect(()=>{
        document.addEventListener('focus',handleFocus,true);
        return ()=> document.removeEventListener('focus',handleFocus)
    },[])


    return (
        <div>
            <pre className="inline-block">
                {promptInfo.username && promptInfo.currentTime ? `${promptInfo.username}@${promptInfo?.currentTime}:$ ` : promptInfo.tittle + ": "}
                <input
                    ref={inputRef}
                    onChange={handleCommandChange}
                    onKeyDown={handleKeyDown}
                    value={inputData}
                    autoFocus
                    className=" w-1 bg-inherit outline-none caret-transparent"
                    type={promptInfo.tittle == "Password" ? 'password': 'text'}
                    disabled={!isFocused}
                />
            </pre>
            {
                isFocused && <span
                className={` inline-block h-6 w-3 bg-blue-500 text-blue-500 cursor`}
                onClick={handleCaretClick}
            >
                |
            </span>
            }
        </div>

    )
}