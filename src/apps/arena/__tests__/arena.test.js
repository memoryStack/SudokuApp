import {
    screen, fireEvent, waitFor, act, within,
} from '@utils/testing/testingLibrary'
import { getScreenName, renderScreen } from '@utils/testing/renderScreen'

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
    expectMainNumberPresentInCell,
    solvePuzzle,
    gameOverByMistakes,
    getCellByPosition,
} from '@utils/testing/arena'

import { isEmptyElement } from '@utils/testing/touchable'

import { fireLayoutEvent } from '@utils/testing/fireEvent.utils'
import { BADGE_TEST_ID } from '@ui/atoms/Badge'

import { CUSTOMIZE_YOUR_PUZZLE_TITLE } from '@resources/stringLiterals'

import { BOTTOM_DRAGGER_OVERLAY_TEST_ID, CONTENT_CONTAINER_TEST_ID } from '../../components/BottomDragger/bottomDragger.constants'
import { HEADER_ITEMS, HEADER_ITEM_VS_TEST_ID } from '../../../navigation/headerSection/headerSection.constants'
import { ROUTES } from '../../../navigation/route.constants'
import { TIMER_PAUSE_ICON_TEST_ID, TIMER_START_ICON_TEST_ID, TIMER_TEST_ID } from '../timer/timer.constants'
import { ARENA_PAGE_TEST_ID, GAME_OVER_CARD_OVERLAY_TEST_ID } from '../constants'
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

import { waitForAvailableHintsToBeChecked } from '../hintsMenu/hintsMenu.testingUtil'
import { INPUT_PANEL_CONTAINER_TEST_ID, INPUT_PANEL_ITEM_TEST_ID } from '../inputPanel/constants'
import { BOARD_CONTROLLER_CONTAINER_TEST_ID } from '../cellActions/cellActions.constants'
import { decreaseAvailableHintsCount } from '../store/actions/boardController.actions'
import { BoardController } from '../cellActions'
import { CUSTOM_PUZZLE_TEST_ID } from '../customPuzzle/customPuzzle.constants'

const storageUtils = require('@utils/storage')

const renderScreenAndWaitForPuzzleStart = async (executeMoreSetupSteps = async () => { }) => {
    renderScreen({
        route: ROUTES.ARENA,
        getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
    })

    await hasPuzzleStarted()

    await executeMoreSetupSteps()
}

