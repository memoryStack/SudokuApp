import * as React from 'react'

import {
    fireEvent, render, screen,
} from '@utils/testing/testingLibrary'

import Pencil from './Pencil'
import { waitFor } from '@testing-library/react-native'

describe('Pencil', () => {
    test('will call handler on click', async () => {
        const onClick = jest.fn()
        render(<Pencil iconBoxSize={50} onClick={onClick} />)
        await waitFor(() => {
            expect(screen.queryByText('Pencil')).toBeOnTheScreen()
        })
        fireEvent.press(screen.getByText('Pencil'))

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('if disabled, will not call handler on click', async () => {
        const onClick = jest.fn()
        render(<Pencil iconBoxSize={50} onClick={onClick} disabled />)
        await waitFor(() => {
            expect(screen.queryByText('Pencil')).toBeOnTheScreen()
        })
        fireEvent.press(screen.getByText('Pencil'))

        expect(onClick).not.toHaveBeenCalled()
    })
})
