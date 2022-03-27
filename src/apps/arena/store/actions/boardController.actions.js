import { getStoreState, invokeDispatch } from "../../../../redux/dispatch.helpers"
import { PENCIL_STATE } from "../../../../resources/constants"

import { setPencil, setHints, decreaseHint } from '../reducers/boardController.reducers'
import { getPencilStatus } from "../selectors/boardController.selectors"

const getNewPencilState = currentState => {
    if (!currentState) return PENCIL_STATE .INACTIVE
    return currentState === PENCIL_STATE.ACTIVE ? PENCIL_STATE.INACTIVE : PENCIL_STATE.ACTIVE
}

export const updatePencil = (newState = '') => {
    if (!newState) {
        const currentState = getPencilStatus(getStoreState())
        newState = getNewPencilState(currentState)
    }
    invokeDispatch(setPencil(newState))
}
