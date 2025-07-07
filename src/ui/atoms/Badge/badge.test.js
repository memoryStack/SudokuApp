import * as React from 'react'

import { render, screen } from '@utils/testing/testingLibrary'

import Badge from './Badge'
import { BADGE_TYPE, BADGE_TEST_ID } from './badge.constants'
import { waitFor } from '@testing-library/react-native'

describe('badge functionality', () => {
    test('for small badges label is ignored', async () => {
        render(<Badge type={BADGE_TYPE.SMALL} label={34789} />)
        await waitFor(() => {
            expect(screen.queryByTestId(BADGE_TEST_ID)).toBeOnTheScreen()
        })
        expect(screen.getByTestId(BADGE_TEST_ID)).toBeEmptyElement()
    })

    test('Styles Overrides', async () => {
        const customStyles = { backgroundColor: 'green' }
        render(
            <Badge
                type={BADGE_TYPE.SMALL}
                styles={customStyles} // TODO: sync these prop names
            />,
        )
        await waitFor(() => {
            expect(screen.queryByTestId(BADGE_TEST_ID)).toBeOnTheScreen()
        })
        expect(screen.getByTestId(BADGE_TEST_ID)).toHaveStyle(customStyles)
    })
})
