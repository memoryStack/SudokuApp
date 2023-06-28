import * as React from 'react'

import {
    fireEvent, render, act, screen, waitFor,
} from '@utils/testing/testingLibrary'
import {
    getCellByPosition, getFirstEmptyCell, getInputPanelEraser, getInputPanelNumberIfEnabled,
} from '@utils/testing/arena'
import { isEmptyElement } from '@utils/testing/touchable'
import { fireLayoutEvent } from '@utils/testing/fireEvent.utils'

import { BOTTOM_DRAGGER_OVERLAY_TEST_ID, CONTENT_CONTAINER_TEST_ID } from 'src/apps/components/BottomDragger/bottomDragger.constants'

import { BOARD_CELL_TEST_ID } from '../gameBoard/cell/cell.constants'
import { CustomPuzzle } from './index'
import { CLOSE_ICON_TEST_ID } from './customPuzzle.constants'

/*
    routine used to generate puzzle maps in test cases
        const str = '615030700000790010040005030000523090520000008400068000306080970200479006974356281'
        const result = {}
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '0') continue
            result[i + 1] = parseInt(str[i], 10)
        }
        console.log(result)
*/

const fillCustomPuzzle = cellVsMainNumbers => {
    const cellsNo = Object.keys(cellVsMainNumbers)
    for (let i = 0; i < cellsNo.length; i++) {
        const cellNo = cellsNo[i]
        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[parseInt(cellNo, 10) - 1]
        fireEvent.press(cell)
        act(() => {
            fireEvent.press(getInputPanelNumberIfEnabled(cellVsMainNumbers[cellNo]))
            jest.runAllTimers()
        })
    }
}

const renderCustomPuzzle = props => {
    jest.useFakeTimers()
    render(<CustomPuzzle parentHeight={1000} {...props} />)

    // this just got coupled with the implementation
    act(() => {
        // event used by BottomDragger component to
        // measure child view dimensions
        fireLayoutEvent(screen.getByTestId(CONTENT_CONTAINER_TEST_ID), {
            width: 400,
            height: 700,
            x: 0,
            y: 0,
        })
        // TODO: jest.runAllTimers(), jest.advanceTimersByTime() also works here
        //      need to understand the proper relation of these timers with Animated components
        jest.runAllTimers()
    })
}

describe('Custom Puzzle', () => {
    test('should fill a number on Input Number click', () => {
        renderCustomPuzzle()

        fillCustomPuzzle({ 1: 2 })

        expect(getCellByPosition(1)).toHaveTextContent(2)
    })

    test('filled number can be overriden by another number', () => {
        renderCustomPuzzle()

        fillCustomPuzzle({ 1: 2 })
        fillCustomPuzzle({ 1: 4 })

        expect(getCellByPosition(1)).toHaveTextContent(4)
    })

    test('eraser will remove number from the cell', () => {
        renderCustomPuzzle()

        const cell = getFirstEmptyCell()
        fillCustomPuzzle({ 1: 2 })
        fireEvent.press(cell)
        fireEvent.press(getInputPanelEraser())

        expect(isEmptyElement(cell)).toBe(true)
    })

    test('clicking on close icon will close the whole view', () => {
        const onClosed = jest.fn()
        renderCustomPuzzle({ onCustomPuzzleClosed: onClosed })

        act(() => {
            fireEvent.press(screen.getByTestId(CLOSE_ICON_TEST_ID))
            jest.runAllTimers()
        })

        expect(onClosed).toBeCalledTimes(1)
    })

    test('clicking on background overlay will not close the view', () => {
        const onClosed = jest.fn()
        renderCustomPuzzle({ onCustomPuzzleClosed: onClosed })

        // don't remove jest.runAllTimers from here
        act(() => {
            fireEvent.press(screen.getByTestId(BOTTOM_DRAGGER_OVERLAY_TEST_ID))
            jest.runAllTimers()
        })

        expect(onClosed).toBeCalledTimes(0)
    })
})

