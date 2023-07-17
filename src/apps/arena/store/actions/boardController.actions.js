import _isNil from '@lodash/isNil'

import { PENCIL_STATE } from '@resources/constants'
import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import { boardControllerActions } from '../reducers/boardController.reducers'
import { getPencilStatus } from '../selectors/boardController.selectors'

const {
    setPencil, setHintsMenu, resetState, decreaseHint,
} = boardControllerActions

const getNewPencilState = currentState => {
    if (!currentState) return PENCIL_STATE.INACTIVE
    return currentState === PENCIL_STATE.ACTIVE ? PENCIL_STATE.INACTIVE : PENCIL_STATE.ACTIVE
}

const getToggledPencilNewState = () => {
    const currentState = getPencilStatus(getStoreState())
    return getNewPencilState(currentState)
}

export const updatePencil = newState => {
    const finalNewState = _isNil(newState) ? getToggledPencilNewState() : newState
    invokeDispatch(setPencil(finalNewState))
}

export const hintsMenuVisibilityAction = visibilityStatus => {
    invokeDispatch(setHintsMenu(visibilityStatus))
}

export const resetStoreState = () => {
    invokeDispatch(
        resetState({
            pencilState: PENCIL_STATE.INACTIVE,
            hintsLeft: 3,
            showHintsMenu: false,
        }),
    )
}

export const decreaseAvailableHintsCount = () => {
    invokeDispatch(decreaseHint())
}
