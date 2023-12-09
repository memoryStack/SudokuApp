import {
    screen, fireEvent, waitFor, act, within,
} from '@utils/testing/testingLibrary'

import {
    getInputPanelNumberIfEnabled,
    getInputPanelEraser,
    isNotePresentInCell,
    expectMainNumberPresentInCell,
    getCellByPosition,
    renderScreenAndWaitForPuzzleStart,
    renderScreenAndWaitCustomPuzzleToStart,
} from '@utils/testing/arena'

import { BADGE_TEST_ID } from '@ui/atoms/Badge'

import {
    openSmartHintHC, gotoTryOutStep, getInputPanel, closeSmartHintHC, gotoApplyHintStep, applyHint,
} from '@utils/testing/smartHints'

import { BOTTOM_DRAGGER_OVERLAY_TEST_ID } from '../../components/BottomDragger/bottomDragger.constants'
import { HINTS_MENU_CONTAINER_TEST_ID } from '../hintsMenu/hintsMenu.constants'
import {
    SMART_HINT_HC_TEST_ID,
    CLOSE_ICON_TEST_ID as SMART_HINT_HC_CLOSE_ICON_TEST_ID,
    SMART_HINT_HC_STEP_COUNT_TEXT_TEST_ID,
} from '../smartHintHC/constants'

import { BOARD_CONTROLLER_CONTAINER_TEST_ID } from '../cellActions/cellActions.constants'
import { HINTS_IDS, HINT_LABELS } from '../utils/smartHints/constants'

jest.mock('../../../adapters/puzzle/puzzle', () => {
    const Puzzle = {
        getSudokuPuzzle: () => Promise.resolve({
            clues: [9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 2, 7, 0, 6, 1, 0, 2, 7, 0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 4, 0, 8, 0, 0, 1, 0, 0, 9, 0, 6, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 8, 5, 0, 1, 4, 0, 8, 5, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2],
            solution: [9, 2, 7, 5, 3, 8, 4, 6, 1, 5, 3, 8, 1, 6, 4, 9, 2, 7, 4, 6, 1, 9, 2, 7, 5, 3, 8, 2, 9, 5, 7, 8, 3, 6, 1, 4, 7, 8, 3, 4, 1, 6, 2, 9, 5, 6, 1, 4, 2, 9, 5, 7, 8, 3, 3, 7, 9, 8, 5, 2, 1, 4, 6, 8, 5, 2, 6, 4, 1, 3, 7, 9, 1, 4, 6, 3, 7, 9, 8, 5, 2],
        }),
        validatePuzzle: jest.fn(),
    }
    return { Puzzle }
})

describe('Hint/Smart Hints', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

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

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_SINGLE])

        screen.getByTestId(SMART_HINT_HC_TEST_ID)
    })

    test('clicking on X icon in hint detailed explaination half card will close it', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_SINGLE])
        act(() => {
            fireEvent.press(screen.getByTestId(SMART_HINT_HC_CLOSE_ICON_TEST_ID))
            jest.advanceTimersByTime(200)
        })

        expect(screen.queryByTestId(SMART_HINT_HC_TEST_ID)).not.toBeOnTheScreen()
    })

    test('clicking on background overlay of hint detailed explaination half card will not close it', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_SINGLE])
        act(() => {
            fireEvent.press(screen.getByTestId(BOTTOM_DRAGGER_OVERLAY_TEST_ID))
            jest.advanceTimersByTime(200)
        })

        screen.getByTestId(SMART_HINT_HC_TEST_ID)
    })

    test('clicking on Next Button in smart hint HC will show next page in hint explaination and page count will update', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))

        expect(smartHintHC.getByTestId(SMART_HINT_HC_STEP_COUNT_TEXT_TEST_ID)).toHaveTextContent(/1\//)

        fireEvent.press(smartHintHC.getByText('Next'))

        expect(smartHintHC.getByTestId(SMART_HINT_HC_STEP_COUNT_TEXT_TEST_ID)).toHaveTextContent(/2\//)
    })

    test('clicking on Prev Button in smart hint HC will show Previous page in hint explaination and page count will update', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
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

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_SINGLE])
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

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_SINGLE])
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
        // this puzzle will be solved completely by Naked Singles
        const puzzle = '040300800360007041805200300400090008096578420700020006002004507930700012007002030'

        // eslint-disable-next-line global-require
        const { Puzzle } = require('../../../adapters/puzzle')
        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [2, 4, 1, 3, 6, 9, 8, 7, 5, 3, 6, 9, 8, 5, 7, 2, 4, 1, 8, 7, 5, 2, 4, 1, 3, 6, 9, 4, 2, 3, 1, 9, 6, 7, 5, 8, 1, 9, 6, 5, 7, 8, 4, 2, 3, 7, 5, 8, 4, 2, 3, 1, 9, 6, 6, 1, 2, 9, 3, 4, 5, 8, 7, 9, 3, 4, 7, 8, 5, 6, 1, 2, 5, 8, 7, 6, 1, 2, 9, 3, 4],
        }))
        await renderScreenAndWaitCustomPuzzleToStart(puzzle)

        const boardController = within(screen.getByTestId(BOARD_CONTROLLER_CONTAINER_TEST_ID))
        await waitFor(async () => {
            await applyHint(HINT_LABELS[HINTS_IDS.NAKED_SINGLE])
            expect(boardController.getByTestId(BADGE_TEST_ID)).toHaveTextContent(0)
        }, { timeout: 15000 })
        fireEvent.press(screen.getByText('Hint'))

        expect(screen.queryByTestId(HINTS_MENU_CONTAINER_TEST_ID)).not.toBeOnTheScreen()
    }, 15000)

    test('clicking on Apply Hint will apply the recommended change in puzzle (remove notes)', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.OMISSION])
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

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_SINGLE])
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

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)

        expect(() => fireEvent.press(getInputPanelEraser(getInputPanel(smartHintHC)))).not.toThrow(Error)
    })

    test('in try out step, user can fill numbers in cells and see impact', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
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

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
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

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
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

    test('in try out step, input in cell shoule be able to change by just clicking another number in cell like Custom Puzzle', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(2))
        fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))
        fireEvent.press(getInputPanelNumberIfEnabled(4, getInputPanel(smartHintHC)))

        expectMainNumberPresentInCell(getCellByPosition(2), 4)
    })
})
