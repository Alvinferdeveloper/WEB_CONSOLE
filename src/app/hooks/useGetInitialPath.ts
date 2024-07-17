import { useEffect } from "react";
import { commandStore } from "../store/commandStore";

export default function useGetinitalPath(){
    const { path, setPath} = commandStore();

    useEffect(()=>{
        const getInitalPath = async ()=>{
            const res = await fetch('api/useGetinitalPath');
            const json = await res.json();
            setPath({id:json.id, absolutePath:json.absolutePath})
        }

        getInitalPath();
    },[])

    return {
        path,
    }
}