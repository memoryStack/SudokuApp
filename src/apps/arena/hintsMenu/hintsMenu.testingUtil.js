import { waitFor } from '@utils/testing/testingLibrary'

import { expectOnHintMenuItems } from '@utils/testing/arena'

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
