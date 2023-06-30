import { BOARD_CELL_TEST_ID, CELL_MAIN_VALUE_TEST_ID, CELL_NOTE_TEST_ID } from 'src/apps/arena/gameBoard/cell/cell.constants'
import { TIMER_PAUSE_ICON_TEST_ID } from 'src/apps/arena/timer/timer.constants'
import { BOARD_CONTROLLER_TEST_ID } from 'src/apps/arena/cellActions/cellActions.constants'
import { INPUT_PANEL_CONTAINER_TEST_ID, INPUT_PANEL_ITEM_TEST_ID } from 'src/apps/arena/inputPanel/constants'
import { HINT_MENU_ITEM_TEST_ID } from 'src/apps/arena/hintsMenu/hintsMenu.constants'

import { screen, within, fireEvent } from './testingLibrary'
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

export const getCellByPosition = (position = 0) => screen.getAllByTestId(BOARD_CELL_TEST_ID)[position - 1]

export const isNotePresentInCell = (cellElement, note) => {
    const allNotes = within(cellElement).queryAllByTestId(CELL_NOTE_TEST_ID)

    return allNotes.some(noteElement => {
        let found
        try {
            expect(noteElement).toHaveTextContent(note)
            found = true
        } catch (error) {
            found = false
        }
        return found
    })
}

// TODO: refactor this func, by name looks like it will return boolean
export const isMainNumberPresentInCell = (cellElement, mainNumber) => {
    expect(within(cellElement).getByTestId(CELL_MAIN_VALUE_TEST_ID)).toHaveTextContent(mainNumber)
}

export const isMainNumberNotPresentInCell = (cellElement, mainNumber) => {
    expect(within(cellElement).getByTestId(CELL_MAIN_VALUE_TEST_ID)).not.toHaveTextContent(mainNumber)
}

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

export const solvePuzzle = () => {
    // this will break if in future Fill button is removed in dev mode
    fireEvent.press(screen.getByText('Fill'))
}

export const gameOverByMistakes = () => {
    fireEvent.press(screen.getAllByTestId(BOARD_CELL_TEST_ID)[1])
    fireEvent.press(getInputPanelNumberIfEnabled(3))
    fireEvent.press(getInputPanelEraser())
    fireEvent.press(getInputPanelNumberIfEnabled(3))
    fireEvent.press(getInputPanelEraser())
    fireEvent.press(getInputPanelNumberIfEnabled(3))
}
