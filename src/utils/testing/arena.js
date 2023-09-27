import { CUSTOMIZE_YOUR_PUZZLE_TITLE } from '@resources/stringLiterals'
import { ROUTES } from '../../navigation/route.constants'
import { ARENA_PAGE_TEST_ID } from '../../apps/arena/constants'
import { CONTENT_CONTAINER_TEST_ID } from '../../apps/components/BottomDragger/bottomDragger.constants'
import { CUSTOM_PUZZLE_TEST_ID } from '../../apps/arena/customPuzzle/customPuzzle.constants'
import { BOARD_CELL_TEST_ID, CELL_MAIN_VALUE_TEST_ID, CELL_NOTE_TEST_ID } from '../../apps/arena/gameBoard/cell/cell.constants'
import { TIMER_PAUSE_ICON_TEST_ID } from '../../apps/arena/timer/timer.constants'
import { BOARD_CONTROLLER_TEST_ID } from '../../apps/arena/cellActions/cellActions.constants'
import { INPUT_PANEL_CONTAINER_TEST_ID, INPUT_PANEL_ITEM_TEST_ID } from '../../apps/arena/inputPanel/constants'
import { HINT_MENU_ITEM_TEST_ID } from '../../apps/arena/hintsMenu/hintsMenu.constants'

import {
    screen, within, fireEvent, act, waitFor,
} from './testingLibrary'
import { isEmptyElement } from './touchable'
import { renderScreen } from './renderScreen'
import { fireLayoutEvent } from './fireEvent.utils'

export const renderScreenAndWaitForPuzzleStart = async (executeMoreSetupSteps = async () => { }) => {
    renderScreen({
        route: ROUTES.ARENA,
        getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
    })

    await hasPuzzleStarted()

    await executeMoreSetupSteps()
}

export const renderScreenAndWaitCustomPuzzleToStart = async puzzle => {
    renderScreen({
        route: ROUTES.ARENA,
        getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
        routeOptions: { selectedGameMenuItem: CUSTOMIZE_YOUR_PUZZLE_TITLE },
    })

    act(() => {
        fireLayoutEvent(screen.getByTestId(CONTENT_CONTAINER_TEST_ID), {
            width: 400,
            height: 700,
            x: 0,
            y: 0,
        })
        jest.advanceTimersByTime(500)
    })

    const customPuzzleContainer = within(screen.getByTestId(CUSTOM_PUZZLE_TEST_ID))
    const inputPanel = within(customPuzzleContainer.getByTestId(INPUT_PANEL_CONTAINER_TEST_ID))
    for (let i = 0; i < puzzle.length; i++) {
        if (puzzle[i] !== '0') {
            const cell = getCellByPosition(i + 1, customPuzzleContainer)
            fireEvent.press(cell)
            fireEvent.press(getInputPanelNumberIfEnabled(parseInt(puzzle[i], 10), inputPanel))
            act(() => {
                jest.advanceTimersByTime(500)
            })
        }
    }

    fireEvent.press(customPuzzleContainer.getByText('Play'))

    await waitFor(() => {
        expect(screen.queryByTestId(CUSTOM_PUZZLE_TEST_ID)).not.toBeOnTheScreen()
    }, { timeout: 5000 })

    await hasPuzzleStarted()
}

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

export const getCellByPosition = (position = 1, container = screen) => container.getAllByTestId(BOARD_CELL_TEST_ID)[position - 1]

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
export const expectMainNumberPresentInCell = (cellElement, mainNumber) => {
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
            // eslint-disable-next-line no-empty
        } catch (error) { }
        return isEnabled
    })

    return {
        inputNumber: enabledInputNumberIndex + 1,
        element: allInputPanelNumbers[enabledInputNumberIndex],
    }
}

export const getInputPanelNumberIfEnabled = (inputNumber, _inputPanel) => {
    const inputPanel = _inputPanel || within(screen.getByTestId(INPUT_PANEL_CONTAINER_TEST_ID))

    const element = inputPanel.getByText(String(inputNumber))
    // will fail the test-case if someday mocked puzzle is changed and this
    // requested input number is not enabled for new puzzle

    expect(element).toBeEnabled()
    return element
}

export const getInputPanelEraser = _inputPanel => {
    const inputPanel = _inputPanel || within(screen.getByTestId(INPUT_PANEL_CONTAINER_TEST_ID))
    const allItems = inputPanel.getAllByTestId(INPUT_PANEL_ITEM_TEST_ID)
    return allItems[allItems.length - 1]
}

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
