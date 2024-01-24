import * as React from 'react'

import {
    fireEvent, render, screen,
} from '@utils/testing/testingLibrary'

import { BADGE_TEST_ID } from '@ui/atoms/Badge'
import Hint from './Hint'

test('snapshot for enabled Hint', () => {
    const tree = render(<Hint iconBoxSize={50} hints={3} />).toJSON()
    expect(tree).toMatchSnapshot()
})

test('snapshot for disabled Hint', () => {
    const tree = render(<Hint iconBoxSize={50} hints={3} />).toJSON()
    expect(tree).toMatchSnapshot()
})

describe('Hint', () => {
    test.skip('will show remaining hints count in a Badge', () => {
        render(<Hint iconBoxSize={50} hints={3} />)

        expect(screen.getByTestId(BADGE_TEST_ID)).toHaveTextContent(3)
    })

    test('will call handler on click', () => {
        const onClick = jest.fn()
        render(<Hint iconBoxSize={50} onClick={onClick} hints={3} />)

        fireEvent.press(screen.getByText('Hint'))

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('if available hints are 0, will not call handler on click', () => {
        const onClick = jest.fn()
        render(<Hint iconBoxSize={50} onClick={onClick} hints={0} />)

        fireEvent.press(screen.getByText('Hint'))

        expect(onClick).toHaveBeenCalledTimes(0)
    })

    test('if disabled, will not call handler on click', () => {
        const onClick = jest.fn()
        render(<Hint iconBoxSize={50} onClick={onClick} disabled hints={3} />)

        fireEvent.press(screen.getByText('Hint'))

        expect(onClick).not.toHaveBeenCalled()
    })

    test.skip('if disabled, hints badge will not be displayed', () => {
        render(<Hint iconBoxSize={50} hints={3} disabled />)

        expect(screen.queryByTestId(BADGE_TEST_ID)).not.toBeOnTheScreen()
    })
})
