import { CommandPromptOutputs as Comm } from "../../types/command";
export default function Commands({ commands }: { commands: Comm }) {
    return commands.map((command, index) => (
        <div className="" key={index}>

            <pre className="inline-block text-xl">{command.userName}@{command.time}:{command.absolutePath}$ {command.input}</pre>
            {
                
                <command.component output={command.output} />
            }

            

        </div>

    ))

}