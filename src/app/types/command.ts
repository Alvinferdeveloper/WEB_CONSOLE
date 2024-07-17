
export type OutPut = {
    header?:string,
    list?:string[]
}
export type CommandPromptOutput = {
    userName: string,
    time:string,
    input:string,
    absolutePath:string,
    output?:OutPut | void,
    notValid?: boolean,
    component: ({output}:{output:OutPut | void}) => JSX.Element;
}

export type CommandPromptOutputs = CommandPromptOutput[];
