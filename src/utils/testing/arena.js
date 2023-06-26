import { BOARD_CELL_TEST_ID } from 'src/apps/arena/gameBoard/cell/cell.constants'
import { TIMER_PAUSE_ICON_TEST_ID } from 'src/apps/arena/timer/timer.constants'
import { BOARD_CONTROLLER_TEST_ID } from 'src/apps/arena/cellActions/cellActions.constants'
import { INPUT_PANEL_CONTAINER_TEST_ID, INPUT_PANEL_ITEM_TEST_ID } from 'src/apps/arena/inputPanel/constants'
import { HINT_MENU_ITEM_TEST_ID } from 'src/apps/arena/hintsMenu/hintsMenu.constants'

import { screen, within } from './testingLibrary'
import { isEmptyElement } from './touchable'

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

export const getFirstEmptyCell = () => screen.getAllByTestId(BOARD_CELL_TEST_ID)
    .find(element => isEmptyElement(element))

export const getFirstEnabledInputPanelNumber = () => {
    const allInputPanelNumbers = screen.getAllByTestId(INPUT_PANEL_ITEM_TEST_ID)

    const enabledInputNumberIndex = allInputPanelNumbers.findIndex(element => {
        let isEnabled = false
        try {
            expect(element).toBeEnabled()
            isEnabled = true
        } catch (error) { }
        return isEnabled
    })

    return {
        inputNumber: enabledInputNumberIndex + 1,
        element: allInputPanelNumbers[enabledInputNumberIndex],
    }
}

export const getInputPanelNumberIfEnabled = inputNumber => {
    const inputPanel = within(screen.getByTestId(INPUT_PANEL_CONTAINER_TEST_ID))
    const element = inputPanel.getByText(String(inputNumber))
    // will fail the test-case if someday mocked puzzle is changed and this
    // requested input number is not enabled for new puzzle
    expect(element).toBeEnabled()
    return element
}

export const getInputPanelEraser = () => screen.getAllByTestId(INPUT_PANEL_ITEM_TEST_ID)[9]
