import { BasicOutPut } from "../../types/command";
export default function HelpOutput({output}:{output:BasicOutPut | void}){
    return (
        <div className=" ml-7">
            {
                output?.list?.map((log, index) => <p key={index} className=" text-lg mt-2">{log}</p>)
            }
        </div>
    )
}