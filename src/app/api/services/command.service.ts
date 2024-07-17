export async function Mkdir(userName: string) {
    return {
        output: {
            list: ['Executin mkdir']
        },
    }
}


export async function Ls(){
    return {
        output: {
            list: ['Listing']
        },
    }
}

export async function Cd(){
    return {
        id:10,
        newPath:"Glory to god"
    }
}



