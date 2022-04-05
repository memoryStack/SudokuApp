import { fastPencilAction, undoAction } from '../store/actions/board.actions'
import { updatePencil, hintsMenuVisibilityAction, resetStoreState } from '../store/actions/boardController.actions'
import { isGameActive } from '../store/utils'

const handleUndoClick = () => {
    if (!isGameActive()) return
    undoAction()
}

const handlePencilClick = () => {
    if (!isGameActive()) return
    updatePencil()
}

const handleFastPencilClick = () => {
    if (!isGameActive()) return
    fastPencilAction()
}

const handleHintClick = () => {
    if (!isGameActive()) return
    hintsMenuVisibilityAction(true)
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
