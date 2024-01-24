import {
    screen, fireEvent, within,
} from '@utils/testing/testingLibrary'

import {
    getInputPanelNumberIfEnabled,
    getCellByPosition,
    renderScreenAndWaitForPuzzleStart,
} from '@utils/testing/arena'

import {
    openSmartHintHC, gotoTryOutStep, getInputPanel,
} from '@utils/testing/smartHints'

import { SMART_HINT_HC_TEST_ID } from '../../smartHintHC/constants'

import { HINTS_IDS, HINT_LABELS } from '../../utils/smartHints/constants'

jest.mock('../../../../adapters/puzzle/puzzle', () => {
    const originalModule = jest.requireActual('../../../../adapters/puzzle/puzzle')
    const Puzzle = {
        ...originalModule.Puzzle,
        getSudokuPuzzle: () => Promise.resolve({
            clues: [9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 2, 7, 0, 6, 1, 0, 2, 7, 0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 4, 0, 8, 0, 0, 1, 0, 0, 9, 0, 6, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 8, 5, 0, 1, 4, 0, 8, 5, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2],
            solution: [9, 2, 7, 5, 3, 8, 4, 6, 1, 5, 3, 8, 1, 6, 4, 9, 2, 7, 4, 6, 1, 9, 2, 7, 5, 3, 8, 2, 9, 5, 7, 8, 3, 6, 1, 4, 7, 8, 3, 4, 1, 6, 2, 9, 5, 6, 1, 4, 2, 9, 5, 7, 8, 3, 3, 7, 9, 8, 5, 2, 1, 4, 6, 8, 5, 2, 6, 4, 1, 3, 7, 9, 1, 4, 6, 3, 7, 9, 8, 5, 2],
        }),
        validatePuzzle: jest.fn(),
    }
    return { Puzzle }
})

describe('Naked Double', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    test('by default nudge user to input something', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()
        smartHintHC.getByText('try to fill 3 and 9 where it is highlighted in red color to understand why these should be removed')
    })

    test('one naked double note filled where it will stay', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()

        fireEvent.press(getCellByPosition(70))
        fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel()))

        smartHintHC.getByText('3 is filled in H7 without any error. experiment with filling 9 as well to understand where it should be filled and why')
    })

    test('both naked double notes filled where these will stay', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()

        fireEvent.press(getCellByPosition(70))
        fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel()))
        fireEvent.press(getCellByPosition(72))
        fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel()))

        smartHintHC.getByText('3 and 9 are filled in H7 and H9 cells without any error. this is one of many ways to fill these cells with 3 and 9. till now we are not sure what will be the exact solution for these cells but we are sure that 3 and 9 can\'t come in cells other than H7 and H9 in this highlighted region.')
    })

    test('one naked double note makes NAKED SINGLE for both naked double cells', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()

        fireEvent.press(getCellByPosition(71))
        fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel()))

        smartHintHC.getByText(
            '9 is Naked Single for H7 and H9. fill 9 in one of these cells to know the fault in previous steps',
        )
    })

    test('one naked double cell left without any candidate', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()

        fireEvent.press(getCellByPosition(71))
        fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel()))
        fireEvent.press(getCellByPosition(72))
        fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel()))

        smartHintHC.getByText('H7 have no candidate left. in the final solution of puzzle no cell can be empty\nto get back to right track remove 3 from H8. this number doesn\'t belong in this cell')
    })

    test('both naked double cells left without any candidate', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()

        fireEvent.press(getCellByPosition(71))
        fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel()))
        fireEvent.press(getCellByPosition(63))
        fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel()))

        smartHintHC.getByText('H7 and H9 have no candidate left. in the final solution of puzzle no cell can be empty\nto get back to right track remove 9 and 3 from G9 and H8. these numbers don\'t belong in these cells')
    })
})
