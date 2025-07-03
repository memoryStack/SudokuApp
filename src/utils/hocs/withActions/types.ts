export type Action = {
    type: string
    payload?: any
}
export type OnAction = (action: Action) => unknown

type GetState = () => unknown

type SetState = (...args: unknown[]) => void

export type StatePropsHandlers = {
    setState: SetState
    getState: GetState
}
