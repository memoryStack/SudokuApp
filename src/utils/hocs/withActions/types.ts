export type Action = {
    type: string
    payload: unknown
}
export type OnAction = (action: Action) => unknown
