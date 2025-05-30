import { useState } from "react";

export function useNanoDialog() {
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");

    const showSavePrompt = (msg: string, options?: {
        useTimeout?: boolean,
        timeOut?: number
    }) => {
        const {
            useTimeout = true,
            timeOut = 2000
        } = options ?? {};

        setMessage(msg);
        setShowMessage(true);
        if (useTimeout)
            setTimeout(() => {
                setShowMessage(false);
            }, timeOut);
    };

    return {
        showSaveDialog,
        setShowSaveDialog,
        setShowMessage,
        showMessage,
        message,
        showSavePrompt,
        setMessage,
    };
}
