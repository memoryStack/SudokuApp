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
    FEEDBACK_TEXT_INPUT_TEST_ID,
} from '../FeedbackBottomSheet'
import { restartGame } from '@application/usecases/restartGame'
const { renderHook } = require('@testing-library/react-hooks')

jest.mock('@adapters/gameSettings', () => {
    const originalModule = jest.requireActual('@adapters/gameSettings');
    return {
        gameSettingsAdapter: {
            ...originalModule.gameSettingsAdapter,
            shouldGameOverOnMistakesThresholdCrossed: jest.fn(() => true),
        }
    }
})

jest.mock('@application/usecases/restartGame', () => ({
    restartGame: jest.fn(),
}))

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

const mockUseFeedbackReturn = {
    feedbackRef: { current: { open: jest.fn(), close: jest.fn() } },
    showFeedbackSheet: false,
    handleGameOverAction: jest.fn(),
    handleSubmit: jest.fn(() => Promise.resolve({ success: true })),
    handleSkip: jest.fn(),
    handleDND: jest.fn(),
    handleFeedbackClosed: jest.fn(),
    incrementGamesLostCount: jest.fn(),
}

jest.mock('../hooks/useFeedback', () => ({
    useFeedback: jest.fn(() => mockUseFeedbackReturn)
}))

const { useFeedback } = require('../hooks/useFeedback')

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Feedback Dialog - UI Integration', () => {
    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()

        mockUseFeedbackReturn.showFeedbackSheet = true
        mockUseFeedbackReturn.handleSubmit.mockResolvedValue({ success: true })
    })

    afterEach(() => {
        jest.useRealTimers()
        mockUseFeedbackReturn.showFeedbackSheet = false
    })

    test('feedback dialog is shown when showFeedbackSheet is true', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await waitFor(() => {
            expect(screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID)).toBeOnTheScreen()
        })
    })

    test('clicking submit button calls handleSubmit with correct data format', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await waitFor(() => {
            screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID)
        })

        const feedbackSheet = within(screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID))
        fireEvent.press(feedbackSheet.getByTestId('FEEDBACK_PILL_HINTS'))
        fireEvent.changeText(feedbackSheet.getByTestId(FEEDBACK_TEXT_INPUT_TEST_ID), 'Test feedback text')
        fireEvent.press(feedbackSheet.getByTestId(FEEDBACK_SUBMIT_BUTTON_TEST_ID))

        await waitFor(() => {
            expect(mockUseFeedbackReturn.handleSubmit).toHaveBeenCalled()
        })
    })

    test('clicking skip button calls handleSkip', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await waitFor(() => {
            screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID)
        })

        const feedbackSheet = within(screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID))
        fireEvent.press(feedbackSheet.getByTestId(FEEDBACK_SKIP_BUTTON_TEST_ID))

        await waitFor(() => {
            expect(mockUseFeedbackReturn.handleSkip).toHaveBeenCalled()
        })
    })

    test('clicking DND button calls handleDND', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await waitFor(() => {
            screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID)
        })

        const feedbackSheet = within(screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID))
        fireEvent.press(feedbackSheet.getByTestId(FEEDBACK_DND_BUTTON_TEST_ID))

        await waitFor(() => {
            expect(mockUseFeedbackReturn.handleDND).toHaveBeenCalled()
        })
    })

    test('multiple pills can be selected', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await waitFor(() => {
            screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID)
        })

        const feedbackSheet = within(screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID))
        fireEvent.press(feedbackSheet.getByTestId('FEEDBACK_PILL_HINTS'))
        fireEvent.press(feedbackSheet.getByTestId('FEEDBACK_PILL_HARD'))
        fireEvent.press(feedbackSheet.getByTestId(FEEDBACK_SUBMIT_BUTTON_TEST_ID))

        await waitFor(() => {
            expect(mockUseFeedbackReturn.handleSubmit).toHaveBeenCalled()
        })
    })

    test('text input accepts user feedback up to 500 characters', async () => {
        await renderScreenAndWaitForPuzzleStart()

        await waitFor(() => {
            screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID)
        })

        const feedbackSheet = within(screen.getByTestId(FEEDBACK_BOTTOM_SHEET_TEST_ID))
        const textInput = feedbackSheet.getByTestId(FEEDBACK_TEXT_INPUT_TEST_ID)
        const longText = 'a'.repeat(500)
        fireEvent.changeText(textInput, longText)

        expect(textInput.props.value).toHaveLength(500)
    })
})

