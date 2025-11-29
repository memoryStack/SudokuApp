import { GAME_STATE } from '@resources/constants'
import { ACTION_TYPES as BOARD_GENERIC_ACTION_TYPES } from '../gameBoard/actionTypes'
import { Board } from '@domain/board/board'
import { SOUNDS } from 'src/interfaces/soundAdapter'
import { areSameCells } from '@domain/board/utils/housesAndCells'
import { inputNumberUseCase } from '@application/usecases/board'
import { INPUT_TYPE } from '@application/adapterInterfaces/stateManagers/inputPanelRepository'

const handleCellPress = ({ params: { cell, dependencies } }) => {
    const { boardRepository, soundAdapter, gameSettingsAdapter, inputPanelRepository } = dependencies

    if (inputPanelRepository.getIsNumberLocked()) {
        boardRepository.setSelectedCell(cell)
        const { number, type } = inputPanelRepository.getLockedNumber()
        inputNumberUseCase(
            number,
            type === INPUT_TYPE.NOTES,
            dependencies,
        )
        return
    }

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
