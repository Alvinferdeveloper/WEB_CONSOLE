import { Commands as Comm } from "../types/command";
export default function Commands({ commands }: { commands: Comm }) {

    return commands.map((command, index) => (
        <div className="" key={index}>
            <pre className="inline-block">{command.userName} {command.time}:$ {command.input}</pre>
            {
                command.component && <command.component output={command.output} />
            }

        </div>

    ))

}