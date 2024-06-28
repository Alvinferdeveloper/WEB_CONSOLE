
export type OutPut = {
    header?:string,
    list?:string[]
}
export type CommandOutput = {
    userName: string,
    time:string,
    input:string,
    output?:OutPut,
    notValid?: boolean,
    component?: ({output}:{output:OutPut | undefined}) => JSX.Element;
}

export type CommandsOutput = CommandOutput[];
