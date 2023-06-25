import { BOARD_CELL_TEST_ID } from 'src/apps/arena/gameBoard/cell/cell.constants'
import { TIMER_PAUSE_ICON_TEST_ID } from 'src/apps/arena/timer/timer.constants'
import { BOARD_CONTROLLER_TEST_ID } from 'src/apps/arena/cellActions/cellActions.constants'
import { INPUT_PANEL_ITEM_TEST_ID } from 'src/apps/arena/inputPanel/constants'
import { HINT_MENU_ITEM_TEST_ID } from 'src/apps/arena/hintsMenu/hintsMenu.constants'

import { screen } from './testingLibrary'

export const hasPuzzleStarted = async () => {
    await screen.findByTestId(TIMER_PAUSE_ICON_TEST_ID)
}

export const expectOnAllBoardCells = expectCallback => {
    const allCellElements = screen.getAllByTestId(BOARD_CELL_TEST_ID)
    allCellElements.forEach(element => {
        expectCallback(element)
    })
}

export const expectOnAllBoardControllers = expectCallback => {
    const allBoardControllers = screen.getAllByTestId(BOARD_CONTROLLER_TEST_ID)

    allBoardControllers.forEach(element => {
        expectCallback(element)
    })
}

export const expectOnAllInputPanelItems = expectCallback => {
    const allInputPanelItems = screen.getAllByTestId(INPUT_PANEL_ITEM_TEST_ID)

    allInputPanelItems.forEach(element => {
        expectCallback(element)
    })
}

export const expectOnHintMenuItems = expectCallback => {
    const allHintMenuItems = screen.getAllByTestId(HINT_MENU_ITEM_TEST_ID)

    allHintMenuItems.forEach(element => {
        expectCallback(element)
    })
}
