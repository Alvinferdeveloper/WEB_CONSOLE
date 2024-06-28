import { OutPut } from "../../types/command";
export default function BasicOutput({output}:{output:OutPut | undefined}){
    return (
        <div>
            {
                output?.list?.map((log, index) => <p key={index}>{log}</p>)
            }
        </div>
    )
}