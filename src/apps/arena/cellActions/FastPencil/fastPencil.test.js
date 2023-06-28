import * as React from 'react'

import {
    fireEvent, render, screen,
} from '@utils/testing/testingLibrary'

import FastPencil from './FastPencil'

test('snapshot for  FastPencil', () => {
    const tree = render(<FastPencil iconBoxSize={50} />).toJSON()
    expect(tree).toMatchSnapshot()
})

describe('FastPencil', () => {
    test('will call handler on click', () => {
        const onClick = jest.fn()
        render(<FastPencil iconBoxSize={50} onClick={onClick} />)

        fireEvent.press(screen.getByText('Fast Pencil'))

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('if disabled, will not call handler on click', () => {
        const onClick = jest.fn()
        render(<FastPencil iconBoxSize={50} onClick={onClick} disabled />)

        fireEvent.press(screen.getByText('Fast Pencil'))

        expect(onClick).not.toHaveBeenCalled()
    })
})