describe('Analyze Custom Puzzle', () => {
    test('invalid puzzle if clues are less than minimum required', async () => {
        renderCustomPuzzle()

        const PUZZLE_CELL_VS_MAIN_NUMBER = { 1: 2 }
        fillCustomPuzzle(PUZZLE_CELL_VS_MAIN_NUMBER)
        fireEvent.press(screen.getByText('Play'))

        await waitFor(() => {
            expect(screen.getByText('clues are less than 18')).toBeOnTheScreen()
        })
    })

    test('invalid puzzle if same number is present multiple times in a row, column or block', async () => {
        renderCustomPuzzle()

        const PUZZLE_CELL_VS_MAIN_NUMBER = {
            1: 9,
            3: 1,
            6: 8,
            15: 4,
            17: 2,
            18: 7,
            20: 6,
            21: 1,
            23: 2,
            24: 7,
            29: 9,
            30: 5,
            36: 4,
            38: 8,
            41: 1,
            44: 9,
            46: 6,
            52: 7,
            53: 8,
            58: 8,
            59: 5,
            61: 1,
            62: 4,
            64: 8,
            65: 5,
            67: 6,
            76: 3,
            81: 2,
        }
        fillCustomPuzzle(PUZZLE_CELL_VS_MAIN_NUMBER)
        fireEvent.press(screen.getByText('Play'))

        await waitFor(() => {
            expect(screen.getByText('puzzle has multiple instances of 1 in same house')).toBeOnTheScreen()
        })
    })

    test('invalid puzzle if puzzle has multiple solutions', async () => {
        renderCustomPuzzle()

        const PUZZLE_CELL_VS_MAIN_NUMBER = {
            1: 9,
            3: 6,
            5: 7,
            7: 4,
            9: 3,
            13: 4,
            16: 2,
            20: 7,
            24: 3,
            26: 1,
            28: 5,
            34: 1,
            38: 4,
            40: 2,
            42: 8,
            44: 6,
            48: 3,
            54: 5,
            56: 3,
            58: 7,
            62: 5,
            66: 7,
            69: 5,
            73: 4,
            75: 5,
            77: 1,
            79: 7,
            81: 8,
        }
        fillCustomPuzzle(PUZZLE_CELL_VS_MAIN_NUMBER)
        fireEvent.press(screen.getByText('Play'))

        await waitFor(() => {
            expect(screen.getByText('puzzle has multiple valid solutions. please input valid puzzle')).toBeOnTheScreen()
        })
    })

    // TODO: this test might break because puzzle validity subroutine might take a lot of time
    //          and waitFor() will throw error
    test('for valid puzzle will start puzzle and close the view', () => {
        const onClosed = jest.fn()
        const onStartPuzzle = jest.fn()
        renderCustomPuzzle({
            onCustomPuzzleClosed: onClosed,
            startCustomPuzzle: onStartPuzzle,
        })

        const PUZZLE_CELL_VS_MAIN_NUMBER = {
            1: 6,
            2: 1,
            3: 5,
            5: 3,
            7: 7,
            13: 7,
            14: 9,
            17: 1,
            20: 4,
            24: 5,
            26: 3,
            31: 5,
            32: 2,
            33: 3,
            35: 9,
            37: 5,
            38: 2,
            45: 8,
            46: 4,
            50: 6,
            51: 8,
            55: 3,
            57: 6,
            59: 8,
            61: 9,
            62: 7,
            64: 2,
            67: 4,
            68: 7,
            69: 9,
            72: 6,
            73: 9,
            74: 7,
            75: 4,
            76: 3,
            77: 5,
            78: 6,
            79: 2,
            80: 8,
            81: 1,
        }
        fillCustomPuzzle(PUZZLE_CELL_VS_MAIN_NUMBER)
        fireEvent.press(screen.getByText('Play'))

        expect(onStartPuzzle).toBeCalledTimes(1)
        act(() => {
            jest.runAllTimers()
        })
        expect(onClosed).toBeCalledTimes(1)
    })
})
