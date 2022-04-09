import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import { PENCIL_STATE } from '../../../../resources/constants'
import { setPencil, setHintsMenu, resetState } from '../reducers/boardController.reducers'
import { getPencilStatus } from '../selectors/boardController.selectors'

const getNewPencilState = currentState => {
    if (!currentState) return PENCIL_STATE.INACTIVE
    return currentState === PENCIL_STATE.ACTIVE ? PENCIL_STATE.INACTIVE : PENCIL_STATE.ACTIVE
}

export const updatePencil = (newState = '') => {
    if (!newState) {
        const currentState = getPencilStatus(getStoreState())
        newState = getNewPencilState(currentState)
    }
    invokeDispatch(setPencil(newState))
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
