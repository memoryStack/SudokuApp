/* eslint-disable global-require */
import {
    screen, fireEvent, within,
} from '@utils/testing/testingLibrary'

import {
    getInputPanelNumberIfEnabled,
    getCellByPosition,
    renderScreenAndWaitCustomPuzzleToStart,
} from '@utils/testing/arena'

import {
    openSmartHintHC, closeSmartHintHC,
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

describe('Fixed Bug:', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    test('Undo possible notes as well on undo click', async () => {
        const puzzle = '900060401060340000000085200800576010070010090010892006009720000000034050103050008'
        const { Puzzle } = require('../../../../adapters/puzzle/puzzle')
        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [9, 8, 5, 2, 6, 7, 4, 3, 1, 2, 6, 7, 3, 4, 1, 9, 8, 5, 4, 3, 1, 9, 8, 5, 2, 6, 7, 8, 9, 2, 5, 7, 6, 3, 1, 4, 5, 7, 6, 4, 1, 3, 8, 9, 2, 3, 1, 4, 8, 9, 2, 5, 7, 6, 6, 5, 9, 7, 2, 8, 1, 4, 3, 7, 2, 8, 1, 3, 4, 6, 5, 9, 1, 4, 3, 6, 5, 9, 7, 2, 8],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_TRIPPLE])
        let smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))

        smartHintHC.getByText('a Hidden Tripple is formed when three candidates are present together only in three cells and nowhere else in any house.\neach of these three cells must have atleast two out of these three candidates.\nObserve 3, 5 and 8 in A row')

        closeSmartHintHC()

        fireEvent.press(getCellByPosition(17))

        fireEvent.press(getInputPanelNumberIfEnabled(8))

        fireEvent.press(screen.getByText('Undo'))

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_TRIPPLE])

        smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        smartHintHC.getByText('a Hidden Tripple is formed when three candidates are present together only in three cells and nowhere else in any house.\neach of these three cells must have atleast two out of these three candidates.\nObserve 3, 5 and 8 in A row')

        Puzzle.validatePuzzle.mockReset()
    }, 10000)
})
