import { GAME_STATE, PENCIL_STATE } from '@resources/constants'
import { fastPencilAction, undoAction } from '../store/actions/board.actions'
import { updatePencil, setHintsMenuVisibilityAction, resetStoreState } from '../store/actions/boardController.actions'
import { updateGameState } from '../store/actions/gameState.actions'
import { isGameActive } from '../store/utils'

const handleUndoClick = () => {
    if (!isGameActive()) return
    undoAction()
}

const getNewPencilState = currentState => {
    if (!currentState) return PENCIL_STATE.INACTIVE
    return currentState === PENCIL_STATE.ACTIVE ? PENCIL_STATE.INACTIVE : PENCIL_STATE.ACTIVE
}

const handlePencilClick = ({ params: currentState }) => {
    if (!isGameActive()) return
    updatePencil(getNewPencilState(currentState))
}

const handleFastPencilClick = () => {
    if (!isGameActive()) return
    fastPencilAction()
}

const handleHintClick = () => {
    if (!isGameActive()) return
    setHintsMenuVisibilityAction(true)
    updateGameState(GAME_STATE.DISPLAY_HINT)
}

const handleUnmount = () => {
    resetStoreState()
}

const ACTION_TYPES = {
    ON_UNDO_CLICK: 'ON_UNDO_CLICK',
    ON_PENCIL_CLICK: 'ON_PENCIL_CLICK',
    ON_FAST_PENCIL_CLICK: 'ON_FAST_PENCIL_CLICK',
    ON_HINT_CLICK: 'ON_HINT_CLICK',
    ON_UNMOUNT: 'ON_UNMOUNT',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_UNDO_CLICK]: handleUndoClick,
    [ACTION_TYPES.ON_PENCIL_CLICK]: handlePencilClick,
    [ACTION_TYPES.ON_FAST_PENCIL_CLICK]: handleFastPencilClick,
    [ACTION_TYPES.ON_HINT_CLICK]: handleHintClick,
    [ACTION_TYPES.ON_UNMOUNT]: handleUnmount,
}

export { ACTION_TYPES, ACTION_HANDLERS }
