import { ACTION_TYPES } from '../inputPanel/constants'
import { eraseAction, inputNumberAction } from '../store/actions/board.actions'
import { isGameActive } from '../utils/util'

const handleNumberClick = ({ getState, params: number }) => {
    const { dependencies } = getState()
    const { gameStateRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    inputNumberAction(number, dependencies)
}

const handleEraserClick = ({ getState }) => {
    const { dependencies } = getState()
    const { gameStateRepository, boardRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    eraseAction(boardRepository)
}

export const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_NUMBER_CLICK]: handleNumberClick,
    [ACTION_TYPES.ON_ERASE_CLICK]: handleEraserClick,
}
