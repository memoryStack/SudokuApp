import * as React from 'react'

import {
    fireEvent, render, act,
} from '@utils/testing/testingLibrary'
import { getFirstEmptyCell, getInputPanelNumberIfEnabled } from '@utils/testing/arena'

import { CustomPuzzle } from './index'

describe('Custom Puzzle', () => {
    test('should fill a number on Input Number click', async () => {
        render(<CustomPuzzle />)

        const emptyCell = getFirstEmptyCell()
        fireEvent.press(emptyCell)
        await act(async () => {
            fireEvent.press(getInputPanelNumberIfEnabled(2))
        })

        expect(emptyCell).toHaveTextContent(2)
    })
})
