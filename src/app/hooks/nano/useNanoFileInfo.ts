import { useState, useEffect } from "react";

export function useNanoFileInfo(nanoInfo: { filePath: string }, defaultPath = "") {
    const [filePath, setFilePath] = useState("");
    const [saveFilename, setSaveFilename] = useState("");

    const setFileNameFromPath = () => {
        const fileNameTemp = filePath.split("/").pop() || filePath;
        setSaveFilename(fileNameTemp);
    }

    useEffect(() => {
        if (nanoInfo.filePath) {
            const fileNameTemp = nanoInfo.filePath.split("/").pop() || nanoInfo.filePath;
            setFilePath(nanoInfo.filePath);
            setSaveFilename(fileNameTemp);
        } else if (defaultPath) {
            setFilePath(defaultPath);
            setSaveFilename(defaultPath);
        }
    }, [nanoInfo.filePath, defaultPath]);

    return {
        filePath,
        setFileNameFromPath,
        saveFilename,
        setSaveFilename,
    };
}
