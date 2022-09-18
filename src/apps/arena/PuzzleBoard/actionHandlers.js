import { updateSelectedCell } from '../store/actions/board.actions'
import { isGameActive } from '../store/utils'
import { ACTION_TYPES as BOARD_GENERIC_ACTION_TYPES } from '../gameBoard/actionTypes'
import { updateGameState } from '../store/actions/gameState.actions'
import { GAME_STATE } from '../../../resources/constants'
import { resetStoreState } from '../store/actions/board.actions'
import { forBoardEachCell } from '../utils/util'
import { BOARD_CELLS_COUNT } from '../constants'

const handleCellPress = ({ params: cell }) => {
    // TODO: some improvements can be done here like
    // check if user is clicking on same cell again and again
    if (!isGameActive()) return
    updateSelectedCell(cell)
}

const handleMainNumbersUpdate = ({ params: mainNumbers }) => {
    let correctlyFilledCells = 0

    forBoardEachCell(({ row, col }) => {
        const cellMainNumber = mainNumbers[row][col]
        if (cellMainNumber.solutionValue && cellMainNumber.solutionValue === cellMainNumber.value)
            correctlyFilledCells++
    })

    if (correctlyFilledCells === BOARD_CELLS_COUNT) updateGameState(GAME_STATE.OVER.SOLVED)
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