const renderScreenAndWaitCustomPuzzleToStart = async puzzle => {
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

// extremly slow test-suite
describe('Hint/Smart Hints', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    const mockBoardControllersRef = () => {
        // TODO: how to do it by mocking measure function mentioned
        // in "react-native/jest/MockNativeMethods"
        // this implementation contains implementatin details of the component and
        // it's fragile if my imlementation changes or if ReactNativeTestingLibrary changes
        // it's implementation
        const boardControllerDimensionMeasurer = screen.UNSAFE_getByType(BoardController).props.refFromParent.current.measure
        boardControllerDimensionMeasurer.mockImplementation(cb => {
            cb(0, 0, 392.72, 50.90, 0, 551.27)
        })
    }

    const openSmartHintHC = async hintItemToClick => {
        mockBoardControllersRef()
        fireEvent.press(screen.getByText('Fast Pencil'))
        fireEvent.press(screen.getByText('Hint'))
        await waitForAvailableHintsToBeChecked()
        fireEvent.press(screen.getByText(hintItemToClick))

        await waitFor(() => {
            screen.getByTestId(SMART_HINT_HC_TEST_ID)
        })

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

    test('by default 3 hints will be available', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const boardController = within(screen.getByTestId(BOARD_CONTROLLER_CONTAINER_TEST_ID))

        expect(boardController.getByTestId(BADGE_TEST_ID)).toHaveTextContent(3)
    })

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

        expectMainNumberPresentInCell(getCellByPosition(11), 3)
    })

    test('clicking on Apply Hint will decrease the number of available hints', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Naked Single')
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoApplyHintStep(smartHintHC)

        const boardController = within(screen.getByTestId(BOARD_CONTROLLER_CONTAINER_TEST_ID))
        expect(boardController.getByTestId(BADGE_TEST_ID)).toHaveTextContent(3)

        act(() => {
            fireEvent.press(smartHintHC.getByText('Apply Hint'))
            jest.advanceTimersByTime(200)
        })

        expect(boardController.getByTestId(BADGE_TEST_ID)).toHaveTextContent(2)
    })

    test('hints menu will not be opened once available hints are 0', async () => {
        await renderScreenAndWaitForPuzzleStart()

        // exhaust all hints, using this approach of setting store directly
        //  to make this test-case faster
        const boardController = within(screen.getByTestId(BOARD_CONTROLLER_CONTAINER_TEST_ID))
        await waitFor(() => {
            // coupled with implementation detail
            decreaseAvailableHintsCount()
            expect(boardController.getByTestId(BADGE_TEST_ID)).toHaveTextContent(0)
        })
        fireEvent.press(screen.getByText('Hint'))

        expect(screen.queryByTestId(HINTS_MENU_CONTAINER_TEST_ID)).not.toBeOnTheScreen()
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

    test('BugFix: erasing without selecting any cell will crash app', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC('Hidden Double')
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)

        expect(() => fireEvent.press(getInputPanelEraser(getInputPanel(smartHintHC)))).not.toThrow(Error)
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

        expectMainNumberPresentInCell(getCellByPosition(2), 2)
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

        expectMainNumberPresentInCell(getCellByPosition(3), 3)

        closeSmartHintHC()
        // TODO: right now there is no query to run which tells that a Main number is not
        //          present in the cell, so using note's availability in 3rd cell here as a proxy for that
        expect(isNotePresentInCell(getCellByPosition(3), 3)).toBe(true)
    })

    describe('Smart Hints try-out msgs', () => {
        describe('Naked Double', () => {
            test('by default nudge user to input something', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Double')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                smartHintHC.getByText('try filling 3 or 9 in the cells where it is highlighted in red or green color to see why this hint works')
            })

            test('one naked double note filled where it will stay', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Double')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)

                fireEvent.press(getCellByPosition(70))
                fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))

                smartHintHC.getByText('fill 9 as well to find where these numbers can\'t come in the highlighted region.')
            })

            test('both naked double notes filled where these will stay', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Double')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)

                fireEvent.press(getCellByPosition(70))
                fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(72))
                fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

                smartHintHC.getByText('3 and 9 are filled in these cells without any error. now we are sure that 3 and 9 can\'t come in cells where these were highlighted in red')
            })

            test('one naked double note makes NAKED SINGLE for both naked double cells', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Double')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)

                fireEvent.press(getCellByPosition(71))
                fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))

                smartHintHC.getByText(
                    '9 is Naked Single for H7 and H9. if we try to fill it in one of these cells then other cell will have to be empty. so the current arrangement of numbers is wrong',
                )
            })

            test('one naked double cell left without any candidate', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Double')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)

                fireEvent.press(getCellByPosition(71))
                fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(72))
                fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

                smartHintHC.getByText('H7 have no candidate left. in the final solution no cell can be empty so, the current arrangement of numbers is invalid')
            })

            test('both naked double cells left without any candidate', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Double')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)

                fireEvent.press(getCellByPosition(71))
                fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(63))
                fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

                smartHintHC.getByText('H7 and H9 have no candidate left. in the final solution no cell can be empty so, the current arrangement of numbers is invalid')
            })
        })

        describe('Naked Tripple', () => {
            // TODO: write a test case where all the host cells will be empty

            beforeEach(() => {
                jest.useFakeTimers()
            })
            afterEach(() => {
                jest.useRealTimers()
            })

            test('by default nudge user to input something', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Tripple')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                smartHintHC.getByText('try filling 1, 5 or 9 in the cells where it is highlighted in red or green color to see why this hint works')
            })

            test('one naked tripple note filled where it will stay', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Tripple')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(4))
                fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))

                smartHintHC.getByText('fill 5 and 9 as well to find where these numbers can\'t come in the highlighted region.')
            })

            test('two naked tripple notes filled where these will stay', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Tripple')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(4))
                fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(22))
                fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

                smartHintHC.getByText('fill 5 as well to find where these numbers can\'t come in the highlighted region.')
            })

            test('all naked tripple notes filled where these will stay', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Tripple')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(4))
                fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(22))
                fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(13))
                fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))

                smartHintHC.getByText('1, 5 and 9 are filled in these cells without any error. now we are sure that 1, 5 and 9 can\'t come in cells where these were highlighted in red')
            })

            test('Wrong Fill: Naked Single in a group host cell will create NS in other group host cells with same candidate', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Tripple')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(14))
                fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

                smartHintHC.getByText('5 is the Naked Single in C4 because of this A4 and B4 will have 1 as Naked Single in them, which will result in invalid solution')
            })

            test('Wrong Fill: 2 group host cells have Naked Single in them and 3rd group host cells will become empty', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Tripple')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(40))
                fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))

                smartHintHC.getByText('1 and 9 are Naked Singles in A4 and C4 respectively. because of this B4 can\'t have 1 or 9 and it will be empty, which is invalid')
            })

            test('Wrong Fill: 2 group host cells have Naked Double in them and 3rd group host cells will become empty', async () => {
                const puzzle = '409300781320700409700000000600050000050871040000040002000000008506007094178004506'
                await renderScreenAndWaitCustomPuzzleToStart(puzzle)
                await openSmartHintHC('Naked Tripple')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(62))
                fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))

                smartHintHC.getByText('2 and 3 make a Naked Double in H7 and I8 cells. because of this rule 2 and 3 can\'t come in G7 and it will be empty')
            })

            test('Wrong Fill: Naked Single in 2 group host cells with same candidate', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Tripple')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(40))
                fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(4))
                fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))

                smartHintHC.getByText('9 is Naked Single for B4 and C4. if we try to fill it in one of these cells then other cell will have to be empty. so the current arrangement of numbers is wrong')
            })

            test('Wrong Fill: Naked Single in 2 group host cells with same candidate', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Tripple')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(40))
                fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(4))
                fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))

                smartHintHC.getByText('9 is Naked Single for B4 and C4. if we try to fill it in one of these cells then other cell will have to be empty. so the current arrangement of numbers is wrong')
            })

            test('Wrong Fill: 1 group host cell has no candidate left', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Tripple')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(40))
                fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(4))
                fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(13))
                fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

                smartHintHC.getByText('C4 have no candidate left. in the final solution no cell can be empty so, the current arrangement of numbers is invalid')
            })

            test('Wrong Fill: 2 group host cell have no candidate left', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Tripple')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(40))
                fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(4))
                fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(14))
                fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

                smartHintHC.getByText('B4 and C4 have no candidate left. in the final solution no cell can be empty so, the current arrangement of numbers is invalid')
            })

            test('Wrong Fill: if a group host cell is empty and other 2 host cells have NS in them with same candidate then empty group host cell error result will take precedence', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Naked Tripple')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(40))
                fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(14))
                fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

                smartHintHC.getByText('C4 have no candidate left. in the final solution no cell can be empty so, the current arrangement of numbers is invalid')
            })
        })

        describe('Hidden Double', () => {
            // TODO: write a test case for REMOVABLE_GROUP_CANDIDATE_FILLED case
            test('by default nudge user to input something', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Hidden Double')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                smartHintHC.getByText('try filling these numbers in the cells where these are highlighted in red or green color to see why green numbers stays and red numbers will be removed')
            })

            test('one group host cell is correctly filled', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Hidden Double')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(2))
                fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

                smartHintHC.getByText('try filling 7, 3, 4 as well where these are highlighted to find out in which cells 7, 3, 4 can and can\'t come.')
            })

            test('all group host cells are correctly filled', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Hidden Double')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(2))
                fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(3))
                fireEvent.press(getInputPanelNumberIfEnabled(7, getInputPanel(smartHintHC)))

                smartHintHC.getByText('7, 2 are filled in A2, A3 cells without any error. so only 7, 2 highlighted in green color stays and other red highlighted numbers can be removed.')
            })

            test('Wrong Fill: insufficient cells for group candidates', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Hidden Double')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(2))
                fireEvent.press(getInputPanelNumberIfEnabled(4, getInputPanel(smartHintHC)))

                smartHintHC.getByText('2 numbers 7, 2 need to be filled but only 1 empty cell A3 is available for these in the highlighted block. so 1 out of 7, 2 can\'t be filled in this block.')
            })

            test('Wrong Fill: no cells for group candidates', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('Hidden Double')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(2))
                fireEvent.press(getInputPanelNumberIfEnabled(4, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(3))
                fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))

                smartHintHC.getByText('in the highlighted block, there is no cell where 7, 2 can come.')
            })
        })

        describe('Finned X-Wing', () => {
            // TODO: write a test case for REMOVABLE_GROUP_CANDIDATE_FILLED case
            test('by default nudge user to input something', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('X-Wing')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                smartHintHC.getByText('try filling 2 in 4th and 7th columns to understand why all 2 highlighted in red color can\'t come there and is safe to remove')
            })

            test('candidate is filled correctly in one leg', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('X-Wing')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(49))
                fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

                smartHintHC.getByText('2 is filled in 4th column without any error, try filling it in other places as well where it is highlighted in red or green color')
            })

            test('candidate is filled correctly in both legs', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('X-Wing')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(49))
                fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))
                fireEvent.press(getCellByPosition(34))
                fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

                smartHintHC.getByText('2 is filled in 4th and 7th columns without error and all the red colored 2s are also removed.')
            })

            test('Wrong Fill: no candidate left in a leg', async () => {
                await renderScreenAndWaitForPuzzleStart()
                await openSmartHintHC('X-Wing')
                const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
                await gotoTryOutStep(smartHintHC)
                fireEvent.press(getCellByPosition(42))
                fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

                smartHintHC.getByText('there is no cell in 4th column where 2 can come')
            })
        })

        // TODO: write test-cases for perfect X-Wing
    })
})

