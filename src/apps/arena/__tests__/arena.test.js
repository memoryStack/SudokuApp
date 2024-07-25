import {
    screen, fireEvent, waitFor, act, within,
} from '@utils/testing/testingLibrary'
import { getScreenName } from '@utils/testing/renderScreen'

import {
    hasPuzzleStarted,
    expectOnAllBoardCells,
    expectOnAllBoardControllers,
    expectOnAllInputPanelItems,
    getFirstEmptyCell,
    getFirstEnabledInputPanelNumber,
    getInputPanelNumberIfEnabled,
    getInputPanelEraser,
    isNotePresentInCell,
    expectMainNumberPresentInCell,
    solvePuzzle,
    gameOverByMistakes,
    renderScreenAndWaitForPuzzleStart,
    exhaustHints,
    renderScreenAndWaitCustomPuzzleToStart,
} from '@utils/testing/arena'

import { isEmptyElement } from '@utils/testing/touchable'

import { assertHintsLeft } from '@utils/testing/smartHints'
import { HEADER_ITEMS, HEADER_ITEM_VS_TEST_ID } from '../../../navigation/headerSection/headerSection.constants'
import { ROUTES } from '../../../navigation/route.constants'
import { TIMER_PAUSE_ICON_TEST_ID, TIMER_START_ICON_TEST_ID, TIMER_TEST_ID } from '../timer/timer.constants'
import { GAME_OVER_CARD_OVERLAY_TEST_ID } from '../constants'
import { PREVIOUS_GAME_DATA_KEY } from '../utils/cacheGameHandler'
import { MISTAKES_TEXT_TEST_ID } from '../refree/refree.constants'
import { BOARD_CELL_TEST_ID } from '../gameBoard/cell/cell.constants'
import { NEXT_GAME_MENU_TEST_ID } from '../nextGameMenu/nextGameMenu.constants'
import { MAX_AVAILABLE_HINTS } from '../store/state/boardController.state'

const storageUtils = require('@utils/storage')

jest.mock('../../../adapters/puzzle/puzzle', () => {
    const Puzzle = {
        getSudokuPuzzle: () => Promise.resolve({
            clues: [9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 2, 7, 0, 6, 1, 0, 2, 7, 0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 4, 0, 8, 0, 0, 1, 0, 0, 9, 0, 6, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 8, 5, 0, 1, 4, 0, 8, 5, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2],
            solution: [9, 2, 7, 5, 3, 8, 4, 6, 1, 5, 3, 8, 1, 6, 4, 9, 2, 7, 4, 6, 1, 9, 2, 7, 5, 3, 8, 2, 9, 5, 7, 8, 3, 6, 1, 4, 7, 8, 3, 4, 1, 6, 2, 9, 5, 6, 1, 4, 2, 9, 5, 7, 8, 3, 3, 7, 9, 8, 5, 2, 1, 4, 6, 8, 5, 2, 6, 4, 1, 3, 7, 9, 1, 4, 6, 3, 7, 9, 8, 5, 2],
        }),
        validatePuzzle: jest.fn(),
    }
    return { Puzzle }
})

