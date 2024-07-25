import { eraseCellUseCase, inputNumberUseCase } from '@application/usecases/board'
import { ACTION_TYPES } from '../inputPanel/constants'
import { isGameActive } from '../utils/util'

const handleNumberClick = ({ getState, params: number }) => {
    const { dependencies } = getState()
    const { gameStateRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    inputNumberUseCase(number, dependencies)
}

const handleEraserClick = ({ getState }) => {
    const { dependencies } = getState()
    const { gameStateRepository, boardRepository, snackBarAdapter } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    eraseCellUseCase(boardRepository, snackBarAdapter)
}

export const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_NUMBER_CLICK]: handleNumberClick,
    [ACTION_TYPES.ON_ERASE_CLICK]: handleEraserClick,
}
