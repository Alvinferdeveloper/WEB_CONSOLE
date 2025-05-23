import { useState, useEffect } from "react";

export function useNanoFileInfo(nanoInfo: { filePath: string }, defaultPath = "") {
    const [filename, setFilename] = useState("");
    const [saveFilename, setSaveFilename] = useState("");

    useEffect(() => {
        if (nanoInfo.filePath) {
            const fileNameTemp = nanoInfo.filePath.split("/").pop() || nanoInfo.filePath;
            setFilename(fileNameTemp);
            setSaveFilename(fileNameTemp);
        } else if (defaultPath) {
            setFilename(defaultPath);
            setSaveFilename(defaultPath);
        }
    }, [nanoInfo.filePath, defaultPath]);

    return {
        filename,
        setFilename,
        saveFilename,
        setSaveFilename,
    };
}
