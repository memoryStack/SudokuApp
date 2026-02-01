import {
    screen, fireEvent, waitFor, act, within,
} from '@utils/testing/testingLibrary'

import {
    renderScreenAndWaitForPuzzleStart,
    gameOverByMistakes,
    solvePuzzle,
    hasPuzzleStarted,
    isPuzzlePaused,
} from '@utils/testing/arena'

import { GAME_OVER_CARD_OVERLAY_TEST_ID } from '../constants'
import { NEXT_GAME_MENU_TEST_ID } from '../nextGameMenu/nextGameMenu.constants'
import { server } from 'src/mocks/node'
import { http, HttpResponse } from 'msw'
import { gameSettingsAdapter } from '@adapters/gameSettings'
import {
    FEEDBACK_BOTTOM_SHEET_TEST_ID,
    FEEDBACK_SUBMIT_BUTTON_TEST_ID,
    FEEDBACK_SKIP_BUTTON_TEST_ID,
    FEEDBACK_DND_BUTTON_TEST_ID,
} from '../FeedbackBottomSheet'

/*
    writing this file separately to test UI with the hook in integration as a unit.
    one more reason of this is that i don't know how to unmock a function to use it's
    original implementation. so that integration testing works as expected.
*/

jest.mock('@adapters/gameSettings', () => {
    const originalModule = jest.requireActual('@adapters/gameSettings');
    return {
        gameSettingsAdapter: {
            ...originalModule.gameSettingsAdapter,
            shouldGameOverOnMistakesThresholdCrossed: jest.fn(() => true),
        }
    }
})

jest.mock('lottie-react-native', () => {
    const MockComponent = () => null
    return {
        __esModule: true,
        default: MockComponent
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

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Feedback Dialog - Pending Action Execution', () => {
    const { feedbackAdapter } = require('src/adapters/feedbackAdapter')

    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()

        jest.spyOn(feedbackAdapter, 'getDNDStatus')
        jest.spyOn(feedbackAdapter, 'hasProvidedFeedback')
        jest.spyOn(feedbackAdapter, 'isFeedbackShownThisSession')
        jest.spyOn(feedbackAdapter, 'getGamesLostCount')
        jest.spyOn(feedbackAdapter, 'setFeedbackShownThisSession')
        jest.spyOn(feedbackAdapter, 'setDNDStatus')
        jest.spyOn(feedbackAdapter, 'setFeedbackProvided')
        jest.spyOn(feedbackAdapter, 'resetGamesLostCount')
        jest.spyOn(feedbackAdapter, 'incrementGamesLostCount')

        feedbackAdapter.getDNDStatus.mockResolvedValue(false)
        feedbackAdapter.hasProvidedFeedback.mockResolvedValue(false)
        feedbackAdapter.isFeedbackShownThisSession.mockReturnValue(false)
        feedbackAdapter.getGamesLostCount.mockResolvedValue(5)
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
    })

    test('after submit with input, pending restart action executes restartGame', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await gameOverByMistakes()

        await waitFor(() => {
            fireEvent.press(screen.getByText('Restart'))
        })

        act(() => {
            fireEvent.press(screen.getByText('Restart'))
        })

        await waitFor(() => {
            screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID)
        })

        await isPuzzlePaused()

        const feedbackSheet = within(screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID))
        fireEvent.press(feedbackSheet.getByTestId('FEEDBACK_PILL_HINTS'))
        fireEvent.press(feedbackSheet.getByTestId(FEEDBACK_SUBMIT_BUTTON_TEST_ID))

        await hasPuzzleStarted()
    })

    test('after skip, pending newGame action opens next game menu', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await gameOverByMistakes()

        await waitFor(() => {
            fireEvent.press(screen.getByText('New Game'))
        })

        act(() => {
            fireEvent.press(screen.getByText('New Game'))
        })

        await waitFor(() => {
            screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID)
        })

        const feedbackSheet = within(screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID))
        fireEvent.press(feedbackSheet.getByTestId(FEEDBACK_SKIP_BUTTON_TEST_ID))

        await waitFor(() => {
            screen.getByTestId(NEXT_GAME_MENU_TEST_ID)
        })
    })

    test('after DND, pending action is executed', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await gameOverByMistakes()

        await waitFor(() => {
            fireEvent.press(screen.getByText('Restart'))
        })

        act(() => {
            fireEvent.press(screen.getByText('Restart'))
        })

        await waitFor(() => {
            screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID)
        })

        await isPuzzlePaused()

        const feedbackSheet = within(screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID))
        fireEvent.press(feedbackSheet.getByTestId(FEEDBACK_DND_BUTTON_TEST_ID))

        await hasPuzzleStarted()
    })
})