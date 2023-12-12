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

describe('Finned X-Wing', () => {
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
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()
        smartHintHC.getByText('try to fill 2 where it is highlighted in red color to understand why these should be removed')
    })

    // failed
    test('candidate is filled correctly in one leg', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()
        fireEvent.press(getCellByPosition(49))
        fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel()))

        smartHintHC.getByText('2 might come in F4 cell of 4th column in final solution of puzzle\nexperiment with filling 2 in other places as well where it is highlighted in red or green color')
    })

    test('candidate is filled correctly in both legs', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()
        fireEvent.press(getCellByPosition(49))
        fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel()))
        fireEvent.press(getCellByPosition(34))
        fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel()))

        smartHintHC.getByText('2 is filled in 4th and 7th columns without any error and notice that all the 2s that were in red color are also removed.\nyou can fill 2 in these columns in other combinations as well, in all such combinations all the 2s that were in red color will be removed')
    })

    test('Wrong Fill: no candidate left in a leg', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()
        fireEvent.press(getCellByPosition(42))
        fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel()))

        smartHintHC.getByText('there is no cell in 4th column where 2 can come\nto fix this error, remove 2 from E6')
    })

    test('BUG: in finned X-Wing test possibility of having candidate in same cross house like in perfect X-Wing when some removable candidate was input', async () => {
        const puzzle = '000590034002340000700600002060000007820030065300000020900001003000073900470086000'
        const { Puzzle } = require('../../../../adapters/puzzle/puzzle')
        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [6, 1, 8, 5, 9, 2, 7, 3, 4, 5, 9, 2, 3, 4, 7, 6, 1, 8, 7, 3, 4, 6, 1, 8, 5, 9, 2, 1, 6, 5, 8, 2, 9, 3, 4, 7, 8, 2, 9, 7, 3, 4, 1, 6, 5, 3, 4, 7, 1, 6, 5, 8, 2, 9, 9, 8, 6, 2, 5, 1, 4, 7, 3, 2, 5, 1, 4, 7, 3, 9, 8, 6, 4, 7, 3, 9, 8, 6, 2, 5, 1],
        }))
        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()
        fireEvent.press(getCellByPosition(67))
        fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel()))

        smartHintHC.getByText('now fill 2 in any of G or I rows to understand the error in previous steps')

        Puzzle.validatePuzzle.mockReset()
    })
})
