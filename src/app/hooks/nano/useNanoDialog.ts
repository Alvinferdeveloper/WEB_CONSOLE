import { useState } from "react";

export function useNanoDialog() {
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");

    const showSavePrompt = (msg: string) => {
        setMessage(msg);
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
        }, 2000);
    };

    return {
        showSaveDialog,
        setShowSaveDialog,
        showMessage,
        message,
        showSavePrompt,
        setMessage,
    };
}
