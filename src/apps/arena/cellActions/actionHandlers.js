import _isEmpty from '@lodash/isEmpty'
import { GAME_STATE, PENCIL_STATE } from '@resources/constants'

import { isGameActive } from '../utils/util'
import { fastPencilUseCase, undoUseCase } from '@application/usecases/board'

const handleUndoClick = ({ params: { dependencies } }) => {
    const { boardRepository, gameStateRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    undoUseCase(boardRepository)
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
    fastPencilUseCase(boardRepository)
}

const handleHintClick = ({ params: { dependencies } }) => {
    const { gameStateRepository, boardControllerRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    gameStateRepository.setGameState(GAME_STATE.DISPLAY_HINT)
    boardControllerRepository.setHintsMenuVisibility(true)
}

const ACTION_TYPES = {
    ON_UNDO_CLICK: 'ON_UNDO_CLICK',
    ON_PENCIL_CLICK: 'ON_PENCIL_CLICK',
    ON_FAST_PENCIL_CLICK: 'ON_FAST_PENCIL_CLICK',
    ON_HINT_CLICK: 'ON_HINT_CLICK',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_UNDO_CLICK]: handleUndoClick,
    [ACTION_TYPES.ON_PENCIL_CLICK]: handlePencilClick,
    [ACTION_TYPES.ON_FAST_PENCIL_CLICK]: handleFastPencilClick,
    [ACTION_TYPES.ON_HINT_CLICK]: handleHintClick,
}

export { ACTION_TYPES, ACTION_HANDLERS }
