/* eslint-disable global-require */
import {
    screen, fireEvent, within,
} from '@utils/testing/testingLibrary'

import {
    renderScreenAndWaitCustomPuzzleToStart,
} from '@utils/testing/arena'

import {
    openSmartHintHC,
} from '@utils/testing/smartHints'

import { SMART_HINT_HC_TEST_ID } from '../../smartHintHC/constants'

import { HINTS_IDS, HINT_LABELS } from '../../utils/smartHints/constants'

jest.mock('../../../../adapters/puzzle/puzzle', () => {
    const Puzzle = {
        getSudokuPuzzle: () => Promise.resolve({
            clues: [0, 0, 0, 1, 0, 0, 3, 0, 8, 0, 9, 0, 0, 8, 0, 0, 2, 0, 3, 0, 0, 0, 0, 6, 1, 9, 7, 2, 0, 0, 0, 7, 0, 0, 0, 0, 0, 7, 9, 5, 3, 8, 2, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 9, 9, 6, 4, 7, 0, 0, 0, 0, 5, 0, 1, 0, 0, 5, 0, 0, 6, 0, 8, 0, 5, 0, 0, 4, 0, 0, 0],
            solution: [4, 2, 6, 1, 9, 7, 3, 5, 8, 1, 9, 7, 3, 8, 5, 4, 2, 6, 3, 5, 8, 4, 2, 6, 1, 9, 7, 2, 4, 1, 6, 7, 9, 5, 8, 3, 6, 7, 9, 5, 3, 8, 2, 4, 1, 5, 8, 3, 2, 4, 1, 6, 7, 9, 9, 6, 4, 7, 1, 2, 8, 3, 5, 7, 1, 2, 8, 5, 3, 9, 6, 4, 8, 3, 5, 9, 6, 4, 7, 1, 2],
        }),
        validatePuzzle: jest.fn(),
    }
    return { Puzzle }
})

describe('X-Chain Hint', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    test('X-Chain hint explaination texts', async () => {
        const puzzle = '000100308090080020300006197200070000079538240000040009964700005010050060805004000'
        const { Puzzle } = require('../../../../adapters/puzzle/puzzle')
        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [4, 2, 6, 1, 9, 7, 3, 5, 8, 1, 9, 7, 3, 8, 5, 4, 2, 6, 3, 5, 8, 4, 2, 6, 1, 9, 7, 2, 4, 1, 6, 7, 9, 5, 8, 3, 6, 7, 9, 5, 3, 8, 2, 4, 1, 5, 8, 3, 2, 4, 1, 6, 7, 9, 9, 6, 4, 7, 1, 2, 8, 3, 5, 7, 1, 2, 8, 5, 3, 9, 6, 4, 8, 3, 5, 9, 6, 4, 7, 1, 2],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_CHAIN])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))

        smartHintHC.getByText('Notice the Chain of cells F4 ➝ F6 ➝ G6 ➝ G5. All of these cells have 2 as their candidate.\nFollow this Chain from F4 to G5, if F4 is not 2 then F6 has to be 2(2 can come only in one of F4 or F6 in F row), G6 can\'t be 2 then G5 has to be 2.')

        fireEvent.press(smartHintHC.getByText('Next'))

        smartHintHC.getByText('another way to fill 2 in this Chain is to fill it in reverse order like if G5 is not 2 then G6 has to be 2, F6 can\'t be 2 then F4 has to be 2.\nin both of these ways either F4 or G5 will definitely be 2, due to this H4 and I4 can\'t be 2 in any way')
    })
})
