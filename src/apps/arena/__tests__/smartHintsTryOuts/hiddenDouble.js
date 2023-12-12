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
    const Puzzle = {
        getSudokuPuzzle: () => Promise.resolve({
            clues: [9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 2, 7, 0, 6, 1, 0, 2, 7, 0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 4, 0, 8, 0, 0, 1, 0, 0, 9, 0, 6, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 8, 5, 0, 1, 4, 0, 8, 5, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2],
            solution: [9, 2, 7, 5, 3, 8, 4, 6, 1, 5, 3, 8, 1, 6, 4, 9, 2, 7, 4, 6, 1, 9, 2, 7, 5, 3, 8, 2, 9, 5, 7, 8, 3, 6, 1, 4, 7, 8, 3, 4, 1, 6, 2, 9, 5, 6, 1, 4, 2, 9, 5, 7, 8, 3, 3, 7, 9, 8, 5, 2, 1, 4, 6, 8, 5, 2, 6, 4, 1, 3, 7, 9, 1, 4, 6, 3, 7, 9, 8, 5, 2],
        }),
        validatePuzzle: jest.fn(),
    }
    return { Puzzle }
})

describe('Hidden Double', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    // TODO: write a test case for REMOVABLE_GROUP_CANDIDATE_FILLED case
    test('by default nudge user to input something', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()
        smartHintHC.getByText('try to fill numbers highlighted in red color to understand why these should be removed from these cells')
    })

    test('one group host cell is correctly filled', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()
        fireEvent.press(getCellByPosition(2))
        fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel()))

        smartHintHC.getByText('2 is filled in A2 without any error. experiment with filling 3, 4, 7 as well to understand where these can or can\'t be filled')
    })

    test('all group host cells are correctly filled', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()
        fireEvent.press(getCellByPosition(2))
        fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel()))
        fireEvent.press(getCellByPosition(3))
        fireEvent.press(getInputPanelNumberIfEnabled(7, getInputPanel()))

        smartHintHC.getByText('2, 7 are filled in A2, A3 cells without any error. this is one of many ways to fill these cells with 2, 7. till now we are not sure what will be the exact solution for these cells but we are sure that 2, 7 can\'t come in cells other than A2, A3 in this highlighted region.')
    })

    test('Wrong Fill: insufficient cells for group candidates', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()
        fireEvent.press(getCellByPosition(2))
        fireEvent.press(getInputPanelNumberIfEnabled(4, getInputPanel()))

        smartHintHC.getByText('2, 7 need to be filled but only A3 is available for these in 1st block. so 1 out of 2, 7 can\'t be filled in this 1st block.\nto fix this error, remove 4 from A2')
    })

    test('Wrong Fill: no cells for group candidates', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()
        fireEvent.press(getCellByPosition(2))
        fireEvent.press(getInputPanelNumberIfEnabled(4, getInputPanel()))
        fireEvent.press(getCellByPosition(3))
        fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel()))

        smartHintHC.getByText('in 1st block 2, 7 can\'t come in any cell\nto fix this error, remove 4, 3 from A2, A3')
    })
})
