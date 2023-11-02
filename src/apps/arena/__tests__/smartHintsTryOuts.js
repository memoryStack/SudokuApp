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

import {
    SMART_HINT_HC_TEST_ID,
} from '../smartHintHC/constants'

import { HINTS_IDS, HINT_LABELS } from '../utils/smartHints/constants'

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
            smartHintHC.getByText('try to fill 3 and 9 where it is highlighted in red color to see why these should be removed')
        })

        test('one naked double note filled where it will stay', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)

            fireEvent.press(getCellByPosition(70))
            fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))

            smartHintHC.getByText('3 is filled in H7 without any error. experiment with filling 9 as well to understand where it should be filled')
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
            smartHintHC.getByText('try to fill 1, 5 and 9 where it is highlighted in red color to see why these should be removed')
        })

        test('one naked tripple note filled where it will stay', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(4))
            fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))

            smartHintHC.getByText('1 is filled in A4 without any error. experiment with filling 5 and 9 as well to understand where these should be filled')
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

            smartHintHC.getByText('9 and 1 are filled in C4 and A4 without any error. experiment with filling 5 as well to understand where it should be filled')
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
            await renderScreenAndWaitCustomPuzzleToStart(puzzle)
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(62))
            fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))

            smartHintHC.getByText('now fill 2 or 3 in any of G7, H7 and I8 cells to know the fault in previous steps')
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
            smartHintHC.getByText('try filling these numbers in the cells where these are highlighted in red or green color to see why green numbers stays and red numbers will be removed')
        })

        test('one group host cell is correctly filled', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(2))
            fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

            smartHintHC.getByText('try filling 7, 3, 4 as well where these are highlighted to find out in which cells 7, 3, 4 can and can\'t come.')
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

            smartHintHC.getByText('7, 2 are filled in A2, A3 cells without any error. so only 7, 2 highlighted in green color stays and other red highlighted numbers can be removed.')
        })

        test('Wrong Fill: insufficient cells for group candidates', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(2))
            fireEvent.press(getInputPanelNumberIfEnabled(4, getInputPanel(smartHintHC)))

            smartHintHC.getByText('2 numbers 7, 2 need to be filled but only 1 empty cell A3 is available for these in the highlighted block. so 1 out of 7, 2 can\'t be filled in this block.')
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

            smartHintHC.getByText('in the highlighted block, there is no cell where 7, 2 can come.')
        })
    })

    describe('Finned X-Wing', () => {
        // TODO: write a test case for REMOVABLE_GROUP_CANDIDATE_FILLED case
        test('by default nudge user to input something', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            smartHintHC.getByText('try filling 2 in 4th and 7th columns to understand why all 2 highlighted in red color can\'t come there and is safe to remove')
        })

        test('candidate is filled correctly in one leg', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(49))
            fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

            smartHintHC.getByText('2 is filled in 4th column without any error, try filling it in other places as well where it is highlighted in red or green color')
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

            smartHintHC.getByText('2 is filled in 4th and 7th columns without error and all the red colored 2s are also removed.')
        })

        test('Wrong Fill: no candidate left in a leg', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(42))
            fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

            smartHintHC.getByText('there is no cell in 4th column where 2 can come')
        })

        test('BUG: in finned X-Wing test possibility of having candidate in same cross house like in perfect X-Wing when some removable candidate was input', async () => {
            const puzzle = '000590034002340000700600002060000007820030065300000020900001003000073900470086000'
            await renderScreenAndWaitCustomPuzzleToStart(puzzle)
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.X_WING])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(67))
            fireEvent.press(getInputPanelNumberIfEnabled(2, getInputPanel(smartHintHC)))

            smartHintHC.getByText('now to fill 2 in G and I rows we have two cells G7 and I7 but both of these cells are in 7th column')
        })
    })

    // TODO: write test-cases for perfect X-Wing
})