describe('Feedback Dialog - Game Over Flow', () => {
    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()
        mockUseFeedbackReturn.showFeedbackSheet = false
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    test('when game over and user clicks restart, handleGameOverAction is called with restart action', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await gameOverByMistakes()

        await waitFor(() => {
            screen.getByText('Restart')
        })

        act(() => {
            fireEvent.press(screen.getByText('Restart'))
        })

        await waitFor(() => {
            expect(mockUseFeedbackReturn.handleGameOverAction).toHaveBeenCalledWith('restart', expect.any(Boolean))
        })
    })

    test('when game over and user clicks new game, handleGameOverAction is called with newGame action', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await gameOverByMistakes()

        await waitFor(() => {
            screen.getByText('New Game')
        })

        act(() => {
            fireEvent.press(screen.getByText('New Game'))
        })

        await waitFor(() => {
            expect(mockUseFeedbackReturn.handleGameOverAction).toHaveBeenCalledWith('newGame', expect.any(Boolean))
        })
    })

    test('when game over and user dismisses overlay, handleGameOverAction is called with newGame action', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await gameOverByMistakes()

        await waitFor(() => {
            screen.getByTestId(GAME_OVER_CARD_OVERLAY_TEST_ID)
        })

        act(() => {
            fireEvent.press(screen.getByTestId(GAME_OVER_CARD_OVERLAY_TEST_ID))
        })

        await waitFor(() => {
            expect(mockUseFeedbackReturn.handleGameOverAction).toHaveBeenCalledWith('newGame', expect.any(Boolean))
        })
    })

    test('incrementGamesLostCount is called when game is lost', async () => {
        await renderScreenAndWaitForPuzzleStart()
        await gameOverByMistakes()

        await waitFor(() => {
            expect(mockUseFeedbackReturn.incrementGamesLostCount).toHaveBeenCalled()
        })
    })

    test('incrementGamesLostCount is NOT called when game is solved', async () => {
        mockUseFeedbackReturn.incrementGamesLostCount.mockClear()
        await renderScreenAndWaitForPuzzleStart()

        act(() => {
            solvePuzzle()
        })

        await waitFor(() => {
            screen.getByText('New Game')
        })

        expect(mockUseFeedbackReturn.incrementGamesLostCount).not.toHaveBeenCalled()
    })
})

describe('Feedback Dialog - API Integration', () => {
    let capturedRequest = null

    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()
        capturedRequest = null

        server.use(
            http.post('http://52.66.253.10:3000/feedbacks', async ({ request }) => {
                capturedRequest = await request.json()
                return HttpResponse.json({ success: true })
            })
        )
    })

    afterEach(() => {
        jest.useRealTimers()
        server.resetHandlers()
    })

    test('submitFeedback sends correct data format to server', async () => {
        const { feedbackAdapter } = require('src/adapters/feedbackAdapter')

        const testData = {
            improvements: ['Had trouble using hints', 'Too hard puzzles'],
            additionalFeedback: 'Test feedback message'
        }

        await feedbackAdapter.submitFeedback(testData)

        await waitFor(() => {
            expect(capturedRequest).toEqual({
                improvements: ['Had trouble using hints', 'Too hard puzzles'],
                additionalFeedback: 'Test feedback message'
            })
        })
    })

    test('submitFeedback sends empty arrays when no options selected', async () => {
        const { feedbackAdapter } = require('src/adapters/feedbackAdapter')

        const testData = {
            improvements: [],
            additionalFeedback: ''
        }

        await feedbackAdapter.submitFeedback(testData)

        await waitFor(() => {
            expect(capturedRequest).toEqual({
                improvements: [],
                additionalFeedback: ''
            })
        })
    })
})

