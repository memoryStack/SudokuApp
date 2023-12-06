import { GAME_STATE, PENCIL_STATE } from '@resources/constants'
import { fastPencilAction, undoAction } from '../store/actions/board.actions'
import { isGameActive } from '../store/utils'

const handleUndoClick = () => {
    if (!isGameActive()) return
    undoAction()
}

const getNewPencilState = currentState => {
    if (!currentState) return PENCIL_STATE.INACTIVE
    return currentState === PENCIL_STATE.ACTIVE ? PENCIL_STATE.INACTIVE : PENCIL_STATE.ACTIVE
}

const handlePencilClick = ({ params: { dependencies } }) => {
    if (!isGameActive()) return

    const { boardControllerRepository } = dependencies
    const currentState = boardControllerRepository.getPencil()
    boardControllerRepository.setPencil(getNewPencilState(currentState))
}

const handleFastPencilClick = () => {
    if (!isGameActive()) return
    fastPencilAction()
}

const handleHintClick = ({ params: { dependencies } }) => {
    if (!isGameActive()) return

    const { gameStateRepository, boardControllerRepository } = dependencies
    gameStateRepository.setGameState(GAME_STATE.DISPLAY_HINT)
    boardControllerRepository.setHintsMenuVisibility(true)
}

const handleUnmount = ({ params: { dependencies } }) => {
    const { boardControllerRepository } = dependencies
    boardControllerRepository.resetState()
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
