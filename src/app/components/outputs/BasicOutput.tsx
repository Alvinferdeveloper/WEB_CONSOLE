import { BasicOutPut } from "../../types/command";
export default function BasicOutput({output}:{output:BasicOutPut | void}){
    return (
        <div>
            {
                output?.list?.map((log, index) => <p key={index}>{log}</p>)
            }
        </div>
    )
}