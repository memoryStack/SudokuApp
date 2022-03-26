import { invokeDispatch } from "../../../../redux/dispatch.helpers"

import { removeHints, setNextHint, setPrevHint, setHints } from '../reducers/smartHintHC.reducers'

export const showHints = (hints) => {
    invokeDispatch(setHints(hints))
}

export const clearHints = () => {
    invokeDispatch(removeHints())
}

export const showNextHint = () => {
    invokeDispatch(setNextHint())
}

export const showPrevHint = () => {
    invokeDispatch(setPrevHint())
}