describe('useFeedback Hook - shouldShowFeedback conditions', () => {
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
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
    })

    test('shouldShowFeedback returns false when game is solved', async () => {
        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        feedbackAdapter.getDNDStatus.mockResolvedValue(false)
        feedbackAdapter.hasProvidedFeedback.mockResolvedValue(false)
        feedbackAdapter.isFeedbackShownThisSession.mockReturnValue(false)
        feedbackAdapter.getGamesLostCount.mockResolvedValue(5)

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result: hookResult } = renderHook(() => realUseFeedback(mockParams))

        await hookResult?.current?.handleGameOverAction?.('restart', true)

        await waitFor(() => {
            expect(mockParams.onRestartGame).toHaveBeenCalled()
        })
    })

    test('shouldShowFeedback returns false when DND is enabled', async () => {
        feedbackAdapter.getDNDStatus.mockResolvedValue(true)
        feedbackAdapter.hasProvidedFeedback.mockResolvedValue(false)
        feedbackAdapter.isFeedbackShownThisSession.mockReturnValue(false)
        feedbackAdapter.getGamesLostCount.mockResolvedValue(5)

        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(mockParams.onRestartGame).toHaveBeenCalled()
        expect(result.current.showFeedbackSheet).toBe(false)
    })

    test('shouldShowFeedback returns false when feedback already provided', async () => {
        feedbackAdapter.getDNDStatus.mockResolvedValue(false)
        feedbackAdapter.hasProvidedFeedback.mockResolvedValue(true)
        feedbackAdapter.isFeedbackShownThisSession.mockReturnValue(false)
        feedbackAdapter.getGamesLostCount.mockResolvedValue(5)

        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(mockParams.onRestartGame).toHaveBeenCalled()
        expect(result.current.showFeedbackSheet).toBe(false)
    })

    test('shouldShowFeedback returns false when already shown this session', async () => {
        feedbackAdapter.getDNDStatus.mockResolvedValue(false)
        feedbackAdapter.hasProvidedFeedback.mockResolvedValue(false)
        feedbackAdapter.isFeedbackShownThisSession.mockReturnValue(true)
        feedbackAdapter.getGamesLostCount.mockResolvedValue(5)

        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(mockParams.onRestartGame).toHaveBeenCalled()
        expect(result.current.showFeedbackSheet).toBe(false)
    })

    test('shouldShowFeedback returns false when games lost count is less than 2', async () => {
        feedbackAdapter.getDNDStatus.mockResolvedValue(false)
        feedbackAdapter.hasProvidedFeedback.mockResolvedValue(false)
        feedbackAdapter.isFeedbackShownThisSession.mockReturnValue(false)
        feedbackAdapter.getGamesLostCount.mockResolvedValue(1)

        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(mockParams.onRestartGame).toHaveBeenCalled()
        expect(result.current.showFeedbackSheet).toBe(false)
    })

    test('shouldShowFeedback returns true when all conditions are like DND is not ON, feedback has not been provided, and games lost count is 2, feedback form not shown this session and games lost count is greater than or equal to 2', async () => {
        feedbackAdapter.getDNDStatus.mockResolvedValue(false)
        feedbackAdapter.hasProvidedFeedback.mockResolvedValue(false)
        feedbackAdapter.isFeedbackShownThisSession.mockReturnValue(false)
        feedbackAdapter.getGamesLostCount.mockResolvedValue(2)

        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(mockParams.onRestartGame).not.toHaveBeenCalled()
        expect(result.current.showFeedbackSheet).toBe(true)
    })
})

