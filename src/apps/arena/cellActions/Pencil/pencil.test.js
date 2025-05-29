import * as React from 'react'

import {
    fireEvent, render, screen,
} from '@utils/testing/testingLibrary'

import Pencil from './Pencil'

describe('Pencil', () => {
    test('will call handler on click', () => {
        const onClick = jest.fn()
        render(<Pencil iconBoxSize={50} onClick={onClick} />)

        fireEvent.press(screen.getByText('Pencil'))

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('if disabled, will not call handler on click', () => {
        const onClick = jest.fn()
        render(<Pencil iconBoxSize={50} onClick={onClick} disabled />)

        fireEvent.press(screen.getByText('Pencil'))

        expect(onClick).not.toHaveBeenCalled()
    })
})
