import { LsResponse} from "./response";
export type BasicOutPut = {
    list?:string[];
}

export type LsOutPut = LsResponse[];
export type CommandPromptOutput = {
    userName: string,
    time:string,
    input:string,
    absolutePath:string,
    output?:BasicOutPut | LsOutPut | void,
    notValid?: boolean,
    component: ({output}:{output:any}) => JSX.Element;
}

export type CommandPromptOutputs = CommandPromptOutput[];
