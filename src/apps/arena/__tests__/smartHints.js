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
} from '@utils/testing/arena'

import { BADGE_TEST_ID } from '@ui/atoms/Badge'

import {
    openSmartHintHC, gotoTryOutStep, getInputPanel, closeSmartHintHC, gotoApplyHintStep,
} from '@utils/testing/smartHints'

import { BOTTOM_DRAGGER_OVERLAY_TEST_ID } from '../../components/BottomDragger/bottomDragger.constants'
import { HINTS_MENU_CONTAINER_TEST_ID } from '../hintsMenu/hintsMenu.constants'
import {
    SMART_HINT_HC_TEST_ID,
    CLOSE_ICON_TEST_ID as SMART_HINT_HC_CLOSE_ICON_TEST_ID,
    SMART_HINT_HC_STEP_COUNT_TEXT_TEST_ID,
} from '../smartHintHC/constants'

import { BOARD_CONTROLLER_CONTAINER_TEST_ID } from '../cellActions/cellActions.constants'
import { decreaseAvailableHintsCount } from '../store/actions/boardController.actions'
import { HINTS_IDS, HINT_LABELS } from '../utils/smartHints/constants'

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
})