describe('useFeedback Hook - Adapter Method Calls', () => {
    const { feedbackAdapter } = require('src/adapters/feedbackAdapter')

    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()

        jest.spyOn(feedbackAdapter, 'getDNDStatus').mockResolvedValue(false)
        jest.spyOn(feedbackAdapter, 'hasProvidedFeedback').mockResolvedValue(false)
        jest.spyOn(feedbackAdapter, 'isFeedbackShownThisSession').mockReturnValue(false)
        jest.spyOn(feedbackAdapter, 'getGamesLostCount').mockResolvedValue(2)
        jest.spyOn(feedbackAdapter, 'setFeedbackShownThisSession')
        jest.spyOn(feedbackAdapter, 'setDNDStatus').mockResolvedValue()
        jest.spyOn(feedbackAdapter, 'setFeedbackProvided').mockResolvedValue()
        jest.spyOn(feedbackAdapter, 'resetGamesLostCount').mockResolvedValue()
        jest.spyOn(feedbackAdapter, 'incrementGamesLostCount').mockResolvedValue()
        jest.spyOn(feedbackAdapter, 'submitFeedback').mockResolvedValue({ success: true })
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
    })

    test('handleSubmit calls setFeedbackProvided and resetGamesLostCount on success', async () => {
        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        await act(async () => {
            await result.current.handleSubmit(['Had trouble using hints'], 'Test feedback')
        })

        expect(feedbackAdapter.submitFeedback).toHaveBeenCalledWith({
            improvements: ['Had trouble using hints'],
            additionalFeedback: 'Test feedback'
        })
        expect(feedbackAdapter.setFeedbackProvided).toHaveBeenCalled()
        expect(feedbackAdapter.resetGamesLostCount).toHaveBeenCalled()
    })

    test('handleSubmit does NOT call setFeedbackProvided or resetGamesLostCount on failure', async () => {
        feedbackAdapter.submitFeedback.mockResolvedValue({ success: false, error: 'Network error' })

        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        await act(async () => {
            await result.current.handleSubmit([], '')
        })

        expect(feedbackAdapter.setFeedbackProvided).not.toHaveBeenCalled()
        expect(feedbackAdapter.resetGamesLostCount).not.toHaveBeenCalled()
    })

    test('handleDND calls setDNDStatus with true', async () => {
        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('newGame', false)
        })

        await act(async () => {
            await result.current.handleDND()
        })

        expect(feedbackAdapter.setDNDStatus).toHaveBeenCalledWith(true)
    })

    test('setFeedbackShownThisSession is called when feedback dialog is shown', async () => {
        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(feedbackAdapter.setFeedbackShownThisSession).toHaveBeenCalled()
    })

    test('incrementGamesLostCount calls feedbackAdapter.incrementGamesLostCount', async () => {
        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.incrementGamesLostCount()
        })

        expect(feedbackAdapter.incrementGamesLostCount).toHaveBeenCalled()
    })
})

describe('useFeedback Hook - Once Per Session', () => {
    const { feedbackAdapter } = require('src/adapters/feedbackAdapter')

    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()

        jest.spyOn(feedbackAdapter, 'getDNDStatus').mockResolvedValue(false)
        jest.spyOn(feedbackAdapter, 'hasProvidedFeedback').mockResolvedValue(false)
        jest.spyOn(feedbackAdapter, 'getGamesLostCount').mockResolvedValue(5)
        jest.spyOn(feedbackAdapter, 'setFeedbackShownThisSession')
        jest.spyOn(feedbackAdapter, 'setDNDStatus').mockResolvedValue()
        jest.spyOn(feedbackAdapter, 'submitFeedback').mockResolvedValue({ success: true })
        jest.spyOn(feedbackAdapter, 'setFeedbackProvided').mockResolvedValue()
        jest.spyOn(feedbackAdapter, 'resetGamesLostCount').mockResolvedValue()
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
    })

    test('dialog shown once per session - second call does not show dialog after submit', async () => {
        let sessionShown = false
        jest.spyOn(feedbackAdapter, 'isFeedbackShownThisSession').mockImplementation(() => sessionShown)
        feedbackAdapter.setFeedbackShownThisSession.mockImplementation(() => {
            sessionShown = true
        })

        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result, rerender } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(result.current.showFeedbackSheet).toBe(true)

        await act(async () => {
            await result.current.handleSubmit([], '')
        })

        mockParams.onRestartGame.mockClear()

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(mockParams.onRestartGame).toHaveBeenCalled()
    })

    test('dialog shown once per session - second call does not show dialog after skip', async () => {
        let sessionShown = false
        jest.spyOn(feedbackAdapter, 'isFeedbackShownThisSession').mockImplementation(() => sessionShown)
        feedbackAdapter.setFeedbackShownThisSession.mockImplementation(() => {
            sessionShown = true
        })

        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('newGame', false)
        })

        expect(result.current.showFeedbackSheet).toBe(true)

        await act(async () => {
            result.current.handleSkip()
        })

        mockParams.onOpenNextGameMenu.mockClear()

        await act(async () => {
            await result.current.handleGameOverAction('newGame', false)
        })

        expect(mockParams.onOpenNextGameMenu).toHaveBeenCalled()
    })

    test('dialog shown once per session - second call does not show dialog after DND', async () => {
        let sessionShown = false
        jest.spyOn(feedbackAdapter, 'isFeedbackShownThisSession').mockImplementation(() => sessionShown)
        feedbackAdapter.setFeedbackShownThisSession.mockImplementation(() => {
            sessionShown = true
        })

        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(result.current.showFeedbackSheet).toBe(true)

        await act(async () => {
            await result.current.handleDND()
        })

        mockParams.onRestartGame.mockClear()

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(mockParams.onRestartGame).toHaveBeenCalled()
    })
})

