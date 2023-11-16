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
    openSmartHintHC, gotoTryOutStep, getInputPanel, closeSmartHintHC,
} from '@utils/testing/smartHints'

import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'
import { SMART_HINT_HC_TEST_ID } from '../smartHintHC/constants'

import { HINTS_IDS, HINT_LABELS } from '../utils/smartHints/constants'

jest.mock('fast-sudoku-puzzles', () => ({
    RNSudokuPuzzle: {
        getSudokuPuzzle: () => Promise.resolve(
            {
                clues: [
                    9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0,
                    0, 0, 4, 0, 2, 7, 0, 6, 1, 0, 2, 7,
                    0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 4,
                    0, 8, 0, 0, 1, 0, 0, 9, 0, 6, 0, 0,
                    0, 0, 0, 7, 8, 0, 0, 0, 0, 8, 5, 0,
                    1, 4, 0, 8, 5, 0, 6, 0, 0, 0, 0, 0,
                    0, 0, 0, 3, 0, 0, 0, 0, 2,
                ],
                solution: [
                    9, 2, 7, 5, 3, 8, 4, 6, 1, 5, 3, 8,
                    1, 6, 4, 9, 2, 7, 4, 6, 1, 9, 2, 7,
                    5, 3, 8, 2, 9, 5, 7, 8, 3, 6, 1, 4,
                    7, 8, 3, 4, 1, 6, 2, 9, 5, 6, 1, 4,
                    2, 9, 5, 7, 8, 3, 3, 7, 9, 8, 5, 2,
                    1, 4, 6, 8, 5, 2, 6, 4, 1, 3, 7, 9,
                    1, 4, 6, 3, 7, 9, 8, 5, 2,
                ],
            },
        ),
        validatePuzzle: jest.fn(),
    },
}))

