import { BOARD_CELL_TEST_ID } from 'src/apps/arena/gameBoard/cell/cell.constants'
import { TIMER_PAUSE_ICON_TEST_ID } from 'src/apps/arena/timer/timer.constants'
import { BOARD_CONTROLLER_TEST_ID } from 'src/apps/arena/cellActions/cellActions.constants'

import { INPUT_PANEL_ITEM_TEST_ID } from 'src/apps/arena/inputPanel/constants'
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

export const allBoardControllersDisabled = () => {
    const allBoardControllers = screen.getAllByTestId(BOARD_CONTROLLER_TEST_ID)

    allBoardControllers.forEach(element => {
        expect(element).toBeDisabled()
    })
}

export const allInputPanelItemsAreDisabled = () => {
    const allInputPanelItems = screen.getAllByTestId(INPUT_PANEL_ITEM_TEST_ID)

    allInputPanelItems.forEach(element => {
        expect(element).toBeDisabled()
    })
}
