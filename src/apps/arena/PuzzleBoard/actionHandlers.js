import { GAME_STATE } from '@resources/constants'
import { ACTION_TYPES as BOARD_GENERIC_ACTION_TYPES } from '../gameBoard/actionTypes'
import { Board } from '@domain/board/board'
import { SOUNDS } from 'src/interfaces/soundAdapter'
import { areSameCells } from '@domain/board/utils/housesAndCells'

const handleCellPress = ({ params: { cell, dependencies } }) => {
    const { boardRepository, soundAdapter, gameSettingsAdapter } = dependencies

    if (!areSameCells(cell, boardRepository.getSelectedCell())) {
        gameSettingsAdapter.soundsEnabled() && soundAdapter.play(SOUNDS.CELL_CLICK)
        boardRepository.setSelectedCell(cell)
    }
}

const handleMainNumbersUpdate = ({ params: { mainNumbers, dependencies } }) => {
    const { gameStateRepository } = dependencies

    if (Board.isPuzzleSolved(mainNumbers)) {
        gameStateRepository.setGameState(GAME_STATE.OVER_SOLVED)
    }
}

const ACTION_TYPES = {
    ...BOARD_GENERIC_ACTION_TYPES,
    ON_MAIN_NUMBERS_UPDATE: 'ON_MAIN_NUMBERS_UPDATE',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_CELL_PRESS]: handleCellPress,
    [ACTION_TYPES.ON_MAIN_NUMBERS_UPDATE]: handleMainNumbersUpdate,
}

export { ACTION_TYPES, ACTION_HANDLERS }
