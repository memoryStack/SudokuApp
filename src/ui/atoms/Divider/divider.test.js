import * as React from 'react'

import { render, screen } from '@utils/testing/testingLibrary'

import Divider from './Divider'
import { DIVIDER_TEST_ID, DIVIDER_TYPES } from './divider.constants'

test('snapshot for vertical divider', () => {
    const tree = render(
        <Divider type={DIVIDER_TYPES.VERTICAL} />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('snapshot for horizontal divider', () => {
    const tree = render(
        <Divider type={DIVIDER_TYPES.HORIZONTAL} />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('Styles Overrides', () => {
    const customStyles = { backgroundColor: 'some random color' }
    render(
        <Divider
            type={DIVIDER_TYPES.HORIZONTAL}
            style={customStyles}
        />,
    )

    expect(screen.getByTestId(DIVIDER_TEST_ID)).toHaveStyle(customStyles)
})
