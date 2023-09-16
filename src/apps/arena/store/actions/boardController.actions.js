import { PENCIL_STATE } from '@resources/constants'
import { invokeDispatch } from '../../../../redux/dispatch.helpers'
import { boardControllerActions } from '../reducers/boardController.reducers'

const {
    setPencil, setHintsMenu, resetState, decreaseHint,
} = boardControllerActions

export const updatePencil = newState => {
    const finalNewState = newState || PENCIL_STATE.INACTIVE
    invokeDispatch(setPencil(finalNewState))
}

export const setHintsMenuVisibilityAction = visibilityStatus => {
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
