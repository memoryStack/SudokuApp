import { GAME_STATE } from '@resources/constants'
import { updateSelectedCell, resetStoreState } from '../store/actions/board.actions'
import { ACTION_TYPES as BOARD_GENERIC_ACTION_TYPES } from '../gameBoard/actionTypes'
import { BOARD_CELLS_COUNT } from '../constants'
import { MainNumbersRecord } from '../RecordUtilities/boardMainNumbers'
import { BoardIterators } from '../utils/classes/boardIterators'

const handleCellPress = ({ params: cell }) => {
    updateSelectedCell(cell)
}

const handleMainNumbersUpdate = ({ params: { mainNumbers, dependencies } }) => {
    const { gameStateRepository } = dependencies

    if (getCorrectlyFilledCells(mainNumbers) === BOARD_CELLS_COUNT) {
        gameStateRepository.setGameState(GAME_STATE.OVER_SOLVED)
    }
}

const getCorrectlyFilledCells = mainNumbers => {
    let result = 0
    BoardIterators.forBoardEachCell(cell => {
        if (MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)) result++
    })
    return result
}

const handleOnUnmount = () => {
    resetStoreState()
}

const ACTION_TYPES = {
    ...BOARD_GENERIC_ACTION_TYPES,
    ON_MAIN_NUMBERS_UPDATE: 'ON_MAIN_NUMBERS_UPDATE',
    ON_UNMOUNT: 'ON_UNMOUNT',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_CELL_PRESS]: handleCellPress,
    [ACTION_TYPES.ON_MAIN_NUMBERS_UPDATE]: handleMainNumbersUpdate,
    [ACTION_TYPES.ON_UNMOUNT]: handleOnUnmount,
}

export { ACTION_TYPES, ACTION_HANDLERS }
