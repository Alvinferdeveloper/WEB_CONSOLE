"use client"

import { commandStore } from "@/app/store/commandStore"
import React from "react"

import { useRef } from "react"
import { useNanoContent } from "../../hooks/nano/useNanoContent"
import { useNanoFileInfo } from "../../hooks/nano/useNanoFileInfo"
import { useNanoDialog } from "../../hooks/nano/useNanoDialog"
import { useNanoShortcuts } from "../../hooks/nano/useNanoShortcuts"
import { saveFileContent } from "../../services/files"

export default function NanoEditor() {
    const { path, nanoInfo } = commandStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Content and cursor
    const {
        content,
        cursorPosition,
        modified,
        setModified,
        handleContentChange,
    } = useNanoContent(
        "Bienvenido a nano. Escribe algo aquí..."
    );

    // File info
    const {
        filePath,
        setFilePath,
        saveFilename,
        setSaveFilename,
    } = useNanoFileInfo({ filePath: nanoInfo.filePath || "" });

    // Dialog and messages
    const {
        showSaveDialog,
        setShowSaveDialog,
        showMessage,
        message,
        showSavePrompt,
    } = useNanoDialog();

    // Shortcuts
    const { handleKeyDown } = useNanoShortcuts({ setShowSaveDialog, modified, showSavePrompt, setModified });

    // Handle save dialog
    const handleSaveDialogKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setFilePath(saveFilename);
            setShowSaveDialog(false);
            setModified(false);
            saveFileContent(filePath, path, content, nanoInfo.id, saveFilename).then(res => {
                showSavePrompt(`Guardado como: ${saveFilename}`);
            }).catch(err => {
                showSavePrompt(`Error al guardar: ${err}`);
            });
        }
        if (e.key === "Escape") {
            e.preventDefault();
            setShowSaveDialog(false);
        }
    };

    // Focus textarea on load
    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    return (
        <div className="flex justify-center w-full items-center min-h-screen absolute top-0 bg-zinc-950 p-5">
            <div className="w-full max-w-3xl bg-black text-terminal-green border border-terminal-glow rounded-lg shadow-terminal font-mono relative overflow-hidden">
                {/* Scanline effect */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-terminal-green/10 animate-scanline pointer-events-none z-10"></div>

                {/* CRT effect */}
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[length:100%_2px] pointer-events-none z-[2] opacity-30"></div>

                {/* Title bar */}
                <div className="bg-terminal-green text-black px-4 py-1 flex justify-between items-center">
                    <div>
                        GNU nano {saveFilename}
                        {modified ? " (modificado)" : ""}
                    </div>
                    <div>Versión 6.2</div>
                </div>

                {/* Editor area */}
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleContentChange}
                        onKeyDown={handleKeyDown}
                        className="w-full h-[500px] bg-black text-terminal-green p-4 outline-none resize-none font-mono drop-shadow-[0_0_2px_rgba(0,255,127,0.5)] z-10 relative"
                        spellCheck="false"
                    />

                    {/* Save dialog overlay */}
                    {showSaveDialog && (
                        <div className="absolute bottom-0 left-0 right-0 bg-terminal-green text-black p-2 z-20">
                            <div className="flex">
                                <span className="mr-2">Nombre del archivo a escribir:</span>
                                <input
                                    type="text"
                                    value={saveFilename}
                                    onChange={(e) => setSaveFilename(e.target.value)}
                                    onKeyDown={handleSaveDialogKeyDown}
                                    className="flex-1 bg-black text-terminal-green px-2 outline-none"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {/* Message overlay */}
                    {showMessage && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-terminal-green text-black px-4 py-2 z-20">
                            {message}
                        </div>
                    )}
                </div>

                {/* Status bar */}
                <div className="bg-terminal-green text-black px-4 py-1 flex justify-between items-center">
                    <div>
                        Línea {cursorPosition.line}, Columna {cursorPosition.column}
                    </div>
                    <div>{content.split("\n").length} líneas</div>
                </div>

                {/* Shortcuts */}
                <div className="bg-black text-terminal-green p-2 border-t border-terminal-glow grid grid-cols-2 gap-2 text-xs">
                    <div className="flex flex-wrap gap-x-4">
                        <span className="whitespace-nowrap">^G Ayuda</span>
                        <span className="whitespace-nowrap">^O Guardar</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4">
                        <span className="whitespace-nowrap">^X Salir</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