describe('Board Cell Fill Values', () => {
    test('should fill main number in an empty cell', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const emptyCell = getFirstEmptyCell()
        fireEvent.press(emptyCell)
        const inputPanelItemToPress = getFirstEnabledInputPanelNumber()
        fireEvent.press(inputPanelItemToPress.element)

        expectMainNumberPresentInCell(emptyCell, inputPanelItemToPress.inputNumber)
    })

    test('mistakes count will remain same on filling correct number', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const emptyCell = getFirstEmptyCell()
        fireEvent.press(emptyCell)

        expect(screen.getByTestId(MISTAKES_TEXT_TEST_ID)).toHaveTextContent(/Mistakes: 0/)

        const numberToInputInEmptyCell = 2 // 2 is correct solution of the empty cell above
        fireEvent.press(getInputPanelNumberIfEnabled(numberToInputInEmptyCell))

        expect(screen.getByTestId(MISTAKES_TEXT_TEST_ID)).toHaveTextContent(/Mistakes: 0/)
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

        expectMainNumberPresentInCell(clueCell, 9)
    })

    test('clicked number wont change value in correctly filled cell as well', async () => {
        await renderScreenAndWaitForPuzzleStart()

        // in mocked puzzle, second cell is empty and it's solution is 2
        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(getInputPanelNumberIfEnabled(2)) // fill correct value
        fireEvent.press(getInputPanelNumberIfEnabled(9))

        expectMainNumberPresentInCell(cell, 2)
    })

    test('clicked number wont change value in wrongly filled cell as well', async () => {
        await renderScreenAndWaitForPuzzleStart()

        // in mocked puzzle, second cell is empty and it's solution is 2
        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(getInputPanelNumberIfEnabled(5)) // fill wrong value
        fireEvent.press(getInputPanelNumberIfEnabled(9))

        expectMainNumberPresentInCell(cell, 5)
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
        expectMainNumberPresentInCell(cell, 2)
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

describe('Start New Game', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    test('select new game from New Game button on game over card ', async () => {
        await renderScreenAndWaitForPuzzleStart()

        solvePuzzle()
        act(() => {
            fireEvent.press(screen.getByText('New Game'))
            jest.advanceTimersByTime(200)
        })
        const newGameMenu = within(screen.getByTestId(NEXT_GAME_MENU_TEST_ID))
        fireEvent.press(newGameMenu.getByText('EASY'))

        await hasPuzzleStarted()
    })

    test('if new game is not selected and game over card is dismissed then Next Game menu will be opened by itself', async () => {
        await renderScreenAndWaitForPuzzleStart()

        solvePuzzle()
        act(() => {
            fireEvent.press(screen.getByTestId(GAME_OVER_CARD_OVERLAY_TEST_ID))
            jest.advanceTimersByTime(200)
        })
        const newGameMenu = within(screen.getByTestId(NEXT_GAME_MENU_TEST_ID))
        fireEvent.press(newGameMenu.getByText('EASY'))

        await hasPuzzleStarted()
    })
})
