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
import { GAME_OVER_CARD_OVERLAY_TEST_ID, PUZZLES_LEVELS_LIST_CONTAINER } from '../constants'
import { PREVIOUS_GAME_DATA_KEY } from '../utils/cacheGameHandler'
import { MISTAKES_TEXT_TEST_ID } from '../refree/refree.constants'
import { BOARD_CELL_TEST_ID } from '../gameBoard/cell/cell.constants'
import { NEXT_GAME_MENU_TEST_ID } from '../nextGameMenu/nextGameMenu.constants'
import { MAX_AVAILABLE_HINTS } from '../store/state/boardController.state'
import { getGameLevelsUseCase } from '@application/usecases/gameLevels/gameLevels'
import { LEVEL_STATES } from '@application/usecases/gameLevels/constants'

const storageUtils = require('@utils/storage')

jest.mock('@application/usecases/gameLevels/gameLevels', () => {
    return {
        ...jest.requireActual('@application/usecases/gameLevels/gameLevels'),
        getGameLevelsUseCase: jest.fn(),
    }
})

jest.mock('@adapters/gameSettings', () => {
    const originalModule = jest.requireActual('@adapters/gameSettings')
    return {
        ...originalModule,
        gameSettingsAdapter: {
            ...originalModule.gameSettingsAdapter,
            allowAnyNoteInCell: jest.fn(async () => true)
        }
    }
})

jest.mock('../../../adapters/puzzle', () => {
    const originalPuzzleModule = jest.requireActual('../../../adapters/puzzle')
    const { transformNativeGeneratedPuzzle } = jest.requireActual('../../../adapters/puzzle/nativeGeneratedPuzzleTransformer')

    const Puzzle = {
        ...originalPuzzleModule.Puzzle,
        getSudokuPuzzle: () => Promise.resolve(
            transformNativeGeneratedPuzzle({
                clues: [9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 2, 7, 0, 6, 1, 0, 2, 7, 0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 4, 0, 8, 0, 0, 1, 0, 0, 9, 0, 6, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 8, 5, 0, 1, 4, 0, 8, 5, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2],
                solution: [9, 2, 7, 5, 3, 8, 4, 6, 1, 5, 3, 8, 1, 6, 4, 9, 2, 7, 4, 6, 1, 9, 2, 7, 5, 3, 8, 2, 9, 5, 7, 8, 3, 6, 1, 4, 7, 8, 3, 4, 1, 6, 2, 9, 5, 6, 1, 4, 2, 9, 5, 7, 8, 3, 3, 7, 9, 8, 5, 2, 1, 4, 6, 8, 5, 2, 6, 4, 1, 3, 7, 9, 1, 4, 6, 3, 7, 9, 8, 5, 2],
            })),
        validatePuzzle: jest.fn(),
    }
    return { Puzzle }
})

describe('Game Settings', () => {
    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'], // Allows waitFor to work
            timerLimit: 100, // Optional safety measure
        })
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    test('enter the note in cell if its main number is already filled in house if allowed in settings', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        fireEvent.press(cell)
        fireEvent.press(screen.getByText('Pencil'))
        fireEvent.press(getInputPanelNumberIfEnabled(9))
        await waitFor(() => {
            expect(isNotePresentInCell(cell, 9)).toBe(true)
        })
    })

    test('add all the notes in empty cell on fast pencil click if allowed in settings', async () => {
        await renderScreenAndWaitForPuzzleStart()

        act(() => {
            fireEvent.press(screen.getByText('Fast Pencil'))
        })

        const cell = screen.getAllByTestId(BOARD_CELL_TEST_ID)[1]
        await waitFor(() => {
            expect(isNotePresentInCell(cell, 1)).toBe(true)
            expect(isNotePresentInCell(cell, 2)).toBe(true)
            expect(isNotePresentInCell(cell, 3)).toBe(true)
            expect(isNotePresentInCell(cell, 4)).toBe(true)
            expect(isNotePresentInCell(cell, 5)).toBe(true)
            expect(isNotePresentInCell(cell, 6)).toBe(true)
            expect(isNotePresentInCell(cell, 7)).toBe(true)
            expect(isNotePresentInCell(cell, 8)).toBe(true)
            expect(isNotePresentInCell(cell, 9)).toBe(true)
        })
    })
})
