import {
    screen, fireEvent, waitFor,
} from '@utils/testing/testingLibrary'
import { getScreenName, renderScreen } from '@utils/testing/renderScreen'

import { ROUTES } from 'src/navigation/route.constants'
import { HEADER_ITEMS, HEADER_ITEM_VS_TEST_ID } from 'src/navigation/headerSection/headerSection.constants'

import {
    hasPuzzleStarted,
    expectOnAllBoardCells,
    expectOnAllBoardControllers,
    expectOnAllInputPanelItems,
    expectOnHintMenuItems,
    getFirstEmptyCell,
    getFirstEnabledInputPanelNumber,
    getInputPanelNumberIfEnabled,
    getInputPanelEraser,
    isNotePresentInCell,
    isMainNumberPresentInCell,
} from '@utils/testing/arena'

import { isEmptyElement } from '@utils/testing/touchable'

import { TIMER_PAUSE_ICON_TEST_ID, TIMER_START_ICON_TEST_ID, TIMER_TEST_ID } from '../timer/timer.constants'
import { ARENA_PAGE_TEST_ID } from '../constants'
import { PREVIOUS_GAME_DATA_KEY } from '../utils/cacheGameHandler'
import { HINTS_MENU_CONTAINER_TEST_ID } from '../hintsMenu/hintsMenu.constants'
import { MISTAKES_TEXT_TEST_ID } from '../refree/refree.constants'
import { BOARD_CELL_TEST_ID } from '../gameBoard/cell/cell.constants'

const storageUtils = require('@utils/storage')

const renderScreenAndWaitForPuzzleStart = async (executeMoreSetupSteps = async () => { }) => {
    renderScreen({
        route: ROUTES.ARENA,
        getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
    })

    await hasPuzzleStarted()

    await executeMoreSetupSteps()
}

describe('Arena Screen', () => {
    // added this to avoid "ReferenceError: You are trying to `import` a file after the Jest environment has been torn down."
    // error due to timer setTimeout
    // TODO: read more about the jest.useFakeTimers() and this cleanup func
    beforeEach(() => {
        jest.useFakeTimers()
        jest.clearAllMocks()
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    test('should go back to home page on back button press', async () => {
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByTestId(HEADER_ITEM_VS_TEST_ID[HEADER_ITEMS.BACK]))

        expect(getScreenName()).toBe(ROUTES.HOME)
    })
})

describe('Timer Click Once', () => {
    beforeEach(() => {
        jest.useFakeTimers()
        jest.clearAllMocks()
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    const clickTimerOnce = () => fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

    test('game is cached', async () => {
        const setKeySpy = jest.spyOn(storageUtils, 'setKey')
        await renderScreenAndWaitForPuzzleStart(clickTimerOnce)

        expect(setKeySpy.mock.calls).toEqual(
            expect.arrayContaining([[PREVIOUS_GAME_DATA_KEY, expect.anything()]]),
        )
    })

    test('all board numbers will be disappeared', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerOnce)

        expectOnAllBoardCells(element => {
            expect(isEmptyElement(element)).toBe(true)
        })
    })

    test('all board controllers will be disabled', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerOnce)

        expectOnAllBoardControllers(element => {
            expect(element).toBeDisabled()
        })
    })

    test('all input panel items will be disabled', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerOnce)

        expectOnAllInputPanelItems(element => {
            expect(element).toBeDisabled()
        })
    })

    test('start the timer icon will be visible', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerOnce)

        expect(screen.getByTestId(TIMER_START_ICON_TEST_ID)).toBeVisible()
    })

    test('timer will be cleared', async () => {
        jest.spyOn(global, 'clearInterval')

        await renderScreenAndWaitForPuzzleStart(clickTimerOnce)

        expect(clearInterval).toHaveBeenCalledTimes(1)
    })
})

describe('Timer Click Twice', () => {
    beforeEach(() => {
        jest.useFakeTimers()
        jest.clearAllMocks()
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    const clickTimerTwice = async () => {
        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        await screen.findByTestId(TIMER_START_ICON_TEST_ID)

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))
    }

    test('numbers will be visible in board cells', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerTwice)

        let filledCellsCount = 0
        const someCellsHaveNumbers = element => {
            if (!isEmptyElement(element)) filledCellsCount++
        }

        expectOnAllBoardCells(someCellsHaveNumbers)

        expect(filledCellsCount).not.toBe(0)
    })

    test('all board controllers will be enabled', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerTwice)

        expectOnAllBoardControllers(element => {
            expect(element).not.toBeDisabled()
        })
    })

    test('all input panel items will be enabled', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerTwice)

        expectOnAllInputPanelItems(element => {
            expect(element).not.toBeDisabled()
        })
    })

    test('pause the timer icon will be visible', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerTwice)

        expect(screen.getByTestId(TIMER_PAUSE_ICON_TEST_ID)).toBeVisible()
    })

    test('timer will be setup', async () => {
        jest.spyOn(global, 'setInterval')

        await renderScreenAndWaitForPuzzleStart(clickTimerTwice)

        expect(setInterval).toHaveBeenCalledTimes(2)
    })
})

