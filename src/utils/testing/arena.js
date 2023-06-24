import { BOARD_CELL_TEST_ID } from 'src/apps/arena/gameBoard/cell/cell.constants'
import { TIMER_PAUSE_ICON_TEST_ID } from 'src/apps/arena/timer/timer.constants'

import { isEmptyElement } from './touchable'
import { screen } from './testingLibrary'

export const checkAllCellsEmpty = () => {
    const allCells = screen.getAllByTestId(BOARD_CELL_TEST_ID)
    allCells.forEach(cell => {
        expect(isEmptyElement(cell)).toBe(true)
    })
}

export const hasPuzzleStarted = async () => {
    await screen.findByTestId(TIMER_PAUSE_ICON_TEST_ID)
}
