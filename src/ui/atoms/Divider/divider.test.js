import * as React from 'react'

import { render, screen } from '@utils/testing/testingLibrary'

import Divider from './Divider'
import { DIVIDER_TEST_ID, DIVIDER_TYPES } from './divider.constants'
import { waitFor } from '@testing-library/react-native'

test('Styles Overrides', async () => {
    const customStyles = { backgroundColor: 'some random color' }
    render(
        <Divider
            type={DIVIDER_TYPES.HORIZONTAL}
            style={customStyles}
        />,
    )
    await waitFor(() => {
        expect(screen.queryByTestId(DIVIDER_TEST_ID)).toBeOnTheScreen()
    })
    expect(screen.getByTestId(DIVIDER_TEST_ID)).toHaveStyle(customStyles)
})
