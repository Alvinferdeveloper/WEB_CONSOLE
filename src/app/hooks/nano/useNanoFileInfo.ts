import { useState, useEffect } from "react";

export function useNanoFileInfo(nanoInfo: { filePath: string }, defaultPath = "") {
    const [filePath, setFilePath] = useState("");
    const [saveFilename, setSaveFilename] = useState("");

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
        setFilePath,
        saveFilename,
        setSaveFilename,
    };
}
