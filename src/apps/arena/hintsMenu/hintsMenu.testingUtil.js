import { waitFor, screen } from '@utils/testing/testingLibrary'
import { HINT_LABELS } from '../utils/smartHints/constants'

import { HINT_MENU_ITEM_TEST_ID } from './hintsMenu.constants'

export const waitForAvailableHintsToBeChecked = async () => {
    // can we wait for it in a better way ??
    await waitFor(() => {
        let enabledHintsCount = 0
        expectOnHintMenuItems(element => {
            try {
                expect(element).not.toBeDisabled()
                enabledHintsCount++
                // eslint-disable-next-line no-empty
            } catch (error) { }
        })

        expect(enabledHintsCount).not.toBe(0)
    })
}

export const expectOnHintMenuItems = expectCallback => {
    const allHintMenuItems = screen.getAllByTestId(HINT_MENU_ITEM_TEST_ID)

    allHintMenuItems.forEach(element => {
        expectCallback(element)
    })
}

export const expectHintToBeEnabledInMenu = hintId => {
    const hintEle = screen.getByText(HINT_LABELS[hintId])
    expect(hintEle).not.toBeDisabled()
}
