import {
    screen, fireEvent, waitFor, act, within,
} from '@utils/testing/testingLibrary'
import { getScreenName, renderScreen } from '@utils/testing/renderScreen'

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
    exhaustHints,
} from '@utils/testing/arena'

import { isEmptyElement } from '@utils/testing/touchable'

import { assertHintsLeft } from '@utils/testing/smartHints'
import { HEADER_ITEMS, HEADER_ITEM_VS_TEST_ID } from '../../../navigation/headerSection/headerSection.constants'
import { ROUTES } from '../../../navigation/route.constants'
import { TIMER_PAUSE_ICON_TEST_ID, TIMER_START_ICON_TEST_ID, TIMER_TEST_ID } from '../timer/timer.constants'
import { ARENA_PAGE_TEST_ID, GAME_OVER_CARD_OVERLAY_TEST_ID, PUZZLES_LEVELS_LIST_CONTAINER } from '../constants'
import { PREVIOUS_GAME_DATA_KEY } from '../utils/cacheGameHandler'
import { MISTAKES_TEXT_TEST_ID } from '../refree/refree.constants'
import { BOARD_CELL_TEST_ID } from '../gameBoard/cell/cell.constants'
import { NEXT_GAME_MENU_TEST_ID } from '../nextGameMenu/nextGameMenu.constants'
import { MAX_AVAILABLE_HINTS } from '../store/state/boardController.state'
import { getGameLevelsUseCase } from '@application/usecases/gameLevels/gameLevels'
import { LEVEL_STATES } from '@application/usecases/gameLevels/constants'
import { getTimeDifferenceInSeconds } from '../utils/util'
import { HINT_SUGGESTION_DIALOG_TEST_ID } from '../ShowHintSuggestionDialog/showHintSuggestionDialog.constants'
import { NEW_GAME_IDS } from '@application/usecases/newGameMenu/constants'
import { soundAdapter } from '@adapters/soundAdapter'
import { gameSettingsAdapter } from '@adapters/gameSettings'

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
            allowAnyNoteInCell: jest.fn(() => true),
            remindToTakeHint: jest.fn(() => false),
            getMistakesLimit: jest.fn(() => 5),
            showTimer: jest.fn(() => false),
            soundsEnabled: jest.fn(() => false),
            fillNoteOnShortClick: jest.fn(() => true),
            shouldGameOverOnMistakesThresholdCrossed: jest.fn(() => false),
        }
    }
})

jest.mock('../../../adapters/puzzle', () => {
    const originalPuzzleModule = jest.requireActual('../../../adapters/puzzle')
    const { transformRawPuzzleToStateMainNumbers } = jest.requireActual('@domain/board/utils/puzzleDataTransformers')
    const Puzzle = {
        ...originalPuzzleModule.Puzzle,
        getSudokuPuzzle: () => Promise.resolve(
            transformRawPuzzleToStateMainNumbers({
                clues: [9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 2, 7, 0, 6, 1, 0, 2, 7, 0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 4, 0, 8, 0, 0, 1, 0, 0, 9, 0, 6, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 8, 5, 0, 1, 4, 0, 8, 5, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2],
                solution: [9, 2, 7, 5, 3, 8, 4, 6, 1, 5, 3, 8, 1, 6, 4, 9, 2, 7, 4, 6, 1, 9, 2, 7, 5, 3, 8, 2, 9, 5, 7, 8, 3, 6, 1, 4, 7, 8, 3, 4, 1, 6, 2, 9, 5, 6, 1, 4, 2, 9, 5, 7, 8, 3, 3, 7, 9, 8, 5, 2, 1, 4, 6, 8, 5, 2, 6, 4, 1, 3, 7, 9, 1, 4, 6, 3, 7, 9, 8, 5, 2],
            })),
        validatePuzzle: jest.fn(),
    }
    return { Puzzle }
})

jest.mock('../utils/util', () => {
    const original = jest.requireActual('../utils/util')
    return {
        ...original,
        getTimeDifferenceInSeconds: jest.fn(() => 10),
    }
})

const renderScreenAndWaitForPuzzleStart = async () => {
    renderScreen({
        route: ROUTES.ARENA,
        getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
        routeOptions: { selectedGameMenuItem: NEW_GAME_IDS.EASY, levelNum: 1 },
    })

    await waitFor(() => {
        screen.getByText('Pause')
    })
}

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

    test('should nudge user to take a hint if no activity has been recorded for a time limit', async () => {
        getTimeDifferenceInSeconds.mockImplementation(() => {
            return 500 // it's enough to show the hint suggestion modal
        })
        await renderScreenAndWaitForPuzzleStart()

        jest.advanceTimersByTime(3000)

        expect(getTimeDifferenceInSeconds).toHaveBeenCalled()
        expect(screen.queryByTestId(HINT_SUGGESTION_DIALOG_TEST_ID)).not.toBeOnTheScreen()
    })

    test('should show number of mistakes limit taken from settings', async () => {
        gameSettingsAdapter.shouldGameOverOnMistakesThresholdCrossed.mockImplementation(() => {
            return true
        })

        await renderScreenAndWaitForPuzzleStart()

        await waitFor(() => {
            screen.getByText('Mistakes: 0/5')
        })
    })

    test('should hide timer as per settings and show pause & play CTA instead', async () => {
        await renderScreenAndWaitForPuzzleStart()

        expect(screen.queryByTestId(TIMER_TEST_ID)).not.toBeOnTheScreen()
    })

    test('should not play sounds if turned off in settings', async () => {
        const soundPlaySpy = jest.spyOn(soundAdapter, 'play');
        await renderScreenAndWaitForPuzzleStart()

        const emptyCell = getFirstEmptyCell()
        fireEvent.press(emptyCell)

        expect(soundPlaySpy).not.toHaveBeenCalled()
    })

    test('should fill note in cell on short click if enabled through settings', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const emptyCell = getFirstEmptyCell()
        fireEvent.press(emptyCell)

        fireEvent.press(getInputPanelNumberIfEnabled(2))

        await waitFor(() => {
            expect(isNotePresentInCell(emptyCell, 2)).toBe(true)
        })
    })

    test('should fill main number in cell on long click if enabled through settings', async () => {
        await renderScreenAndWaitForPuzzleStart()

        const emptyCell = getFirstEmptyCell()
        fireEvent.press(emptyCell)

        fireEvent(getInputPanelNumberIfEnabled(2), 'onLongPress')

        await waitFor(() => {
            expectMainNumberPresentInCell(emptyCell, '2')
        })
    })
})
