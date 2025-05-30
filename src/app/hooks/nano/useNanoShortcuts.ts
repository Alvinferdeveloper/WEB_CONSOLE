import { KeyboardEvent } from "react";
import { commandStore } from "../../store/commandStore";

interface NanoShortcutsProps {
    setShowSaveDialog: (show: boolean) => void;
    modified: boolean;
    showSavePrompt: (msg: string) => void;
    setModified: (m: boolean) => void;
}

export function useNanoShortcuts({ setShowSaveDialog, modified, showSavePrompt }: NanoShortcutsProps) {
    const { setNanoInfo } = commandStore();
    const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl+O (Save)
        if (e.ctrlKey && e.key === "o") {
            e.preventDefault();
            setShowSaveDialog(true);
        }

        // Ctrl+X (Exit)
        if (e.ctrlKey && e.key === "x") {
            e.preventDefault();
            if (modified) {
                showSavePrompt("¿Guardar antes de salir?");
            } else {
                showSavePrompt("Archivo cerrado");
                setNanoInfo({ isOpen: false });
            }
        }

        // Ctrl+G (Help)
        if (e.ctrlKey && e.key === "g") {
            e.preventDefault();
            showSavePrompt("Ayuda: Ctrl+O para guardar, Ctrl+X para salir");
        }
    };

    return { handleKeyDown };
}
