import {
    screen, fireEvent, waitFor, act, within,
} from '@utils/testing/testingLibrary'
import { getScreenName, renderScreen } from '@utils/testing/renderScreen'

import { ROUTES } from 'src/navigation/route.constants'
import { HEADER_ITEMS, HEADER_ITEM_VS_TEST_ID } from 'src/navigation/headerSection/headerSection.constants'

import {
    hasPuzzleStarted,
    expectOnAllBoardCells,
    expectOnAllBoardControllers,
    expectOnAllInputPanelItems,
    getFirstEmptyCell,
    getFirstEnabledInputPanelNumber,
    getInputPanelNumberIfEnabled,
    getInputPanelEraser,
    isNotePresentInCell,
    isMainNumberPresentInCell,
    solvePuzzle,
    gameOverByMistakes,
    getCellByPosition,
} from '@utils/testing/arena'

import { isEmptyElement } from '@utils/testing/touchable'

import { fireLayoutEvent } from '@utils/testing/fireEvent.utils'
import { BOTTOM_DRAGGER_OVERLAY_TEST_ID } from 'src/apps/components/BottomDragger/bottomDragger.constants'
import { TIMER_PAUSE_ICON_TEST_ID, TIMER_START_ICON_TEST_ID, TIMER_TEST_ID } from '../timer/timer.constants'
import { ARENA_PAGE_TEST_ID } from '../constants'
import { PREVIOUS_GAME_DATA_KEY } from '../utils/cacheGameHandler'
import { HINTS_MENU_CONTAINER_TEST_ID } from '../hintsMenu/hintsMenu.constants'
import { MISTAKES_TEXT_TEST_ID } from '../refree/refree.constants'
import { BOARD_CELL_TEST_ID } from '../gameBoard/cell/cell.constants'
import { NEXT_GAME_MENU_TEST_ID } from '../nextGameMenu/nextGameMenu.constants'
import {
    SMART_HINT_HC_TEST_ID,
    CLOSE_ICON_TEST_ID as SMART_HINT_HC_CLOSE_ICON_TEST_ID,
    SMART_HINT_HC_BOTTOM_DRAGGER_CHILD_TEST_ID,
    SMART_HINT_HC_STEP_COUNT_TEXT_TEST_ID,
} from '../smartHintHC/constants'
import { waitForAvailableHintsToBeChecked } from '../hintsMenu/hintsMenu.test'
import { INPUT_PANEL_CONTAINER_TEST_ID, INPUT_PANEL_ITEM_TEST_ID } from '../inputPanel/constants'

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

