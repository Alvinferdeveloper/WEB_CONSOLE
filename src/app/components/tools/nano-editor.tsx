"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"

export default function NanoEditor() {
    const [content, setContent] = useState(
        "Bienvenido a nano. Escribe algo aquí...\n\nEste es un simulador de nano en una terminal retro.\nPuedes editar este texto y guardar con Ctrl+O (simular).\n",
    )
    const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
    const [modified, setModified] = useState(false)
    const [filename, setFilename] = useState("nuevo-archivo.txt")
    const [showSaveDialog, setShowSaveDialog] = useState(false)
    const [saveFilename, setSaveFilename] = useState("nuevo-archivo.txt")
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Update cursor position when content changes
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value
        setContent(newContent)
        setModified(true)

        // Calculate cursor position
        const textBeforeCursor = newContent.substring(0, e.target.selectionStart)
        const lines = textBeforeCursor.split("\n")
        const currentLine = lines.length
        const currentColumn = lines[lines.length - 1].length + 1

        setCursorPosition({ line: currentLine, column: currentColumn })
    }

    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl+O (Save)
        if (e.ctrlKey && e.key === "o") {
            e.preventDefault()
            setShowSaveDialog(true)
        }

        // Ctrl+X (Exit)
        if (e.ctrlKey && e.key === "x") {
            e.preventDefault()
            if (modified) {
                showSavePrompt("¿Guardar antes de salir?")
            } else {
                showSavePrompt("Archivo cerrado")
            }
        }

        // Ctrl+G (Help)
        if (e.ctrlKey && e.key === "g") {
            e.preventDefault()
            showSavePrompt("Ayuda: Ctrl+O para guardar, Ctrl+X para salir")
        }
    }

    // Handle save dialog
    const handleSaveDialogKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            setFilename(saveFilename)
            setShowSaveDialog(false)
            setModified(false)
            showSavePrompt(`Guardado como: ${saveFilename}`)
        }

        if (e.key === "Escape") {
            e.preventDefault()
            setShowSaveDialog(false)
        }
    }

    // Show temporary message
    const showSavePrompt = (msg: string) => {
        setMessage(msg)
        setShowMessage(true)
        setTimeout(() => {
            setShowMessage(false)
        }, 2000)
    }

    // Focus textarea on load
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [])

    return (
        <div className="flex justify-center items-center min-h-screen absolute top-0 bg-zinc-950 p-5">
            <div className="w-full max-w-3xl bg-black text-terminal-green border border-terminal-glow rounded-lg shadow-terminal font-mono relative overflow-hidden">
                {/* Scanline effect */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-terminal-green/10 animate-scanline pointer-events-none z-10"></div>

                {/* CRT effect */}
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[length:100%_2px] pointer-events-none z-[2] opacity-30"></div>

                {/* Title bar */}
                <div className="bg-terminal-green text-black px-4 py-1 flex justify-between items-center">
                    <div>
                        GNU nano {filename}
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
                        <span className="whitespace-nowrap">^W Buscar</span>
                        <span className="whitespace-nowrap">^K Cortar</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4">
                        <span className="whitespace-nowrap">^X Salir</span>
                        <span className="whitespace-nowrap">^J Justificar</span>
                        <span className="whitespace-nowrap">^R Leer Arch</span>
                        <span className="whitespace-nowrap">^U Pegar</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