describe('Hints Click', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    test('will open hints menu', async () => {
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByText('Hint'))

        screen.getByTestId(HINTS_MENU_CONTAINER_TEST_ID)
    })

    // TODO: this test-case is flawed/brittle, we are not waiting correctly until all the hints are checked
    // research for test-cases of this kind
    test('all hints will be disabled if notes are not present', async () => {
        jest.useRealTimers()
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByText('Hint'))

        await new Promise(r => setTimeout(r, 2000))

        expectOnHintMenuItems(element => {
            expect(element).toBeDisabled()
        })
    })

    // NOTE: test-cases like this might fail in future if the mocked puzzle doesn't have any hints at all
    test('some hints will be enabled if notes are present before opening hints menu', async () => {
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByText('Fast Pencil'))

        fireEvent.press(screen.getByText('Hint'))

        await waitFor(() => {
            let enabledHintsCount = 0
            expectOnHintMenuItems(element => {
                try {
                    expect(element).not.toBeDisabled()
                    enabledHintsCount++
                } catch (error) { }
            })

            expect(enabledHintsCount).not.toBe(0)
        })
    })
})

describe('Board Cell Fill Values', () => {
    test('should fill main number in an empty cell', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const emptyCell = getFirstEmptyCell()
        fireEvent.press(emptyCell)
        const inputPanelItemToPress = getFirstEnabledInputPanelNumber()
        fireEvent.press(inputPanelItemToPress.element)

        isMainNumberPresentInCell(emptyCell, inputPanelItemToPress.inputNumber)
    })

    test('mistakes count will increase on clicking wrong number', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const emptyCell = getFirstEmptyCell()
        fireEvent.press(emptyCell)

        const numberToInputInEmptyCell = 5 // 5 is not the solution of the empty cell above
        fireEvent.press(getInputPanelNumberIfEnabled(numberToInputInEmptyCell))

        expect(screen.getByTestId(MISTAKES_TEXT_TEST_ID)).toHaveTextContent(/Mistakes: 1/)
    })

    test('clicked number wont change clue cell value', async () => {
        await renderScreenAndWaitForPuzzleStart()

        // in mocked puzzle, first cell is filled and it's value is 9
        const clueCell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[0]
        fireEvent.press(clueCell)
        fireEvent.press(getInputPanelNumberIfEnabled(5))

        isMainNumberPresentInCell(clueCell, 9)
    })

    test('clicked number wont change value in correctly filled cell as well', async () => {
        await renderScreenAndWaitForPuzzleStart()

        // in mocked puzzle, second cell is empty and it's solution is 2
        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(getInputPanelNumberIfEnabled(2)) // fill correct value
        fireEvent.press(getInputPanelNumberIfEnabled(9))

        isMainNumberPresentInCell(cell, 2)
    })

    test('clicked number wont change value in wrongly filled cell as well', async () => {
        await renderScreenAndWaitForPuzzleStart()

        // in mocked puzzle, second cell is empty and it's solution is 2
        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(getInputPanelNumberIfEnabled(5)) // fill wrong value
        fireEvent.press(getInputPanelNumberIfEnabled(9))

        isMainNumberPresentInCell(cell, 5)
    })
})

describe('Board Cell Fill Notes', () => {
    test('should fill note in an empty cell if that number is not present in row, col and block', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2)) // 2 can be entered as not in the cell

        expect(isNotePresentInCell(cell, 2)).toBe(true)
    })

    test('will not fill note in an empty cell if that number is present in row, col and block', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(9)) // 9 is present in block and column of this cell

        expect(isNotePresentInCell(cell, 9)).toBe(false)
    })
})

describe('Erase Board Cell Value', () => {
    test('can erase wrongly filled value', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = getFirstEmptyCell()
        fireEvent.press(cell)
        // 5 is not the solution of the empty cell above
        fireEvent.press(getInputPanelNumberIfEnabled(5))
        fireEvent.press(getInputPanelEraser())

        expect(isEmptyElement(cell)).toBe(true)
    })

    test('can not erase correctly filled value', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = getFirstEmptyCell()
        fireEvent.press(cell)
        // 2 is the correct solution of the empty cell above
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelEraser())

        expect(isEmptyElement(cell)).toBe(false)
    })

    test('can not erase clue value', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const clueCell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[0]
        fireEvent.press(clueCell)
        fireEvent.press(getInputPanelEraser())

        expect(isEmptyElement(clueCell)).toBe(false)
    })

    test('erase on empty cell has no effect', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = getFirstEmptyCell()
        fireEvent.press(cell)
        fireEvent.press(getInputPanelEraser())

        expect(isEmptyElement(cell)).toBe(true)
    })
})
