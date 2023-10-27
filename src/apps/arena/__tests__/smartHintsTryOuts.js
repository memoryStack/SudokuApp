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
            smartHintHC.getByText('try filling 3 or 9 in the cells where it is highlighted in red or green color to see why this hint works')
        })

        test('one naked double note filled where it will stay', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)

            fireEvent.press(getCellByPosition(70))
            fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))

            smartHintHC.getByText('fill 9 as well to find where these numbers can\'t come in the highlighted region.')
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

            smartHintHC.getByText('3 and 9 are filled in these cells without any error. now we are sure that 3 and 9 can\'t come in cells where these were highlighted in red')
        })

        test('one naked double note makes NAKED SINGLE for both naked double cells', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_DOUBLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)

            fireEvent.press(getCellByPosition(71))
            fireEvent.press(getInputPanelNumberIfEnabled(3, getInputPanel(smartHintHC)))

            smartHintHC.getByText(
                '9 is Naked Single for H7 and H9. if we try to fill it in one of these cells then other cell will have to be empty. so the current arrangement of numbers is wrong',
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

            smartHintHC.getByText('H7 have no candidate left. in the final solution no cell can be empty so, the current arrangement of numbers is invalid')
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

            smartHintHC.getByText('H7 and H9 have no candidate left. in the final solution no cell can be empty so, the current arrangement of numbers is invalid')
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
            smartHintHC.getByText('try filling 1, 5 or 9 in the cells where it is highlighted in red or green color to see why this hint works')
        })

        test('one naked tripple note filled where it will stay', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(4))
            fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))

            smartHintHC.getByText('fill 5 and 9 as well to find where these numbers can\'t come in the highlighted region.')
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

            smartHintHC.getByText('fill 5 as well to find where these numbers can\'t come in the highlighted region.')
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

            smartHintHC.getByText('1, 5 and 9 are filled in these cells without any error. now we are sure that 1, 5 and 9 can\'t come in cells where these were highlighted in red')
        })

        test('Wrong Fill: Naked Single in a group host cell will create NS in other group host cells with same candidate', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(14))
            fireEvent.press(getInputPanelNumberIfEnabled(9, getInputPanel(smartHintHC)))

            smartHintHC.getByText('5 is the Naked Single in C4 because of this A4 and B4 will have 1 as Naked Single in them, which will result in invalid solution')
        })

        test('Wrong Fill: 2 group host cells have Naked Single in them and 3rd group host cells will become empty', async () => {
            await renderScreenAndWaitForPuzzleStart()
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(40))
            fireEvent.press(getInputPanelNumberIfEnabled(5, getInputPanel(smartHintHC)))

            smartHintHC.getByText('1 and 9 are Naked Singles in A4 and C4 respectively. because of this B4 can\'t have 1 or 9 and it will be empty, which is invalid')
        })

        test('Wrong Fill: 2 group host cells have Naked Double in them and 3rd group host cells will become empty', async () => {
            const puzzle = '409300781320700409700000000600050000050871040000040002000000008506007094178004506'
            await renderScreenAndWaitCustomPuzzleToStart(puzzle)
            await openSmartHintHC(HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE])
            const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
            await gotoTryOutStep(smartHintHC)
            fireEvent.press(getCellByPosition(62))
            fireEvent.press(getInputPanelNumberIfEnabled(1, getInputPanel(smartHintHC)))

            smartHintHC.getByText('2 and 3 make a Naked Double in H7 and I8 cells. because of this rule 2 and 3 can\'t come in G7 and it will be empty')
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

            smartHintHC.getByText('9 is Naked Single for B4 and C4. if we try to fill it in one of these cells then other cell will have to be empty. so the current arrangement of numbers is wrong')
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

            smartHintHC.getByText('9 is Naked Single for B4 and C4. if we try to fill it in one of these cells then other cell will have to be empty. so the current arrangement of numbers is wrong')
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

            smartHintHC.getByText('C4 have no candidate left. in the final solution no cell can be empty so, the current arrangement of numbers is invalid')
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

            smartHintHC.getByText('B4 and C4 have no candidate left. in the final solution no cell can be empty so, the current arrangement of numbers is invalid')
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

            smartHintHC.getByText('C4 have no candidate left. in the final solution no cell can be empty so, the current arrangement of numbers is invalid')
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
