import { commandStore } from "@/app/store/commandStore";
import { useEffect, useState } from "react";

export function useNanoContent(initialContent: string) {
    const [content, setContent] = useState('');
    const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
    const [modified, setModified] = useState(false);
    const [unsavedModifications, setUnsavedModifications] = useState(false);
    const { nanoInfo } = commandStore();

    useEffect(() => {
        const fetchContent = async () => {
            if (nanoInfo.id) {
                const res = await fetch(`/api/files/get-content/${nanoInfo.id}`)
                const data: { content: string } = await res.json();
                setContent(data.content);
            }
            else {
                setContent(initialContent);
            }
        }
        fetchContent();
    }, [])

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        setModified(true);

        // Calculate cursor position
        const textBeforeCursor = newContent.substring(0, e.target.selectionStart);
        const lines = textBeforeCursor.split("\n");
        const currentLine = lines.length;
        const currentColumn = lines[lines.length - 1].length + 1;
        setCursorPosition({ line: currentLine, column: currentColumn });
    };

    return {
        content,
        setContent,
        cursorPosition,
        modified,
        setModified,
        handleContentChange,
        unsavedModifications,
        setUnsavedModifications
    };
}