describe('Arena Screen', () => {
    // added this to avoid "ReferenceError: You are trying to `import` a file after the Jest environment has been torn down."
    // error due to timer setTimeout
    // TODO: read more about the jest.useFakeTimers() and this cleanup func
    beforeEach(() => {
        jest.useFakeTimers()
        jest.clearAllMocks()
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    test('should go back to home page on back button press', async () => {
        await renderScreenAndWaitForPuzzleStart()
        fireEvent.press(screen.getByTestId(HEADER_ITEM_VS_TEST_ID[HEADER_ITEMS.BACK]))

        expect(getScreenName()).toBe(ROUTES.HOME)
    })
})

describe('Timer Click Once', () => {
    beforeEach(() => {
        jest.useFakeTimers()
        jest.clearAllMocks()
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    const clickTimerOnce = () => fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

    test('game is cached', async () => {
        const setKeySpy = jest.spyOn(storageUtils, 'setKey')
        await renderScreenAndWaitForPuzzleStart(clickTimerOnce)

        expect(setKeySpy.mock.calls).toEqual(
            expect.arrayContaining([[PREVIOUS_GAME_DATA_KEY, expect.anything()]]),
        )
    })

    test('all board numbers will be disappeared', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerOnce)

        expectOnAllBoardCells(element => {
            expect(isEmptyElement(element)).toBe(true)
        })
    })

    test('all board controllers will be disabled', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerOnce)

        expectOnAllBoardControllers(element => {
            expect(element).toBeDisabled()
        })
    })

    test('all input panel items will be disabled', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerOnce)

        expectOnAllInputPanelItems(element => {
            expect(element).toBeDisabled()
        })
    })

    test('start the timer icon will be visible', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerOnce)

        expect(screen.getByTestId(TIMER_START_ICON_TEST_ID)).toBeVisible()
    })

    test('timer will be cleared', async () => {
        jest.spyOn(global, 'clearInterval')

        await renderScreenAndWaitForPuzzleStart(clickTimerOnce)

        expect(clearInterval).toHaveBeenCalledTimes(1)
    })
})

describe('Timer Click Twice', () => {
    beforeEach(() => {
        jest.useFakeTimers()
        jest.clearAllMocks()
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    const clickTimerTwice = async () => {
        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        await screen.findByTestId(TIMER_START_ICON_TEST_ID)

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))
    }

    test('numbers will be visible in board cells', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerTwice)

        let filledCellsCount = 0
        const someCellsHaveNumbers = element => {
            if (!isEmptyElement(element)) filledCellsCount++
        }

        expectOnAllBoardCells(someCellsHaveNumbers)

        expect(filledCellsCount).not.toBe(0)
    })

    test('all board controllers will be enabled', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerTwice)

        expectOnAllBoardControllers(element => {
            expect(element).not.toBeDisabled()
        })
    })

    test('all input panel items will be enabled', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerTwice)

        expectOnAllInputPanelItems(element => {
            expect(element).not.toBeDisabled()
        })
    })

    test('pause the timer icon will be visible', async () => {
        await renderScreenAndWaitForPuzzleStart(clickTimerTwice)

        expect(screen.getByTestId(TIMER_PAUSE_ICON_TEST_ID)).toBeVisible()
    })

    test('timer will be setup', async () => {
        jest.spyOn(global, 'setInterval')

        await renderScreenAndWaitForPuzzleStart(clickTimerTwice)

        expect(setInterval).toHaveBeenCalledTimes(2)
    })
})

describe('Board Cell Fill Values', () => {
    test('should fill main number in an empty cell', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const emptyCell = getFirstEmptyCell()
        fireEvent.press(emptyCell)
        const inputPanelItemToPress = getFirstEnabledInputPanelNumber()
        fireEvent.press(inputPanelItemToPress.element)

        expectMainNumberPresentInCell(emptyCell, inputPanelItemToPress.inputNumber)
    })

    test('mistakes count will remain same on filling correct number', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const emptyCell = getFirstEmptyCell()
        fireEvent.press(emptyCell)

        expect(screen.getByTestId(MISTAKES_TEXT_TEST_ID)).toHaveTextContent(/Mistakes: 0/)

        const numberToInputInEmptyCell = 2 // 2 is correct solution of the empty cell above
        fireEvent.press(getInputPanelNumberIfEnabled(numberToInputInEmptyCell))

        expect(screen.getByTestId(MISTAKES_TEXT_TEST_ID)).toHaveTextContent(/Mistakes: 0/)
    })

    test('mistakes count will increase on clicking wrong number', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const emptyCell = getFirstEmptyCell()
        fireEvent.press(emptyCell)

        const numberToInputInEmptyCell = 5 // 5 is not the solution of the empty cell above
        fireEvent.press(getInputPanelNumberIfEnabled(numberToInputInEmptyCell))

        expect(screen.getByTestId(MISTAKES_TEXT_TEST_ID)).toHaveTextContent(/Mistakes: 1/)
    })

    test('clicked number wont change clue cell value', async () => {
        await renderScreenAndWaitForPuzzleStart()

        // in mocked puzzle, first cell is filled and it's value is 9
        const clueCell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[0]
        fireEvent.press(clueCell)
        fireEvent.press(getInputPanelNumberIfEnabled(5))

        expectMainNumberPresentInCell(clueCell, 9)
    })

    test('clicked number wont change value in correctly filled cell as well', async () => {
        await renderScreenAndWaitForPuzzleStart()

        // in mocked puzzle, second cell is empty and it's solution is 2
        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(getInputPanelNumberIfEnabled(2)) // fill correct value
        fireEvent.press(getInputPanelNumberIfEnabled(9))

        expectMainNumberPresentInCell(cell, 2)
    })

    test('clicked number wont change value in wrongly filled cell as well', async () => {
        await renderScreenAndWaitForPuzzleStart()

        // in mocked puzzle, second cell is empty and it's solution is 2
        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(getInputPanelNumberIfEnabled(5)) // fill wrong value
        fireEvent.press(getInputPanelNumberIfEnabled(9))

        expectMainNumberPresentInCell(cell, 5)
    })
})

