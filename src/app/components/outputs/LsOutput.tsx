import { LsOutPut } from "@/app/types/command"
export function LsOutput({ output }: { output: LsOutPut }) {
  return (
    <div className="grid grid-cols-4">
      {
        output.map((file, index) => <p className={`${file.type == 'DIRECTORY' ? ' text-blue-900' : 'text-white'} text-sm mt-2`} key={index}>{file.name}</p>)
      }
    </div>
  )
}