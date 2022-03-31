import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import { PENCIL_STATE } from '../../../../resources/constants'
import { duplicacyPresent } from '../../utils/util'
import { setNotesBunch } from '../reducers/board.reducers'

import { setPencil, setHints, decreaseHint, setHintsMenu } from '../reducers/boardController.reducers'
import { getMainNumbers, getNotesInfo } from '../selectors/board.selectors'
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

export const fastPencilAction = () => {
    const bunch = []
    // TODO: let's remove info suffix
    const mainNumbers = getMainNumbers(getStoreState())
    const notesInfo = getNotesInfo(getStoreState())

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (!mainNumbers[row][col].value) {
                for (let num = 1; num <= 9; num++) {
                    const { show } = notesInfo[row][col][num - 1]
                    if (!show && !duplicacyPresent(num, mainNumbers, { row, col })) {
                        bunch.push({ cell: { row, col }, note: num })
                    }
                }
            }
        }
    }

    invokeDispatch(setNotesBunch(bunch))
}

export const hintsMenuVisibilityAction = visibilityStatus => {
    invokeDispatch(setHintsMenu(visibilityStatus))
}
