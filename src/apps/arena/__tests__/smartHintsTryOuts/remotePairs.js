/* eslint-disable global-require */
import {
    screen, fireEvent, within,
} from '@utils/testing/testingLibrary'

import {
    getCellByPosition,
    getInputPanelNumberIfEnabled,
    renderScreenAndWaitCustomPuzzleToStart,
} from '@utils/testing/arena'

import {
    getInputPanel,
    gotoTryOutStep,
    openSmartHintHC,
} from '@utils/testing/smartHints'

import { SMART_HINT_HC_TEST_ID } from '../../smartHintHC/constants'

import { HINTS_IDS, HINT_LABELS } from '../../utils/smartHints/constants'

jest.mock('../../../../adapters/puzzle/puzzle', () => {
    const originalModule = jest.requireActual('../../../../adapters/puzzle/puzzle')
    const Puzzle = {
        ...originalModule.Puzzle,
        getSudokuPuzzle: jest.fn(),
        validatePuzzle: jest.fn(),
    }
    return { Puzzle }
})

describe('Remote Pairs Hint', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    test('Remote Pairs hint explaination texts', async () => {
        const puzzle = '080023400620409508410085020040906082068542000290038654154267893872394165936851247'
        const { Puzzle } = require('../../../../adapters/puzzle/puzzle')
        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [5, 8, 9, 1, 2, 3, 4, 7, 6, 6, 2, 3, 4, 7, 9, 5, 1, 8, 4, 1, 7, 6, 8, 5, 3, 2, 9, 3, 4, 5, 9, 1, 6, 7, 8, 2, 7, 6, 8, 5, 4, 2, 9, 3, 1, 2, 9, 1, 7, 3, 8, 6, 5, 4, 1, 5, 4, 2, 6, 7, 8, 9, 3, 8, 7, 2, 3, 9, 4, 1, 6, 5, 9, 3, 6, 8, 5, 1, 2, 4, 7],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.REMOTE_PAIRS])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))

        smartHintHC.getByText('Notice the Chain of cells B5 ➝ D5 ➝ F4 ➝ F3. All of these cells have 1 and 7 as their candidates. Follow this Chain from B5 to F3, all of these cells will be filled either by candidates in green or by candidates in blue')

        fireEvent.press(smartHintHC.getByText('Next'))

        smartHintHC.getByText('Fill numbers in these cells any way you want, candidates highlighted in red color will always be removed.\nFor Example, in B3 7 can\'t come because 1 and 7 will always fill B5 and F3')
    })
})

