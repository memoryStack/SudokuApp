/* eslint-disable global-require */
import {
    screen, fireEvent, within,
} from '@utils/testing/testingLibrary'

import {
    getInputPanelNumberIfEnabled,
    getCellByPosition,
    renderScreenAndWaitForPuzzleStart,
    renderScreenAndWaitCustomPuzzleToStart,
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

describe('Naked Tripple', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    test('by default nudge user to input something', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        smartHintHC.getByText('try to fill 1, 5 and 9 where it is highlighted in red color to understand why these should be removed')
    })

    test('one naked tripple note filled where it will stay', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(4))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))

        smartHintHC.getByText('1 is filled in A4 without any error. experiment with filling 5 and 9 as well to understand where these should be filled and why')
    })

    test('two naked tripple notes filled where these will stay', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(4))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))
        fireEvent.press(getCellByPosition(22))
        fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

        smartHintHC.getByText('9 and 1 are filled in C4 and A4 without any error. experiment with filling 5 as well to understand where it should be filled and why')
    })

    test('all naked tripple notes filled where these will stay', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(4))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))
        fireEvent.press(getCellByPosition(22))
        fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))
        fireEvent.press(getCellByPosition(13))
        fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))

        smartHintHC.getByText('1, 5 and 9 are filled in A4, B4 and C4 cells without any error. this is one of many ways to fill these cells with 1, 5 and 9. till now we are not sure what will be the exact solution for these cells but we are sure that 1, 5 and 9 can\'t come in cells other than A4, B4 and C4 in this highlighted region.')
    })

    test('Wrong Fill: Naked Single in a group host cell will create NS in other group host cells with same candidate', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(14))
        fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

        smartHintHC.getByText('now fill 5 in C4 to know the fault in previous steps')
    })

    test('Wrong Fill: 2 group host cells have Naked Single in them and 3rd group host cells will become empty', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(40))
        fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))

        smartHintHC.getByText('now fill 1 and 9 in A4 and C4 respectively to know the fault in previous steps')
    })

    test('Wrong Fill: 2 group host cells have Naked Double in them and 3rd group host cells will become empty', async () => {
        const puzzle = '409300781320700409700000000600050000050871040000040002000000008506007094178004506'

        const { Puzzle } = require('../../../../adapters/puzzle/puzzle')

        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [4, 6, 9, 3, 2, 5, 7, 8, 1, 3, 2, 5, 7, 1, 8, 4, 6, 9, 7, 8, 1, 4, 6, 9, 3, 2, 5, 6, 4, 3, 9, 5, 2, 8, 1, 7, 9, 5, 2, 8, 7, 1, 6, 4, 3, 8, 1, 7, 6, 4, 3, 9, 5, 2, 2, 9, 4, 5, 3, 6, 1, 7, 8, 5, 3, 6, 1, 8, 7, 2, 9, 4, 1, 7, 8, 2, 9, 4, 5, 3, 6],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(62))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))

        smartHintHC.getByText('now fill 2 or 3 in any of G7, H7 and I8 cells to know the fault in previous steps')

        Puzzle.validatePuzzle.mockReset()
    })

    test('Wrong Fill: Naked Single in 2 group host cells with same candidate', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(40))
        fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))
        fireEvent.press(getCellByPosition(4))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))

        smartHintHC.getByText('9 is Naked Single for B4 and C4. fill 9 in one of these cells to know the fault in previous steps')
    })

    test('Wrong Fill: 1 group host cell has no candidate left', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(40))
        fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))
        fireEvent.press(getCellByPosition(4))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))
        fireEvent.press(getCellByPosition(13))
        fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

        smartHintHC.getByText('C4 have no candidate left. in the final solution of puzzle no cell can be empty\nto get back to right track remove 5 from E4. this number doesn\'t belong in this cell')
    })

    test('Wrong Fill: 2 group host cell have no candidate left', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(40))
        fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))
        fireEvent.press(getCellByPosition(4))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))
        fireEvent.press(getCellByPosition(14))
        fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

        smartHintHC.getByText('B4 and C4 have no candidate left. in the final solution of puzzle no cell can be empty\nto get back to right track remove 9 and 5 from B5 and E4. these numbers don\'t belong in these cells')
    })

    test('Wrong Fill: if a group host cell is empty and other 2 host cells have NS in them with same candidate then empty group host cell error result will take precedence', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep(smartHintHC)
        fireEvent.press(getCellByPosition(40))
        fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))
        fireEvent.press(getCellByPosition(14))
        fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

        smartHintHC.getByText('C4 have no candidate left. in the final solution of puzzle no cell can be empty\nto get back to right track remove 9 and 5 from B5 and E4. these numbers don\'t belong in these cells')
    })
})