describe('Smart Hints try-out msgs', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    describe('Naked Double', () => {
        test('by default nudge user to input something', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            smartHintHC.getByText('try to fill 3 and 9 where it is highlighted in red color to understand why these should be removed')
        })

        test('one naked double note filled where it will stay', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)

            fireEvent.press(getCellByPosition(70))
            fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))

            smartHintHC.getByText('3 is filled in H7 without any error. experiment with filling 9 as well to understand where it should be filled and why')
        })

        test('both naked double notes filled where these will stay', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)

            fireEvent.press(getCellByPosition(70))
            fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))
            fireEvent.press(getCellByPosition(72))
            fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

            smartHintHC.getByText('3 and 9 are filled in H7 and H9 cells without any error. this is one of many ways to fill these cells with 3 and 9. till now we are not sure what will be the exact solution for these cells but we are sure that 3 and 9 can\'t come in cells other than H7 and H9 in this highlighted region.')
        })

        test('one naked double note makes NAKED SINGLE for both naked double cells', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)

            fireEvent.press(getCellByPosition(71))
            fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))

            smartHintHC.getByText(
                '9 is Naked Single for H7 and H9. fill 9 in one of these cells to know the fault in previous steps',
            )
        })

        test('one naked double cell left without any candidate', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)

            fireEvent.press(getCellByPosition(71))
            fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))
            fireEvent.press(getCellByPosition(72))
            fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

            smartHintHC.getByText('H7 have no candidate left. in the final solution of puzzle no cell can be empty\nto get back to right track remove 3 from H8. this number doesn\'t belong in this cell')
        })

        test('both naked double cells left without any candidate', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)

            fireEvent.press(getCellByPosition(71))
            fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))
            fireEvent.press(getCellByPosition(63))
            fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

            smartHintHC.getByText('H7 and H9 have no candidate left. in the final solution of puzzle no cell can be empty\nto get back to right track remove 9 and 3 from G9 and H8. these numbers don\'t belong in these cells')
        })
    })

    describe('Naked Tripple', () => {
        beforeEach(() => {
            jest.useFakeTimers()
        })
        afterEach(() => {
            jest.useRealTimers()
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

            RNSudokuPuzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
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

            RNSudokuPuzzle.validatePuzzle.mockReset()
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

    describe('Hidden Double', () => {
        // TODO: write a test case for REMOVABLE_GROUP_CANDIDATE_FILLED case
        test('by default nudge user to input something', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            smartHintHC.getByText('try to fill numbers highlighted in red color to understand why these should be removed from these cells')
        })

        test('one group host cell is correctly filled', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(2))
            fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

            smartHintHC.getByText('2 is filled in A2 without any error. experiment with filling 3, 4, 7 as well to understand where these can or can\'t be filled')
        })

        test('all group host cells are correctly filled', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(2))
            fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))
            fireEvent.press(getCellByPosition(3))
            fireEvent.press(getInputPanelNumberIfEnabled(7, getInputPanel(smartHintHC)))

            smartHintHC.getByText('2, 7 are filled in A2, A3 cells without any error. this is one of many ways to fill these cells with 2, 7. till now we are not sure what will be the exact solution for these cells but we are sure that 2, 7 can\'t come in cells other than A2, A3 in this highlighted region.')
        })

        test('Wrong Fill: insufficient cells for group candidates', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(2))
            fireEvent.press(getInputPanelNumberIfEnabled(4, getInputPanel(smartHintHC)))

            smartHintHC.getByText('2, 7 need to be filled but only A3 is available for these in 1st block. so 1 out of 2, 7 can\'t be filled in this 1st block.\nto fix this error, remove 4 from A2')
        })

        test('Wrong Fill: no cells for group candidates', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(2))
            fireEvent.press(getInputPanelNumberIfEnabled(4, getInputPanel(smartHintHC)))
            fireEvent.press(getCellByPosition(3))
            fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))

            smartHintHC.getByText('in 1st block 2, 7 can\'t come in any cell\nto fix this error, remove 4, 3 from A2, A3')
        })
    })

    describe('Finned X-Wing', () => {
        // TODO: write a test case for REMOVABLE_GROUP_CANDIDATE_FILLED case
        test('by default nudge user to input something', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            smartHintHC.getByText('try to fill 2 where it is highlighted in red color to understand why these should be removed')
        })

        // failed
        test('candidate is filled correctly in one leg', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(49))
            fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

            smartHintHC.getByText('2 might come in F4 cell of 4th column in final solution of puzzle\nexperiment with filling 2 in other places as well where it is highlighted in red or green color')
        })

        test('candidate is filled correctly in both legs', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(49))
            fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))
            fireEvent.press(getCellByPosition(34))
            fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

            smartHintHC.getByText('2 is filled in 4th and 7th columns without any error and notice that all the 2s that were in red color are also removed.\nyou can fill 2 in these columns in other combinations as well, in all such combinations all the 2s that were in red color will be removed')
        })

        test('Wrong Fill: no candidate left in a leg', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(42))
            fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

            smartHintHC.getByText('there is no cell in 4th column where 2 can come\nto fix this error, remove 2 from E6')
        })

        test('BUG: in finned X-Wing test possibility of having candidate in same cross house like in perfect X-Wing when some removable candidate was input', async () => {
            const puzzle = '000590034002340000700600002060000007820030065300000020900001003000073900470086000'
            RNSudokuPuzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
                count: 1,
                solution: [6, 1, 8, 5, 9, 2, 7, 3, 4, 5, 9, 2, 3, 4, 7, 6, 1, 8, 7, 3, 4, 6, 1, 8, 5, 9, 2, 1, 6, 5, 8, 2, 9, 3, 4, 7, 8, 2, 9, 7, 3, 4, 1, 6, 5, 3, 4, 7, 1, 6, 5, 8, 2, 9, 9, 8, 6, 2, 5, 1, 4, 7, 3, 2, 5, 1, 4, 7, 3, 9, 8, 6, 4, 7, 3, 9, 8, 6, 2, 5, 1],
            }))
            await renderScreenAndWaitCustomPuzzleToStart(puzzle)
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(67))
            fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

            smartHintHC.getByText('now fill 2 in any of G or I rows to understand the error in previous steps')

            RNSudokuPuzzle.validatePuzzle.mockReset()
        })
    })

    // TODO: write test-cases for perfect X-Wing
})

describe('Bug:', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    test('Undo possible notes as well on undo click', async () => {
        const puzzle = '900060401060340000000085200800576010070010090010892006009720000000034050103050008'

        RNSudokuPuzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [9, 8, 5, 2, 6, 7, 4, 3, 1, 2, 6, 7, 3, 4, 1, 9, 8, 5, 4, 3, 1, 9, 8, 5, 2, 6, 7, 8, 9, 2, 5, 7, 6, 3, 1, 4, 5, 7, 6, 4, 1, 3, 8, 9, 2, 3, 1, 4, 8, 9, 2, 5, 7, 6, 6, 5, 9, 7, 2, 8, 1, 4, 3, 7, 2, 8, 1, 3, 4, 6, 5, 9, 1, 4, 3, 6, 5, 9, 7, 2, 8],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_TRIPPLE])
        let smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))

        smartHintHC.getByText('a Hidden Tripple is formed when three candidates are present together only in three cells and nowhere else in any row, column or block.\neach of these three cells must have atleast two out of these three candidates.\nObserve 3, 5 and 8 in A row')

        closeSmartHintHC()

        fireEvent.press(getCellByPosition(17))

        fireEvent.press(getInputPanelNumberIfEnabled(8))

        fireEvent.press(screen.getByText('Undo'))

        await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_TRIPPLE])

        smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
        smartHintHC.getByText('a Hidden Tripple is formed when three candidates are present together only in three cells and nowhere else in any row, column or block.\neach of these three cells must have atleast two out of these three candidates.\nObserve 3, 5 and 8 in A row')

        RNSudokuPuzzle.validatePuzzle.mockReset()
    })
})
