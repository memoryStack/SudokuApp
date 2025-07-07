import * as React from 'react'

import { useRoute } from '@react-navigation/native'

import {
    fireEvent, render, screen,
} from '@utils/testing/testingLibrary'

import { BADGE_TEST_ID } from '@ui/atoms/Badge'
import Hint from './Hint'
import { ROUTES } from '@application/constants'
import { waitFor } from '@testing-library/react-native'

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useRoute: jest.fn(),
}))

describe('Hint', () => {
    beforeEach(() => {
        useRoute.mockReturnValue({ name: ROUTES.ARENA })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test.skip('will show remaining hints count in a Badge', () => {
        render(<Hint iconBoxSize={50} hints={3} />)

        expect(screen.getByTestId(BADGE_TEST_ID)).toHaveTextContent(3)
    })

    test('will call handler on click', async () => {
        const onClick = jest.fn()
        render(<Hint iconBoxSize={50} onClick={onClick} hints={3} />)
        await waitFor(() => {
            expect(screen.queryByText('Hint')).toBeOnTheScreen()
        })
        fireEvent.press(screen.getByText('Hint'))

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('if available hints are 0, will not call handler on click', async () => {
        const onClick = jest.fn()
        render(<Hint iconBoxSize={50} onClick={onClick} hints={0} />)

        await waitFor(() => {
            expect(screen.queryByText('Hint')).toBeOnTheScreen()
        })
        fireEvent.press(screen.getByText('Hint'))

        expect(onClick).toHaveBeenCalledTimes(0)
    })

    test('if disabled, will not call handler on click', async () => {
        const onClick = jest.fn()
        render(<Hint iconBoxSize={50} onClick={onClick} disabled hints={3} />)
        await waitFor(() => {
            expect(screen.queryByText('Hint')).toBeOnTheScreen()
        })
        fireEvent.press(screen.getByText('Hint'))

        expect(onClick).not.toHaveBeenCalled()
    })

    test.skip('if disabled, hints badge will not be displayed', async () => {
        render(<Hint iconBoxSize={50} hints={3} disabled />)
        await waitFor(() => {
            expect(screen.queryByText('Hint')).toBeOnTheScreen()
        })
        expect(screen.queryByTestId(BADGE_TEST_ID)).not.toBeOnTheScreen()
    })
})
