
import { OutPut } from "../../types/command"
export default function Help({output}:{output:OutPut | undefined}){
    return (
        <div>
           <p>{output?.header}</p>
          {
            output?.list?.map(el => (
                <p>{el}</p>
            ))
          }
        </div>
    )
}