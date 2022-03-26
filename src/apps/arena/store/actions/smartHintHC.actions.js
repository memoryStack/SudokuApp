import { invokeDispatch } from "../../../../redux/dispatch.helpers"

import { removeHints, setNextHint, setPrevHint } from '../reducers/smartHintHC.reducers'

export const clearHints = () => {
    invokeDispatch(removeHints())
}

export const showNextHint = () => {
    invokeDispatch(setNextHint())
}

export const showPrevHint = () => {
    invokeDispatch(setPrevHint())
}
