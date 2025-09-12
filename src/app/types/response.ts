export type LsResponse = {
    id: number,
    name: string,
    type: 'DIRECTORY' | 'FILE',
    created_at?: string
}

