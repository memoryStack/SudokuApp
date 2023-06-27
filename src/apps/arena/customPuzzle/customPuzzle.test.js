import * as React from 'react'

import {
    fireEvent, render, act, screen, waitFor,
} from '@utils/testing/testingLibrary'
import { getFirstEmptyCell, getInputPanelEraser, getInputPanelNumberIfEnabled } from '@utils/testing/arena'

import { isEmptyElement } from '@utils/testing/touchable'
import { fireLayoutEvent } from '@utils/testing/fireEvent.utils'
import { BOTTOM_DRAGGER_OVERLAY_TEST_ID, CONTENT_CONTAINER_TEST_ID } from 'src/apps/components/BottomDragger/bottomDragger.constants'
import { CustomPuzzle } from './index'
import { CLOSE_ICON_TEST_ID } from './customPuzzle.constants'
import { BOARD_CELL_TEST_ID } from '../gameBoard/cell/cell.constants'

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

const fillCustomPuzzle = async cellVsMainNumbers => {
    const cellsNo = Object.keys(cellVsMainNumbers)
    for (let i = 0; i < cellsNo.length; i++) {
        const cellNo = cellsNo[i]
        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[parseInt(cellNo, 10) - 1]
        fireEvent.press(cell)
        await act(async () => {
            fireEvent.press(getInputPanelNumberIfEnabled(cellVsMainNumbers[cellNo]))
        })
        // TODO: below doesn't work with jest.fakeTimers
        //  act( () => {
        //     fireEvent.press(getInputPanelNumberIfEnabled(cellVsMainNumbers[cellNo]))
        //     jest.runAllTimers()
        // })
    }
}

describe('Custom Puzzle', () => {
    test('should fill a number on Input Number click', async () => {
        render(<CustomPuzzle parentHeight={800} />)

        const cell = getFirstEmptyCell()
        fireEvent.press(cell)
        await act(async () => {
            fireEvent.press(getInputPanelNumberIfEnabled(2))
        })

        expect(cell).toHaveTextContent(2)
    })

    test('filled number can be overriden by another number', async () => {
        render(<CustomPuzzle parentHeight={800} />)

        const cell = getFirstEmptyCell()
        fireEvent.press(cell)
        await act(async () => {
            fireEvent.press(getInputPanelNumberIfEnabled(2))
        })
        fireEvent.press(cell) // after filling cell once, next cell in row gets selected
        await act(async () => {
            fireEvent.press(getInputPanelNumberIfEnabled(4))
        })

        expect(cell).toHaveTextContent(4)
    })

    test('eraser will remove number from the cell', async () => {
        render(<CustomPuzzle parentHeight={800} />)

        const cell = getFirstEmptyCell()
        fireEvent.press(cell)
        await act(async () => {
            fireEvent.press(getInputPanelNumberIfEnabled(2))
        })
        fireEvent.press(cell)
        fireEvent.press(getInputPanelEraser())

        expect(isEmptyElement(cell)).toBe(true)
    })

    test('clicking on close icon will close the whole view', async () => {
        jest.useFakeTimers()
        const onClosed = jest.fn()
        render(<CustomPuzzle parentHeight={1000} onCustomPuzzleClosed={onClosed} />)

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
            jest.advanceTimersByTime(400)
        })

        // implementation coupling
        act(() => {
            fireEvent.press(screen.getByTestId(CLOSE_ICON_TEST_ID))
            jest.advanceTimersByTime(400)
        })

        expect(onClosed).toBeCalledTimes(1)
    })

    test('clicking on background overlay will not close the view', async () => {
        jest.useFakeTimers()
        const onClosed = jest.fn()
        render(<CustomPuzzle parentHeight={1000} onCustomPuzzleClosed={onClosed} />)

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
            jest.advanceTimersByTime(400)
        })

        // implementation coupling
        act(() => {
            fireEvent.press(screen.getByTestId(BOTTOM_DRAGGER_OVERLAY_TEST_ID))
            jest.advanceTimersByTime(400)
        })

        expect(onClosed).toBeCalledTimes(0)
    })
})

describe('Analyze Custom Puzzle', () => {
    test('invalid puzzle if clues are less than minimum required', async () => {
        render(<CustomPuzzle parentHeight={1000} />)

        const cell = getFirstEmptyCell()
        fireEvent.press(cell)
        await act(async () => {
            fireEvent.press(getInputPanelNumberIfEnabled(2))
        })
        fireEvent.press(screen.getByText('Play'))

        await waitFor(() => {
            expect(screen.getByText('clues are less than 18')).toBeOnTheScreen()
        })
    })

    test('invalid puzzle if same number is present multiple times in a row, column or block', async () => {
        // TODO: check why running with fake timers given error, will need some changes
        //          in fillCustomPuzzle() as well inside act() call.
        // jest.useFakeTimers()
        render(<CustomPuzzle parentHeight={1000} />)

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

        // const puzzle = [
        //     9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0,
        //     0, 0, 4, 0, 2, 7, 0, 6, 1, 0, 2, 7,
        //     0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 4,
        //     0, 8, 0, 0, 1, 0, 0, 9, 0, 6, 0, 0,
        //     0, 0, 0, 7, 8, 0, 0, 0, 0, 8, 5, 0,
        //     1, 4, 0, 8, 5, 0, 6, 0, 0, 0, 0, 0,
        //     0, 0, 0, 3, 0, 0, 0, 0, 2,
        // ]
        // const result = {}
        // puzzle.forEach((value, index) => {
        //     if (value) result[index + 1] = value
        // })
        // console.log(result)

        await fillCustomPuzzle(PUZZLE_CELL_VS_MAIN_NUMBER)
        fireEvent.press(screen.getByText('Play'))

        await waitFor(() => {
            expect(screen.getByText('puzzle has multiple instances of 1 in same house')).toBeOnTheScreen()
        })
    })

    test('invalid puzzle if puzzle has multiple solutions', async () => {
        render(<CustomPuzzle parentHeight={1000} />)

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

        // const str = '906070403000400200070003010500000100040208060003000005030700050007005000405010708'
        // const result = {}
        // for (let i = 0; i < str.length; i++) {
        //     if (str[i] === '0') continue
        //     result[i + 1] = parseInt(str[i], 10)
        // }
        // console.log(result)

        await fillCustomPuzzle(PUZZLE_CELL_VS_MAIN_NUMBER)
        fireEvent.press(screen.getByText('Play'))

        await waitFor(() => {
            expect(screen.getByText('puzzle has multiple valid solutions. please input valid puzzle')).toBeOnTheScreen()
        })
    })

    test('for valid puzzle will start puzzle and close the view', async () => {
        // TODO: fix jest timer issue/warning
        jest.useFakeTimers()
        const onClosed = jest.fn()
        const onStartPuzzle = jest.fn()
        render(
            <CustomPuzzle
                parentHeight={1000}
                onCustomPuzzleClosed={onClosed}
                startCustomPuzzle={onStartPuzzle}
            />,
        )

        act(() => {
            fireLayoutEvent(screen.getByTestId(CONTENT_CONTAINER_TEST_ID), {
                width: 400,
                height: 700,
                x: 0,
                y: 0,
            })
            jest.advanceTimersByTime(400)
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

        await fillCustomPuzzle(PUZZLE_CELL_VS_MAIN_NUMBER)
        fireEvent.press(screen.getByText('Play'))

        await waitFor(() => {
            expect(onClosed).toBeCalledTimes(1)
        })
        expect(onStartPuzzle).toBeCalledTimes(1)
    })
})
