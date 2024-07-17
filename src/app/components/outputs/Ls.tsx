import { OutPut } from "@/app/types/command"
export function Ls({output}:{output:OutPut | void}) {
    return (
        <div className=" h-16 bg-green-500">
           {
            output?.list?.map((log, index) =>  <p key={index}>{log}</p>)
           }
        </div>
    )
}