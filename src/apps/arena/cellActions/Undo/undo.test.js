import * as React from 'react'

import {
    fireEvent, render, screen,
} from '@utils/testing/testingLibrary'

import Undo from './Undo'

test('snapshot for  Undo', () => {
    const tree = render(<Undo iconBoxSize={50} />).toJSON()
    expect(tree).toMatchSnapshot()
})

describe('Undo', () => {
    test('will call handler on click', () => {
        const onClick = jest.fn()
        render(<Undo iconBoxSize={50} onClick={onClick} />)

        fireEvent.press(screen.getByText('Undo'))

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('if disabled, will not call handler on click', () => {
        const onClick = jest.fn()
        render(<Undo iconBoxSize={50} onClick={onClick} disabled />)

        fireEvent.press(screen.getByText('Undo'))

        expect(onClick).not.toHaveBeenCalled()
    })
})
