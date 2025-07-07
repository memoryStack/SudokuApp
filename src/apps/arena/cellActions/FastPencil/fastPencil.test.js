import * as React from 'react'

import {
    fireEvent, render, screen,
} from '@utils/testing/testingLibrary'

import FastPencil from './FastPencil'
import { waitFor } from '@testing-library/react-native'

describe('FastPencil', () => {
    test('will call handler on click', async () => {
        const onClick = jest.fn()
        render(<FastPencil iconBoxSize={50} onClick={onClick} />)

        await waitFor(() => {
            expect(screen.queryByText('Fast Pencil')).toBeOnTheScreen()
        })
        fireEvent.press(screen.getByText('Fast Pencil'))

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('if disabled, will not call handler on click', async () => {
        const onClick = jest.fn()
        render(<FastPencil iconBoxSize={50} onClick={onClick} disabled />)

        await waitFor(() => {
            expect(screen.queryByText('Fast Pencil')).toBeOnTheScreen()
        })
        fireEvent.press(screen.getByText('Fast Pencil'))

        expect(onClick).not.toHaveBeenCalled()
    })
})