describe('Board Cell Fill Notes', () => {
    test('should fill note in an empty cell if that number is not present in row, col and block', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2)) // 2 can be entered as not in the cell

        expect(isNotePresentInCell(cell, 2)).toBe(true)
    })

    test('will not fill note in an empty cell if that number is present in row, col and block', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(9)) // 9 is present in block and column of this cell

        expect(isNotePresentInCell(cell, 9)).toBe(false)
    })

    test('try filling a note two times will actually erase that note after filling on first click', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))

        expect(isNotePresentInCell(cell, 2)).toBe(true)

        fireEvent.press(getInputPanelNumberIfEnabled(2))

        expect(isNotePresentInCell(cell, 2)).toBe(false)
    })
})

describe('Board Cell fill MainValue in Notes filled cell', () => {
    test('will remove notes and show main value', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))

        expect(isNotePresentInCell(cell, 2)).toBe(false)
        expect(isNotePresentInCell(cell, 3)).toBe(false)
        expectMainNumberPresentInCell(cell, 2)
    })

    test('will remove notes of main value from any other cell which has a house common with to be filled cell', async () => {
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByText('Fast Pencil'))
        const cellA = screen.getAllByTestId(BOARD_CELL_TEST_ID)[7]
        const cellB = screen.getAllByTestId(BOARD_CELL_TEST_ID)[25]
        const cellC = screen.getAllByTestId(BOARD_CELL_TEST_ID)[78]
        expect(isNotePresentInCell(cellA, 5)).toBe(true)
        expect(isNotePresentInCell(cellB, 5)).toBe(true)
        expect(isNotePresentInCell(cellC, 5)).toBe(true)

        const cellToBeFilled = screen.getAllByTestId(BOARD_CELL_TEST_ID)[79]
        fireEvent.press(cellToBeFilled)
        fireEvent.press(getInputPanelNumberIfEnabled(5))

        expect(isNotePresentInCell(cellA, 5)).toBe(false)
        expect(isNotePresentInCell(cellB, 5)).toBe(false)
        expect(isNotePresentInCell(cellC, 5)).toBe(false)

        expectMainNumberPresentInCell(cellToBeFilled, 5)
    })
})

