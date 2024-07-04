import BasicOutput from "@/app/components/outputs/BasicOutput"
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

