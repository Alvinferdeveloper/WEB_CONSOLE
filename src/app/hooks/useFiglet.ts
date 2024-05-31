import figlet from "figlet";
import StandardFont from "figlet/importable-fonts/Standard.js";
import { useEffect, useState } from "react";

export default function useFiglet(name: string){
    const [banner, setBanner] = useState<String>();
    const figletParser = ()=>{
        figlet.parseFont("Standard", StandardFont);
        figlet(name, 'Standard', function (err, text) {
            if (err) {
                return;
            }
            setBanner(text);
        });
    }

    useEffect(()=>{
        figletParser();
    },[name])

    return { banner};
}