describe('Erase Board Cell Main Number', () => {
    test('can erase wrongly filled value', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = getFirstEmptyCell()
        fireEvent.press(cell)
        // 5 is not the solution of the empty cell above
        fireEvent.press(getInputPanelNumberIfEnabled(5))
        fireEvent.press(getInputPanelEraser())

        expect(isEmptyElement(cell)).toBe(true)
    })

    test('can not erase correctly filled value', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = getFirstEmptyCell()
        fireEvent.press(cell)
        // 2 is the correct solution of the empty cell above
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelEraser())

        expect(isEmptyElement(cell)).toBe(false)
    })

    test('can not erase clue value', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const clueCell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[0]
        fireEvent.press(clueCell)
        fireEvent.press(getInputPanelEraser())

        expect(isEmptyElement(clueCell)).toBe(false)
    })

    test('erase on empty cell has no effect', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = getFirstEmptyCell()
        fireEvent.press(cell)
        fireEvent.press(getInputPanelEraser())

        expect(isEmptyElement(cell)).toBe(true)
    })
})

describe('Erase Board Cell Notes', () => {
    test('eraser will erase all the notes in cell', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(getInputPanelNumberIfEnabled(4))
        fireEvent.press(getInputPanelEraser())

        expect(isNotePresentInCell(cell, 2)).toBe(false)
        expect(isNotePresentInCell(cell, 3)).toBe(false)
        expect(isNotePresentInCell(cell, 4)).toBe(false)
    })
})

describe('Fast Pencil', () => {
    test('will add all possible notes to all the empty cells', async () => {
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByText('Fast Pencil'))

        // assuming if it works for two random cells then will work for other cells as well
        const cellA = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        expect(isNotePresentInCell(cellA, 2)).toBe(true)
        expect(isNotePresentInCell(cellA, 3)).toBe(true)
        expect(isNotePresentInCell(cellA, 4)).toBe(true)
        expect(isNotePresentInCell(cellA, 7)).toBe(true)

        const cellB = screen.getAllByTestId(BOARD_CELL_TEST_ID)[53]
        expect(isNotePresentInCell(cellB, 1)).toBe(true)
        expect(isNotePresentInCell(cellB, 3)).toBe(true)
        expect(isNotePresentInCell(cellB, 5)).toBe(true)

        expectOnAllBoardCells(element => {
            expect(isEmptyElement(element)).toBe(false)
        })
    })

    test('will add all remaining notes to partially filled notes in cell', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(screen.getByText('Fast Pencil'))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(true)
        expect(isNotePresentInCell(cell, 4)).toBe(true)
        expect(isNotePresentInCell(cell, 7)).toBe(true)
    })
})

describe('Undo', () => {
    test('will remove correctly filled main number', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(screen.getByText('Undo'))

        expect(isEmptyElement(cell)).toBe(true)
    })

    test('will remove wrongly filled main number as well', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(screen.getByText('Undo'))

        expect(isEmptyElement(cell)).toBe(true)
    })

    test('will remove filled notes one by one on each click', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(true)

        fireEvent.press(screen.getByText('Undo'))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(false)

        fireEvent.press(screen.getByText('Undo'))

        expect(isNotePresentInCell(cell, 2)).toBe(false)
        expect(isNotePresentInCell(cell, 3)).toBe(false)
    })

    test('will bring back removed main number from cell', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(getInputPanelNumberIfEnabled(3)) // only wrongly filled main numbers can be removed
        fireEvent.press(getInputPanelEraser())
        fireEvent.press(screen.getByText('Undo'))

        expect(cell).toHaveTextContent(3)
    })

    test('will bring back removed notes from cell', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(getInputPanelEraser())
        fireEvent.press(screen.getByText('Undo'))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(true)
    })

    test('will bring back the notes which were present before filling main number', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))

        expect(isNotePresentInCell(cell, 2)).toBe(false)
        expect(isNotePresentInCell(cell, 3)).toBe(false)

        fireEvent.press(screen.getByText('Undo'))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(true)
    })

    test('will bring back the note which was removed by toggling the note', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(getInputPanelNumberIfEnabled(2))
        fireEvent.press(screen.getByText('Undo'))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(true)
    })

    test('will remove notes added by Fast Pencil click, rest will survive', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(2)) // add notes by normal pencil
        fireEvent.press(getInputPanelNumberIfEnabled(3))
        fireEvent.press(screen.getByText('Fast Pencil'))
        fireEvent.press(screen.getByText('Undo'))

        expect(isNotePresentInCell(cell, 2)).toBe(true)
        expect(isNotePresentInCell(cell, 3)).toBe(true)
        expect(isEmptyElement(screen.getAllByTestId(BOARD_CELL_TEST_ID)[53])).toBe(true)
    })
})