describe('Hint/Smart Hints', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    const openSmartHintHC = async hintItemToClick => {
        fireEvent.press(screen.getByText('Fast Pencil'))
        fireEvent.press(screen.getByText('Hint'))
        await waitForAvailableHintsToBeChecked()
        fireEvent.press(screen.getByText(hintItemToClick))
        // TODO: wait for dragger to be opened
        act(() => {
            // event used by BottomDragger component to
            // measure child view dimensions
            fireLayoutEvent(screen.getByTestId(SMART_HINT_HC_BOTTOM_DRAGGER_CHILD_TEST_ID), {
                width: 400,
                height: 200,
                x: 0,
                y: 0,
            })
            // TODO: jest.runAllTimers(), jest.advanceTimersByTime() also works here
            //      need to understand the proper relation of these timers with Animated components
            // TODO: search why jest.runAllTimers() blocks the test cases and runs 1L timers
            // jest.runAllTimers()
            jest.advanceTimersByTime(200)
        })
    }

    const gotoApplyHintStep = async smartHintHC => {
        await waitFor(() => {
            try {
                smartHintHC.getByText('Apply Hint')
            } catch (error) {
                fireEvent.press(smartHintHC.getByText('Next'))
                throw new Error(error)
            }
        })
    }

    const gotoTryOutStep = async smartHintHC => {
        await waitFor(() => {
            try {
                smartHintHC.getAllByTestId(INPUT_PANEL_ITEM_TEST_ID)
            } catch (error) {
                fireEvent.press(smartHintHC.getByText('Next'))
                throw new Error(error)
            }
        })
    }

    const getInputPanel = smartHintHC => within(smartHintHC.getByTestId(INPUT_PANEL_CONTAINER_TEST_ID))

    const closeSmartHintHC = () => {
        act(() => {
            fireEvent.press(screen.getByTestId(SMART_HINT_HC_CLOSE_ICON_TEST_ID))
            jest.advanceTimersByTime(200)
        })
    }

    test('will open hints menu on clicking Hint Button', async () => {
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByText('Hint'))

        screen.getByTestId(HINTS_MENU_CONTAINER_TEST_ID)
    })

    test('clicking on enabled hint item will open hint detailed explaination half card', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Naked Single')

        screen.getByTestId(SMART_HINT_HC_TEST_ID)
    })

    test('clicking on X icon in hint detailed explaination half card will close it', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Naked Single')
        act(() => {
            fireEvent.press(screen.getByTestId(SMART_HINT_HC_CLOSE_ICON_TEST_ID))
            jest.advanceTimersByTime(200)
        })

        expect(screen.queryByTestId(SMART_HINT_HC_TEST_ID)).not.toBeOnTheScreen()
    })

    test('clicking on background overlay of hint detailed explaination half card will not close it', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Naked Single')
        act(() => {
            fireEvent.press(screen.getByTestId(BOTTOM_DRAGGER_OVERLAY_TEST_ID))
            jest.advanceTimersByTime(200)
        })

        screen.getByTestId(SMART_HINT_HC_TEST_ID)
    })

    test('clicking on Next Button in smart hint HC will show next page in hint explaination and page count will update', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Naked Tripple')
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))

        expect(smartHintHC.getByTestId(SMART_HINT_HC_STEP_COUNT_TEXT_TEST_ID)).toHaveTextContent(/1\//)

        fireEvent.press(smartHintHC.getByText('Next'))

        expect(smartHintHC.getByTestId(SMART_HINT_HC_STEP_COUNT_TEXT_TEST_ID)).toHaveTextContent(/2\//)
    })

    test('clicking on Prev Button in smart hint HC will show Previous page in hint explaination and page count will update', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Naked Tripple')
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        fireEvent.press(smartHintHC.getByText('Next'))

        expect(smartHintHC.getByTestId(SMART_HINT_HC_STEP_COUNT_TEXT_TEST_ID)).toHaveTextContent(/2\//)

        fireEvent.press(smartHintHC.getByText('Prev'))

        expect(smartHintHC.getByTestId(SMART_HINT_HC_STEP_COUNT_TEXT_TEST_ID)).toHaveTextContent(/1\//)
    })

    // NOTE: this test is coupled with the algorithm for finding hints. if the order of checking
    //      hints changes then this test case might fail and must be updated
    test('clicking on Apply Hint will apply the recommended change in puzzle (fill a main number)', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Naked Single')
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoApplyHintStep(smartHintHC)

        expect(isNotePresentInCell(getCellByPosition(11), 3)).toBe(true)

        act(() => {
            fireEvent.press(smartHintHC.getByText('Apply Hint'))
            jest.advanceTimersByTime(200)
        })

        isMainNumberPresentInCell(getCellByPosition(11), 3)
    })

    test('clicking on Apply Hint will apply the recommended change in puzzle (remove notes)', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Omission')
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoApplyHintStep(smartHintHC)

        // notes are present before applying hint
        expect(isNotePresentInCell(getCellByPosition(32), 3)).toBe(true)
        expect(isNotePresentInCell(getCellByPosition(50), 3)).toBe(true)

        act(() => {
            fireEvent.press(smartHintHC.getByText('Apply Hint'))
            jest.advanceTimersByTime(200)
        })

        expect(isNotePresentInCell(getCellByPosition(32), 3)).toBe(false)
        expect(isNotePresentInCell(getCellByPosition(50), 3)).toBe(false)
    })

    test('clicking on Apply Hint will close the smart hint HC', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Naked Single')
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoApplyHintStep(smartHintHC)
        act(() => {
            fireEvent.press(smartHintHC.getByText('Apply Hint'))
            jest.advanceTimersByTime(200)
        })

        expect(screen.queryByTestId(SMART_HINT_HC_TEST_ID)).not.toBeOnTheScreen()
    })

    test('in try out step, user can fill numbers in cells and see impact', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Hidden Double')
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(2))

        // before filling the number
        expect(isNotePresentInCell(getCellByPosition(3), 2)).toBe(true)

        fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

        isMainNumberPresentInCell(getCellByPosition(2), 2)
        expect(isNotePresentInCell(getCellByPosition(3), 2)).toBe(false)
    })

    test('in try out step, user can remove the filled numbers as well from cells', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Hidden Double')
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(3))
        fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))
        fireEvent.press(getInputPanelEraser(getInputPanel(smartHintHC)))

        // main number will be removed and note will return in
        // TODO: right now there is no query to run which tells that a Main number is not
        //          present in the cell, so using note's availability in 3rd cell here as a proxy for that
        expect(isNotePresentInCell(getCellByPosition(3), 3)).toBe(true)
        expect(isNotePresentInCell(getCellByPosition(2), 3)).toBe(true)
    })

    test('in try out step, changes made in board by user will not be reflected in main puzzle', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Hidden Double')
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(3))
        fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))

        isMainNumberPresentInCell(getCellByPosition(3), 3)

        closeSmartHintHC()
        // TODO: right now there is no query to run which tells that a Main number is not
        //          present in the cell, so using note's availability in 3rd cell here as a proxy for that
        expect(isNotePresentInCell(getCellByPosition(3), 3)).toBe(true)
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

    test('try filling a note two times will actually erase that note after filling on first click', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))

        expect(isNotePresentInCell(cell, 2)).toBe(true)

        fireEvent.press(getInputPanelNumberIfEnabled(2))

        expect(isNotePresentInCell(cell, 2)).toBe(false)
    })
})