describe('Remote Pairs Try-Out', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    test('no inputs are filled in try-out', async () => {
        const puzzle = '080023400620409508410085020040906082068542000290038654154267893872394165936851247'
        const { Puzzle } = require('../../../../adapters/puzzle/puzzle')
        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [5, 8, 9, 1, 2, 3, 4, 7, 6, 6, 2, 3, 4, 7, 9, 5, 1, 8, 4, 1, 7, 6, 8, 5, 3, 2, 9, 3, 4, 5, 9, 1, 6, 7, 8, 2, 7, 6, 8, 5, 4, 2, 9, 3, 1, 2, 9, 1, 7, 3, 8, 6, 5, 4, 1, 5, 4, 2, 6, 7, 8, 9, 3, 8, 7, 2, 3, 9, 4, 1, 6, 5, 9, 3, 6, 8, 5, 1, 2, 4, 7],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.REMOTE_PAIRS])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()

        smartHintHC.getByText('try to fill candidates highlighted in red color to see why these should be removed')
    })

    test('removable note is filled in cell', async () => {
        const puzzle = '080023400620409508410085020040906082068542000290038654154267893872394165936851247'
        const { Puzzle } = require('../../../../adapters/puzzle/puzzle')
        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [5, 8, 9, 1, 2, 3, 4, 7, 6, 6, 2, 3, 4, 7, 9, 5, 1, 8, 4, 1, 7, 6, 8, 5, 3, 2, 9, 3, 4, 5, 9, 1, 6, 7, 8, 2, 7, 6, 8, 5, 4, 2, 9, 3, 1, 2, 9, 1, 7, 3, 8, 6, 5, 4, 1, 5, 4, 2, 6, 7, 8, 9, 3, 8, 7, 2, 3, 9, 4, 1, 6, 5, 9, 3, 6, 8, 5, 1, 2, 4, 7],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.REMOTE_PAIRS])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()

        fireEvent.press(getCellByPosition(12))
        fireEvent.press(getInputPanelNumberIfEnabled(7, getInputPanel()))

        smartHintHC.getByText('now fill Chain cells in the sequence given by arrows to understand why 7 shouldn\'t be filled in B3')
    })

    test('partially filled chain', async () => {
        const puzzle = '080023400620409508410085020040906082068542000290038654154267893872394165936851247'
        const { Puzzle } = require('../../../../adapters/puzzle/puzzle')
        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [5, 8, 9, 1, 2, 3, 4, 7, 6, 6, 2, 3, 4, 7, 9, 5, 1, 8, 4, 1, 7, 6, 8, 5, 3, 2, 9, 3, 4, 5, 9, 1, 6, 7, 8, 2, 7, 6, 8, 5, 4, 2, 9, 3, 1, 2, 9, 1, 7, 3, 8, 6, 5, 4, 1, 5, 4, 2, 6, 7, 8, 9, 3, 8, 7, 2, 3, 9, 4, 1, 6, 5, 9, 3, 6, 8, 5, 1, 2, 4, 7],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.REMOTE_PAIRS])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()

        fireEvent.press(getCellByPosition(14))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel()))

        smartHintHC.getByText('till now you have filled Chain cells correctly. fill other cells as well to fully understand this technique')
    })

    test('fully filled chain', async () => {
        const puzzle = '080023400620409508410085020040906082068542000290038654154267893872394165936851247'
        const { Puzzle } = require('../../../../adapters/puzzle/puzzle')
        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [5, 8, 9, 1, 2, 3, 4, 7, 6, 6, 2, 3, 4, 7, 9, 5, 1, 8, 4, 1, 7, 6, 8, 5, 3, 2, 9, 3, 4, 5, 9, 1, 6, 7, 8, 2, 7, 6, 8, 5, 4, 2, 9, 3, 1, 2, 9, 1, 7, 3, 8, 6, 5, 4, 1, 5, 4, 2, 6, 7, 8, 9, 3, 8, 7, 2, 3, 9, 4, 1, 6, 5, 9, 3, 6, 8, 5, 1, 2, 4, 7],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.REMOTE_PAIRS])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()

        fireEvent.press(getCellByPosition(14))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel()))
        fireEvent.press(getCellByPosition(32))
        fireEvent.press(getInputPanelNumberIfEnabled(7, getInputPanel()))
        fireEvent.press(getCellByPosition(49))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel()))
        fireEvent.press(getCellByPosition(48))
        fireEvent.press(getInputPanelNumberIfEnabled(7, getInputPanel()))

        smartHintHC.getByText('yayy! you have successfully filled all the cells in the Chain. this is one of the solutions to fill these cells. also notice that all the candidates highlighted in red color from B3 are removed. try to fill these Chain cells in another way and you will find that the result will be same.')
    })

    test('multi color numbers are filled in chain', async () => {
        const puzzle = '080023400620409508410085020040906082068542000290038654154267893872394165936851247'
        const { Puzzle } = require('../../../../adapters/puzzle/puzzle')
        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [5, 8, 9, 1, 2, 3, 4, 7, 6, 6, 2, 3, 4, 7, 9, 5, 1, 8, 4, 1, 7, 6, 8, 5, 3, 2, 9, 3, 4, 5, 9, 1, 6, 7, 8, 2, 7, 6, 8, 5, 4, 2, 9, 3, 1, 2, 9, 1, 7, 3, 8, 6, 5, 4, 1, 5, 4, 2, 6, 7, 8, 9, 3, 8, 7, 2, 3, 9, 4, 1, 6, 5, 9, 3, 6, 8, 5, 1, 2, 4, 7],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.REMOTE_PAIRS])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()

        fireEvent.press(getCellByPosition(14))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel()))
        fireEvent.press(getCellByPosition(48))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel()))

        smartHintHC.getByText('Chain cells are filled with both colors numbers. keep filling the Chain to understand why it will be filled by same color numbers only')
    })

    test('multi color numbers are filled and some cell in chain is left without candidates', async () => {
        const puzzle = '080023400620409508410085020040906082068542000290038654154267893872394165936851247'
        const { Puzzle } = require('../../../../adapters/puzzle/puzzle')
        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [5, 8, 9, 1, 2, 3, 4, 7, 6, 6, 2, 3, 4, 7, 9, 5, 1, 8, 4, 1, 7, 6, 8, 5, 3, 2, 9, 3, 4, 5, 9, 1, 6, 7, 8, 2, 7, 6, 8, 5, 4, 2, 9, 3, 1, 2, 9, 1, 7, 3, 8, 6, 5, 4, 1, 5, 4, 2, 6, 7, 8, 9, 3, 8, 7, 2, 3, 9, 4, 1, 6, 5, 9, 3, 6, 8, 5, 1, 2, 4, 7],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.REMOTE_PAIRS])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()

        fireEvent.press(getCellByPosition(14))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel()))
        fireEvent.press(getCellByPosition(48))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel()))
        fireEvent.press(getCellByPosition(49))
        fireEvent.press(getInputPanelNumberIfEnabled(7, getInputPanel()))

        smartHintHC.getByText('no candidates are left for D5. to fix this error either remove number from B5 or from F4, F3 because this Chain can be filled by same colors numbers only otherwise some cells will be left without any candidates.')
    })

    test('multi color numbers are filled and removable notes are also filled and due to this some cell in chain is left without candidates', async () => {
        const puzzle = '080023400620409508410085020040906082068542000290038654154267893872394165936851247'
        const { Puzzle } = require('../../../../adapters/puzzle/puzzle')
        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [5, 8, 9, 1, 2, 3, 4, 7, 6, 6, 2, 3, 4, 7, 9, 5, 1, 8, 4, 1, 7, 6, 8, 5, 3, 2, 9, 3, 4, 5, 9, 1, 6, 7, 8, 2, 7, 6, 8, 5, 4, 2, 9, 3, 1, 2, 9, 1, 7, 3, 8, 6, 5, 4, 1, 5, 4, 2, 6, 7, 8, 9, 3, 8, 7, 2, 3, 9, 4, 1, 6, 5, 9, 3, 6, 8, 5, 1, 2, 4, 7],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.REMOTE_PAIRS])
        const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        await gotoTryOutStep()

        fireEvent.press(getCellByPosition(12))
        fireEvent.press(getInputPanelNumberIfEnabled(7, getInputPanel()))
        fireEvent.press(getCellByPosition(14))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel()))
        fireEvent.press(getCellByPosition(48))
        fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel()))
        fireEvent.press(getCellByPosition(49))
        fireEvent.press(getInputPanelNumberIfEnabled(7, getInputPanel()))

        smartHintHC.getByText('no candidates are left for D5. to fill numbers in Chain cells properly, first remove number from B3 and then you will have to erase some numbers from Chain cells as well so that Chain cells are filled by same color numbers only')
    })
})