describe('Game Over Card', () => {
    test('clicking on NewGame Button after puzzle was solved will open Next Game Menu to start new puzzle', async () => {
        await renderScreenAndWaitForPuzzleStart()

        solvePuzzle()
        fireEvent.press(screen.getByText('New Game'))

        await waitFor(() => {
            expect(screen.getByTestId(NEXT_GAME_MENU_TEST_ID)).toBeVisible()
        })
    })

    test('clicking on NewGame Button after puzzle was not solved will open Next Game Menu to start new puzzle', async () => {
        await renderScreenAndWaitForPuzzleStart()

        gameOverByMistakes()
        fireEvent.press(screen.getByText('New Game'))

        await waitFor(() => {
            expect(screen.getByTestId(NEXT_GAME_MENU_TEST_ID)).toBeVisible()
        })
    })
})

describe('Start New Game', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    test('select new game from New Game button on game over card ', async () => {
        await renderScreenAndWaitForPuzzleStart()

        solvePuzzle()
        act(() => {
            fireEvent.press(screen.getByText('New Game'))
            jest.advanceTimersByTime(200)
        })
        const newGameMenu = within(screen.getByTestId(NEXT_GAME_MENU_TEST_ID))
        fireEvent.press(newGameMenu.getByText('EASY'))

        await hasPuzzleStarted()
    })

    test('if new game is not selected and game over card is dismissed then Next Game menu will be opened by itself', async () => {
        await renderScreenAndWaitForPuzzleStart()

        solvePuzzle()
        act(() => {
            fireEvent.press(screen.getByTestId(GAME_OVER_CARD_OVERLAY_TEST_ID))
            jest.advanceTimersByTime(200)
        })
        const newGameMenu = within(screen.getByTestId(NEXT_GAME_MENU_TEST_ID))
        fireEvent.press(newGameMenu.getByText('EASY'))

        await hasPuzzleStarted()
    })
})

describe('Bugs', () => {
    beforeEach(() => {
        jest.useFakeTimers()
        jest.setTimeout(20000)
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    test.skip('starting new game after completing current one, allowed hints must be filled back', async () => {
        const puzzle = '409300781320700409700000000600050000050871040000040002000000008506007094178004506'

        // eslint-disable-next-line global-require
        const { Puzzle } = require('../../../adapters/puzzle')

        Puzzle.validatePuzzle.mockImplementation(() => Promise.resolve({
            count: 1,
            solution: [4, 6, 9, 3, 2, 5, 7, 8, 1, 3, 2, 5, 7, 1, 8, 4, 6, 9, 7, 8, 1, 4, 6, 9, 3, 2, 5, 6, 4, 3, 9, 5, 2, 8, 1, 7, 9, 5, 2, 8, 7, 1, 6, 4, 3, 8, 1, 7, 6, 4, 3, 9, 5, 2, 2, 9, 4, 5, 3, 6, 1, 7, 8, 5, 3, 6, 1, 8, 7, 2, 9, 4, 1, 7, 8, 2, 9, 4, 5, 3, 6],
        }))

        await renderScreenAndWaitCustomPuzzleToStart(puzzle)
        await exhaustHints()
        act(() => solvePuzzle())
        act(() => {
            fireEvent.press(screen.getByText('New Game'))
            jest.advanceTimersByTime(500)
        })
        const newGameMenu = within(screen.getByTestId(NEXT_GAME_MENU_TEST_ID))
        fireEvent.press(newGameMenu.getByText('EASY'))
        await hasPuzzleStarted()

        assertHintsLeft(MAX_AVAILABLE_HINTS)

        Puzzle.validatePuzzle.mockReset()
    })
})