describe('Board Cell fill MainValue in Notes filled cell', () => {
    test('will remove notes and show main value', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))

        expect(isNotePresentInCell(cell, 2)).toBe(false)
        expect(isNotePresentInCell(cell, 3)).toBe(false)
        isMainNumberPresentInCell(cell, 2)
    })
})

describe('Erase Board Cell Main Number', () => {
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

describe('Erase Board Cell Notes', () => {
    test('eraser will erase all the notes in cell', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(getInputPanelNumberIfEnabled(4))
        fireEvent.press(getInputPanelEraser())

        expect(isNotePresentInCell(cell, 2)).toBe(false)
        expect(isNotePresentInCell(cell, 3)).toBe(false)
        expect(isNotePresentInCell(cell, 4)).toBe(false)
    })
})

describe('Fast Pencil', () => {
    test('will add all possible notes to all the empty cells', async () => {
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByText('Fast Pencil'))

        // assuming if it works for two random cells then will work for other cells as well
        const cellA = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        expect(isNotePresentInCell(cellA, 2)).toBe(true)
        expect(isNotePresentInCell(cellA, 3)).toBe(true)
        expect(isNotePresentInCell(cellA, 4)).toBe(true)
        expect(isNotePresentInCell(cellA, 7)).toBe(true)

        const cellB = screen.getAllByTestId(BOARD_CELL_TEST_ID)[53]
        expect(isNotePresentInCell(cellB, 1)).toBe(true)
        expect(isNotePresentInCell(cellB, 3)).toBe(true)
        expect(isNotePresentInCell(cellB, 5)).toBe(true)

        expectOnAllBoardCells(element => {
            expect(isEmptyElement(element)).toBe(false)
        })
    })

    test('will add all remaining notes to partially filled notes in cell', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(screen.getByText('Fast Pencil'))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(true)
        expect(isNotePresentInCell(cell, 4)).toBe(true)
        expect(isNotePresentInCell(cell, 7)).toBe(true)
    })
})

describe('Undo', () => {
    test('will remove correctly filled main number', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(screen.getByText('Undo'))

        expect(isEmptyElement(cell)).toBe(true)
    })

    test('will remove wrongly filled main number as well', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(screen.getByText('Undo'))

        expect(isEmptyElement(cell)).toBe(true)
    })

    test('will remove filled notes one by one on each click', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(true)

        fireEvent.press(screen.getByText('Undo'))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(false)

        fireEvent.press(screen.getByText('Undo'))

        expect(isNotePresentInCell(cell, 2)).toBe(false)
        expect(isNotePresentInCell(cell, 3)).toBe(false)
    })

    test('will bring back removed main number from cell', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(getInputPanelNumberIfEnabled(3)) // only wrongly filled main numbers can be removed
        fireEvent.press(getInputPanelEraser())
        fireEvent.press(screen.getByText('Undo'))

        expect(cell).toHaveTextContent(3)
    })

    test('will bring back removed notes from cell', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(getInputPanelEraser())
        fireEvent.press(screen.getByText('Undo'))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(true)
    })

    test('will bring back the notes which were present before filling main number', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))

        expect(isNotePresentInCell(cell, 2)).toBe(false)
        expect(isNotePresentInCell(cell, 3)).toBe(false)

        fireEvent.press(screen.getByText('Undo'))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(true)
    })

    test('will bring back the note which was removed by toggling the note', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(screen.getByText('Undo'))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(true)
    })

    test('will remove notes added by Fast Pencil click, rest will survive', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2)) // add notes by normal pencil
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(screen.getByText('Fast Pencil'))
        fireEvent.press(screen.getByText('Undo'))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(true)
        expect(isEmptyElement(screen.getAllByTestId(BOARD_CELL_TEST_ID)[53])).toBe(true)
    })
})

describe('Game Over Card', () => {
    test('clicking on NewGame Button after puzzle was solved will open Next Game Menu to start new puzzle', async () => {
        await renderScreenAndWaitForPuzzleStart()

        solvePuzzle()
        fireEvent.press(screen.getByText('New Game'))

        await waitFor(() => {
            expect(screen.getByTestId(NEXT_GAME_MENU_TEST_ID)).toBeVisible()
        })
    })

    test('clicking on NewGame Button after puzzle was not solved will open Next Game Menu to start new puzzle', async () => {
        await renderScreenAndWaitForPuzzleStart()

        gameOverByMistakes()
        fireEvent.press(screen.getByText('New Game'))

        await waitFor(() => {
            expect(screen.getByTestId(NEXT_GAME_MENU_TEST_ID)).toBeVisible()
        })
    })
})
