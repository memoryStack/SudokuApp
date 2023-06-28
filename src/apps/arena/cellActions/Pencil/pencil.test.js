import * as React from 'react'

import {
    fireEvent, render, screen,
} from '@utils/testing/testingLibrary'

import Pencil from './Pencil'

test('snapshot for inactive Pencil', () => {
    const tree = render(<Pencil iconBoxSize={50} />).toJSON()
    expect(tree).toMatchSnapshot()
})

test('snapshot for active Pencil', () => {
    const tree = render(<Pencil iconBoxSize={50} isActive />).toJSON()
    expect(tree).toMatchSnapshot()
})

describe('Pencil', () => {
    test('will call handler on click', () => {
        const onClick = jest.fn()
        render(<Pencil iconBoxSize={50} onClick={onClick} />)

        fireEvent.press(screen.getByText('Pencil'))

        expect(onClick).toHaveBeenCalledTimes(1)
    })
})
