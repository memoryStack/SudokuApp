import { eraseCellUseCase, inputNumberUseCase } from '@application/usecases/board'
import { ACTION_TYPES } from '../inputPanel/constants'
import { isGameActive } from '../utils/util'
import { SOUNDS } from 'src/interfaces/soundAdapter'

const handleNumberClick = ({ getState, params: number }) => {
    const { dependencies } = getState()
    const { gameStateRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    inputNumberUseCase(number, {
        ...dependencies,
        sound: {
            mistake: { play: () => dependencies?.soundAdapter.play(SOUNDS.MISTAKE) },
            addNumber: { play: () => dependencies?.soundAdapter.play(SOUNDS.NUMBER_INPUT) },
            removeNumber: { play: () => dependencies?.soundAdapter.play(SOUNDS.ERASER_CLICK) },
        }
    })
}

const handleEraserClick = ({ getState }) => {
    const { dependencies } = getState()
    const { gameStateRepository, boardRepository, snackBarAdapter } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    eraseCellUseCase(boardRepository, snackBarAdapter, {
        play: () => dependencies?.soundAdapter.play(SOUNDS.ERASER_CLICK)
    })
}

export const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_NUMBER_CLICK]: handleNumberClick,
    [ACTION_TYPES.ON_ERASE_CLICK]: handleEraserClick,
}