describe('useFeedback Hook - Pending Action Execution', () => {
    const { feedbackAdapter } = require('src/adapters/feedbackAdapter')

    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()

        jest.spyOn(feedbackAdapter, 'getDNDStatus').mockResolvedValue(false)
        jest.spyOn(feedbackAdapter, 'hasProvidedFeedback').mockResolvedValue(false)
        jest.spyOn(feedbackAdapter, 'isFeedbackShownThisSession').mockReturnValue(false)
        jest.spyOn(feedbackAdapter, 'getGamesLostCount').mockResolvedValue(2)
        jest.spyOn(feedbackAdapter, 'setFeedbackShownThisSession')
        jest.spyOn(feedbackAdapter, 'setDNDStatus').mockResolvedValue()
        jest.spyOn(feedbackAdapter, 'setFeedbackProvided').mockResolvedValue()
        jest.spyOn(feedbackAdapter, 'resetGamesLostCount').mockResolvedValue()
        jest.spyOn(feedbackAdapter, 'submitFeedback').mockResolvedValue({ success: true })
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
    })

    test('pending restart action is executed after handleSubmit', async () => {
        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(mockParams.onRestartGame).not.toHaveBeenCalled()

        await act(async () => {
            await result.current.handleSubmit([], '')
        })

        expect(mockParams.onRestartGame).toHaveBeenCalled()
    })

    test('pending newGame action is executed after handleSubmit', async () => {
        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('newGame', false)
        })

        expect(mockParams.onOpenNextGameMenu).not.toHaveBeenCalled()

        await act(async () => {
            await result.current.handleSubmit([], '')
        })

        expect(mockParams.onOpenNextGameMenu).toHaveBeenCalled()
    })

    test('pending restart action is executed after handleSkip', async () => {
        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(mockParams.onRestartGame).not.toHaveBeenCalled()

        await act(async () => {
            result.current.handleSkip()
        })

        expect(mockParams.onRestartGame).toHaveBeenCalled()
    })

    test('pending newGame action is executed after handleDND', async () => {
        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('newGame', false)
        })

        expect(mockParams.onOpenNextGameMenu).not.toHaveBeenCalled()

        await act(async () => {
            await result.current.handleDND()
        })

        expect(mockParams.onOpenNextGameMenu).toHaveBeenCalled()
    })

    test('pending action is executed when feedback dialog is closed via handleFeedbackClosed', async () => {
        const { useFeedback: realUseFeedback } = jest.requireActual('../hooks/useFeedback')

        const mockParams = {
            analytics: undefined,
            onRestartGame: jest.fn(),
            onOpenNextGameMenu: jest.fn(),
        }

        const { result } = renderHook(() => realUseFeedback(mockParams))

        await act(async () => {
            await result.current.handleGameOverAction('restart', false)
        })

        expect(mockParams.onRestartGame).not.toHaveBeenCalled()

        await act(async () => {
            result.current.handleFeedbackClosed()
        })

        expect(mockParams.onRestartGame).toHaveBeenCalled()
    })
})

