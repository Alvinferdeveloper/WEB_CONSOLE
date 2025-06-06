import { KeyboardEvent, use } from "react";
import { commandStore } from "../../store/commandStore";

interface NanoShortcutsProps {
    setShowSaveDialog: (show: boolean) => void;
    modified: boolean;
    showSavePrompt: (msg: string, options?: {
        useTimeout?: boolean,
        timeOut?: number
    }) => void;
    setUnsavedModifications: (unsaved: boolean) => void;
    unsavedModifications: boolean;
    setShowMessage: (show: boolean) => void;
}

export function useNanoShortcuts({ setShowSaveDialog, modified, showSavePrompt, setUnsavedModifications, unsavedModifications, setShowMessage }: NanoShortcutsProps) {
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
                showSavePrompt("¿Guardar antes de salir? S/N", {
                    useTimeout: false
                });
                setUnsavedModifications(true);
            } else {
                showSavePrompt("Archivo cerrado");
                setNanoInfo({ isOpen: false });
            }
        }

        if (e.key === "s" && unsavedModifications) {
            e.preventDefault();
            setShowSaveDialog(true);
            setUnsavedModifications(false);
            setShowMessage(false);
        }
        if (e.key === "n" && unsavedModifications) {
            e.preventDefault();
            setNanoInfo({ isOpen: false });
            setUnsavedModifications(false);
            setShowMessage(false);
        }

        // Ctrl+G (Help)
        if (e.ctrlKey && e.key === "g") {
            e.preventDefault();
            showSavePrompt("Ayuda: Ctrl+O para guardar, Ctrl+X para salir");
        }
    };

    return { handleKeyDown };
}
