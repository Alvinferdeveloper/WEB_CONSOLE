import { useEffect } from "react";
import { OutPut } from "../types/command";

export default function BasicComponenent({output}:{output:OutPut | undefined}){

    useEffect(()=>{
        console.log('ejeuctando')
    },[])

    return (
        <div>
            {
                output?.list?.map((log, index) => <p key={index}>{log}</p>)
            }
        </div>
    )
}