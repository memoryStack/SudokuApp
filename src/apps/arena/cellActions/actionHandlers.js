import _isEmpty from '@lodash/isEmpty'
import { GAME_STATE, PENCIL_STATE } from '@resources/constants'
import { undoAction } from '../store/actions/board.actions'
import { isGameActive } from '../utils/util'
import { fastPencilUseCase } from '@application/usecases/board'

const handleUndoClick = ({ params: { dependencies } }) => {
    const { boardRepository, gameStateRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    undoAction(boardRepository)
}

const getNewPencilState = currentState => {
    if (!currentState) return PENCIL_STATE.INACTIVE
    return currentState === PENCIL_STATE.ACTIVE ? PENCIL_STATE.INACTIVE : PENCIL_STATE.ACTIVE
}

const handlePencilClick = ({ params: { dependencies } }) => {
    const { boardControllerRepository, gameStateRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    const currentState = boardControllerRepository.getPencil()
    boardControllerRepository.setPencil(getNewPencilState(currentState))
}

const handleFastPencilClick = ({ params: { dependencies } }) => {
    const { boardRepository, gameStateRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    const fastPencilData = fastPencilUseCase(boardRepository)

    if (!_isEmpty(fastPencilData)) {
        const { notesBunch, move } = fastPencilData
        boardRepository.setNotesBunch(notesBunch)
        boardRepository.addMove(move)
    }
}

const handleHintClick = ({ params: { dependencies } }) => {
    const { gameStateRepository, boardControllerRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

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
