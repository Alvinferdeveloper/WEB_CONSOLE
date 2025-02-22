import { LsOutPut } from "@/app/types/command"
export function Ls({output}:{output: LsOutPut}) {
    return (
        <div className="grid grid-cols-4">
        {
          output.map((file,index) => <p  className={`${file.type == 'DIRECTORY' && ' text-blue-900'}`} key={index}>{file.name}</p>)
        }
        </div>
    )
}