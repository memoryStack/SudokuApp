import * as React from 'react'

import { render, screen } from '@utils/testing/testingLibrary'

import Badge from './Badge'
import { BADGE_TYPE, BADGE_TEST_ID } from './badge.constants'

describe('badge functionality', () => {
    test('for small badges label is ignored', () => {
        render(<Badge type={BADGE_TYPE.SMALL} label={34789} />)

        expect(screen.getByTestId(BADGE_TEST_ID)).toBeEmptyElement()
    })

    test('Styles Overrides', () => {
        const customStyles = { backgroundColor: 'green' }
        render(
            <Badge
                type={BADGE_TYPE.SMALL}
                styles={customStyles} // TODO: sync these prop names
            />,
        )

        expect(screen.getByTestId(BADGE_TEST_ID)).toHaveStyle(customStyles)
    })
})
