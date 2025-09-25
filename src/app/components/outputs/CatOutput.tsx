import { BasicOutPut } from "../../types/command";
export default function CatOutput({output}:{output:BasicOutPut | void}){
    return (
        <div>
            {
                output?.list?.map((log, index) => <p key={index} className=" text-sm mt-2 text-white">{log}</p>)
            }
        </div>
    )
}