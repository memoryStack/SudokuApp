import * as React from 'react'

import { render, screen } from '@utils/testing/testingLibrary'

import Badge from './Badge'
import { BADGE_TYPE, BADGE_TEST_ID } from './badge.constants'

test('snapshot for small badge', () => {
    const tree = render(<Badge type={BADGE_TYPE.SMALL} />).toJSON()

    expect(tree).toMatchSnapshot()
})

test('snapshot for large badge', () => {
    const tree = render(<Badge type={BADGE_TYPE.LARGE} label={34} />).toJSON()

    expect(tree).toMatchSnapshot()
})

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
