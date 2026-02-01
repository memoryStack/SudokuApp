import {
    screen, fireEvent, waitFor, act,
} from '@utils/testing/testingLibrary'

import {
    renderScreenAndWaitForPuzzleStart,
    solvePuzzle,
} from '@utils/testing/arena'

import { GAME_OVER_CARD_OVERLAY_TEST_ID } from '../constants'
import { REVIEW_SECTION_TEST_ID, REVIEW_BUTTON_TEST_ID } from '../GameResultCard/gameResultCard.constants'

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

jest.mock('../hooks/useFeedback', () => ({
    useFeedback: jest.fn(() => ({
        feedbackRef: { current: { open: jest.fn(), close: jest.fn() } },
        showFeedbackSheet: false,
        handleGameOverAction: jest.fn(),
        handleSubmit: jest.fn(() => Promise.resolve({ success: true })),
        handleSkip: jest.fn(),
        handleDND: jest.fn(),
        handleFeedbackClosed: jest.fn(),
        incrementGamesLostCount: jest.fn(),
    }))
}))

const mockUseInAppReviewReturn = {
    showReviewSection: false,
    checkAndShowReviewSection: jest.fn(),
    requestReview: jest.fn(),
    hideReviewSection: jest.fn(),
    incrementGamesSolvedCount: jest.fn(),
}

jest.mock('../hooks/useInAppReview', () => ({
    useInAppReview: jest.fn(() => mockUseInAppReviewReturn)
}))

const { useInAppReview } = require('../hooks/useInAppReview')

describe('In-App Review - UI Integration', () => {
    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()
        mockUseInAppReviewReturn.showReviewSection = false
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    test('incrementGamesSolvedCount is called when game is solved', async () => {
        await renderScreenAndWaitForPuzzleStart()

        act(() => {
            solvePuzzle()
        })

        await waitFor(() => {
            screen.getByText('New Game')
        })

        expect(mockUseInAppReviewReturn.incrementGamesSolvedCount).toHaveBeenCalled()
    })

    test('checkAndShowReviewSection is called when game is solved', async () => {
        await renderScreenAndWaitForPuzzleStart()

        act(() => {
            solvePuzzle()
        })

        await waitFor(() => {
            screen.getByText('New Game')
        })

        expect(mockUseInAppReviewReturn.checkAndShowReviewSection).toHaveBeenCalledWith(true)
    })

    test('hideReviewSection is called when new game button is clicked after solving', async () => {
        await renderScreenAndWaitForPuzzleStart()

        act(() => {
            solvePuzzle()
        })

        await waitFor(() => {
            screen.getByText('New Game')
        })

        act(() => {
            fireEvent.press(screen.getByText('New Game'))
        })

        await waitFor(() => {
            expect(mockUseInAppReviewReturn.hideReviewSection).toHaveBeenCalled()
        })
    })

    test('hideReviewSection is called when game over overlay is dismissed', async () => {
        await renderScreenAndWaitForPuzzleStart()

        act(() => {
            solvePuzzle()
        })

        await waitFor(() => {
            screen.getByTestId(GAME_OVER_CARD_OVERLAY_TEST_ID)
        })

        act(() => {
            fireEvent.press(screen.getByTestId(GAME_OVER_CARD_OVERLAY_TEST_ID))
        })

        await waitFor(() => {
            expect(mockUseInAppReviewReturn.hideReviewSection).toHaveBeenCalled()
        })
    })
})

describe('useInAppReview Hook - shouldShowReviewSection conditions', () => {
    const { inAppReviewAdapter } = require('src/adapters/inAppReviewAdapter')

    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()

        jest.spyOn(inAppReviewAdapter, 'isReviewShownThisSession')
        jest.spyOn(inAppReviewAdapter, 'hasReviewBeenProvided')
        jest.spyOn(inAppReviewAdapter, 'isInAppReviewAvailable')
        jest.spyOn(inAppReviewAdapter, 'getGamesSolvedCount')
        jest.spyOn(inAppReviewAdapter, 'setReviewShownThisSession')
        jest.spyOn(inAppReviewAdapter, 'requestInAppReview')
        jest.spyOn(inAppReviewAdapter, 'incrementGamesSolvedCount')
        jest.spyOn(inAppReviewAdapter, 'resetGamesSolvedCount')
        jest.spyOn(inAppReviewAdapter, 'setReviewProvided')
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
    })

    test('review section is NOT shown when game is unsolved', async () => {
        inAppReviewAdapter.isReviewShownThisSession.mockReturnValue(false)
        inAppReviewAdapter.hasReviewBeenProvided.mockResolvedValue(false)
        inAppReviewAdapter.isInAppReviewAvailable.mockResolvedValue(true)
        inAppReviewAdapter.getGamesSolvedCount.mockResolvedValue(5)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(false)
        })

        expect(result.current.showReviewSection).toBe(false)
    })

    test('review section is NOT shown when already shown this session', async () => {
        inAppReviewAdapter.isReviewShownThisSession.mockReturnValue(true)
        inAppReviewAdapter.hasReviewBeenProvided.mockResolvedValue(false)
        inAppReviewAdapter.isInAppReviewAvailable.mockResolvedValue(true)
        inAppReviewAdapter.getGamesSolvedCount.mockResolvedValue(5)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(result.current.showReviewSection).toBe(false)
    })

    test('review section is NOT shown when review has already been provided', async () => {
        inAppReviewAdapter.isReviewShownThisSession.mockReturnValue(false)
        inAppReviewAdapter.hasReviewBeenProvided.mockResolvedValue(true)
        inAppReviewAdapter.isInAppReviewAvailable.mockResolvedValue(true)
        inAppReviewAdapter.getGamesSolvedCount.mockResolvedValue(5)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(result.current.showReviewSection).toBe(false)
    })

    test('review section is NOT shown when in-app review is not available', async () => {
        inAppReviewAdapter.isReviewShownThisSession.mockReturnValue(false)
        inAppReviewAdapter.hasReviewBeenProvided.mockResolvedValue(false)
        inAppReviewAdapter.isInAppReviewAvailable.mockResolvedValue(false)
        inAppReviewAdapter.getGamesSolvedCount.mockResolvedValue(5)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(result.current.showReviewSection).toBe(false)
    })

    test('review section is NOT shown when games solved count is less than 3', async () => {
        inAppReviewAdapter.isReviewShownThisSession.mockReturnValue(false)
        inAppReviewAdapter.hasReviewBeenProvided.mockResolvedValue(false)
        inAppReviewAdapter.isInAppReviewAvailable.mockResolvedValue(true)
        inAppReviewAdapter.getGamesSolvedCount.mockResolvedValue(2)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(result.current.showReviewSection).toBe(false)
    })

    test('review section IS shown when all conditions are met', async () => {
        inAppReviewAdapter.isReviewShownThisSession.mockReturnValue(false)
        inAppReviewAdapter.hasReviewBeenProvided.mockResolvedValue(false)
        inAppReviewAdapter.isInAppReviewAvailable.mockResolvedValue(true)
        inAppReviewAdapter.getGamesSolvedCount.mockResolvedValue(3)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(result.current.showReviewSection).toBe(true)
    })
})

describe('useInAppReview Hook - Review Provided Condition', () => {
    const { inAppReviewAdapter } = require('src/adapters/inAppReviewAdapter')

    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()

        jest.spyOn(inAppReviewAdapter, 'isReviewShownThisSession').mockReturnValue(false)
        jest.spyOn(inAppReviewAdapter, 'hasReviewBeenProvided')
        jest.spyOn(inAppReviewAdapter, 'isInAppReviewAvailable').mockResolvedValue(true)
        jest.spyOn(inAppReviewAdapter, 'getGamesSolvedCount').mockResolvedValue(5)
        jest.spyOn(inAppReviewAdapter, 'setReviewShownThisSession')
        jest.spyOn(inAppReviewAdapter, 'requestInAppReview')
        jest.spyOn(inAppReviewAdapter, 'resetGamesSolvedCount').mockResolvedValue()
        jest.spyOn(inAppReviewAdapter, 'setReviewProvided').mockResolvedValue()
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
    })

    test('setReviewProvided is called when review is completed successfully', async () => {
        inAppReviewAdapter.hasReviewBeenProvided.mockResolvedValue(false)
        inAppReviewAdapter.requestInAppReview.mockResolvedValue(true)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        await act(async () => {
            await result.current.requestReview()
        })

        expect(inAppReviewAdapter.setReviewProvided).toHaveBeenCalled()
    })

    test('setReviewProvided is NOT called when review flow fails', async () => {
        inAppReviewAdapter.hasReviewBeenProvided.mockResolvedValue(false)
        inAppReviewAdapter.requestInAppReview.mockResolvedValue(false)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        await act(async () => {
            await result.current.requestReview()
        })

        expect(inAppReviewAdapter.setReviewProvided).not.toHaveBeenCalled()
    })

    test('review section is never shown again after review has been provided', async () => {
        // First time - review not provided yet
        inAppReviewAdapter.hasReviewBeenProvided.mockResolvedValue(false)
        inAppReviewAdapter.requestInAppReview.mockResolvedValue(true)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result, rerender } = renderHook(() => realUseInAppReview(mockParams))

        // Show and complete review
        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })
        expect(result.current.showReviewSection).toBe(true)

        await act(async () => {
            await result.current.requestReview()
        })

        // Now simulate review has been provided
        inAppReviewAdapter.hasReviewBeenProvided.mockResolvedValue(true)
        inAppReviewAdapter.isReviewShownThisSession.mockReturnValue(false)

        // Try to show again - should not show
        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(result.current.showReviewSection).toBe(false)
    })
})

describe('useInAppReview Hook - Regular Interval of 3 Games', () => {
    const { inAppReviewAdapter } = require('src/adapters/inAppReviewAdapter')

    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()

        jest.spyOn(inAppReviewAdapter, 'isReviewShownThisSession')
        jest.spyOn(inAppReviewAdapter, 'hasReviewBeenProvided').mockResolvedValue(false)
        jest.spyOn(inAppReviewAdapter, 'isInAppReviewAvailable').mockResolvedValue(true)
        jest.spyOn(inAppReviewAdapter, 'getGamesSolvedCount')
        jest.spyOn(inAppReviewAdapter, 'setReviewShownThisSession')
        jest.spyOn(inAppReviewAdapter, 'requestInAppReview').mockResolvedValue(true)
        jest.spyOn(inAppReviewAdapter, 'incrementGamesSolvedCount').mockResolvedValue()
        jest.spyOn(inAppReviewAdapter, 'resetGamesSolvedCount').mockResolvedValue()
        jest.spyOn(inAppReviewAdapter, 'setReviewProvided').mockResolvedValue()
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
    })

    test('review section is shown at exactly 3 games solved', async () => {
        let sessionShown = false
        inAppReviewAdapter.isReviewShownThisSession.mockImplementation(() => sessionShown)
        inAppReviewAdapter.setReviewShownThisSession.mockImplementation(() => {
            sessionShown = true
        })
        inAppReviewAdapter.getGamesSolvedCount.mockResolvedValue(3)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(result.current.showReviewSection).toBe(true)
        expect(mockParams.analytics.sendInAppReviewCtaShownOnGameOverEvent).toHaveBeenCalledWith({ gamesSolvedBeforeShowing: 3 })
    })

    test('review section is shown at 6 games solved (second interval)', async () => {
        let sessionShown = false
        inAppReviewAdapter.isReviewShownThisSession.mockImplementation(() => sessionShown)
        inAppReviewAdapter.setReviewShownThisSession.mockImplementation(() => {
            sessionShown = true
        })
        inAppReviewAdapter.getGamesSolvedCount.mockResolvedValue(6)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(result.current.showReviewSection).toBe(true)
        expect(mockParams.analytics.sendInAppReviewCtaShownOnGameOverEvent).toHaveBeenCalledWith({ gamesSolvedBeforeShowing: 6 })
    })

    test('games solved count is reset after successful review', async () => {
        inAppReviewAdapter.isReviewShownThisSession.mockReturnValue(false)
        inAppReviewAdapter.getGamesSolvedCount.mockResolvedValue(3)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        await act(async () => {
            await result.current.requestReview()
        })

        expect(inAppReviewAdapter.resetGamesSolvedCount).toHaveBeenCalled()
    })

    test('incrementGamesSolvedCount calls adapter method', async () => {
        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.incrementGamesSolvedCount()
        })

        expect(inAppReviewAdapter.incrementGamesSolvedCount).toHaveBeenCalled()
    })
})

describe('useInAppReview Hook - Request Review on Button Click', () => {
    const { inAppReviewAdapter } = require('src/adapters/inAppReviewAdapter')

    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()

        jest.spyOn(inAppReviewAdapter, 'isReviewShownThisSession').mockReturnValue(false)
        jest.spyOn(inAppReviewAdapter, 'hasReviewBeenProvided').mockResolvedValue(false)
        jest.spyOn(inAppReviewAdapter, 'isInAppReviewAvailable').mockResolvedValue(true)
        jest.spyOn(inAppReviewAdapter, 'getGamesSolvedCount').mockResolvedValue(3)
        jest.spyOn(inAppReviewAdapter, 'setReviewShownThisSession')
        jest.spyOn(inAppReviewAdapter, 'requestInAppReview')
        jest.spyOn(inAppReviewAdapter, 'resetGamesSolvedCount').mockResolvedValue()
        jest.spyOn(inAppReviewAdapter, 'setReviewProvided').mockResolvedValue()
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
    })

    test('requestInAppReview is called when requestReview is invoked', async () => {
        inAppReviewAdapter.requestInAppReview.mockResolvedValue(true)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        await act(async () => {
            await result.current.requestReview()
        })

        expect(inAppReviewAdapter.requestInAppReview).toHaveBeenCalled()
    })

    test('showReviewSection becomes false after requestReview is called', async () => {
        inAppReviewAdapter.requestInAppReview.mockResolvedValue(true)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(result.current.showReviewSection).toBe(true)

        await act(async () => {
            await result.current.requestReview()
        })

        expect(result.current.showReviewSection).toBe(false)
    })

    test('showReviewSection stays true even if review fails', async () => {
        inAppReviewAdapter.requestInAppReview.mockResolvedValue(false)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(result.current.showReviewSection).toBe(true)

        await act(async () => {
            await result.current.requestReview()
        })

        expect(result.current.showReviewSection).toBe(true)
    })
})

describe('useInAppReview Hook - Analytics Events', () => {
    const { inAppReviewAdapter } = require('src/adapters/inAppReviewAdapter')

    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()

        jest.spyOn(inAppReviewAdapter, 'isReviewShownThisSession').mockReturnValue(false)
        jest.spyOn(inAppReviewAdapter, 'hasReviewBeenProvided').mockResolvedValue(false)
        jest.spyOn(inAppReviewAdapter, 'isInAppReviewAvailable').mockResolvedValue(true)
        jest.spyOn(inAppReviewAdapter, 'getGamesSolvedCount').mockResolvedValue(3)
        jest.spyOn(inAppReviewAdapter, 'setReviewShownThisSession')
        jest.spyOn(inAppReviewAdapter, 'requestInAppReview')
        jest.spyOn(inAppReviewAdapter, 'resetGamesSolvedCount').mockResolvedValue()
        jest.spyOn(inAppReviewAdapter, 'setReviewProvided').mockResolvedValue()
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
    })

    test('sendInAppReviewCtaShownOnGameOverEvent is called when review section is shown', async () => {
        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(mockParams.analytics.sendInAppReviewCtaShownOnGameOverEvent).toHaveBeenCalledWith({ gamesSolvedBeforeShowing: 3 })
    })

    test('sendInAppReviewFormShownEvent is called when review flow completes successfully', async () => {
        inAppReviewAdapter.requestInAppReview.mockResolvedValue(true)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        await act(async () => {
            await result.current.requestReview()
        })

        expect(mockParams.analytics.sendInAppReviewFormShownEvent).toHaveBeenCalled()
    })

    test('sendInAppReviewFormShownEvent is NOT called when review flow fails', async () => {
        inAppReviewAdapter.requestInAppReview.mockResolvedValue(false)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        await act(async () => {
            await result.current.requestReview()
        })

        expect(mockParams.analytics.sendInAppReviewFormShownEvent).not.toHaveBeenCalled()
    })
})

describe('useInAppReview Hook - Once Per Session', () => {
    const { inAppReviewAdapter } = require('src/adapters/inAppReviewAdapter')

    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'],
            timerLimit: 100,
        })
        jest.clearAllMocks()

        jest.spyOn(inAppReviewAdapter, 'hasReviewBeenProvided').mockResolvedValue(false)
        jest.spyOn(inAppReviewAdapter, 'isInAppReviewAvailable').mockResolvedValue(true)
        jest.spyOn(inAppReviewAdapter, 'getGamesSolvedCount').mockResolvedValue(5)
        jest.spyOn(inAppReviewAdapter, 'setReviewShownThisSession')
        jest.spyOn(inAppReviewAdapter, 'requestInAppReview').mockResolvedValue(true)
        jest.spyOn(inAppReviewAdapter, 'resetGamesSolvedCount').mockResolvedValue()
        jest.spyOn(inAppReviewAdapter, 'setReviewProvided').mockResolvedValue()
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
    })

    test('review section is shown only once per session - second call does not show', async () => {
        let sessionShown = false
        jest.spyOn(inAppReviewAdapter, 'isReviewShownThisSession').mockImplementation(() => sessionShown)
        inAppReviewAdapter.setReviewShownThisSession.mockImplementation(() => {
            sessionShown = true
        })

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        // First call - should show
        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(result.current.showReviewSection).toBe(true)

        // Complete the review and hide
        await act(async () => {
            await result.current.requestReview()
        })

        // Second call - should NOT show
        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(result.current.showReviewSection).toBe(false)
    })

    test('setReviewShownThisSession is called when review section is shown', async () => {
        jest.spyOn(inAppReviewAdapter, 'isReviewShownThisSession').mockReturnValue(false)

        const { useInAppReview: realUseInAppReview } = jest.requireActual('../hooks/useInAppReview')

        const mockParams = {
            analytics: {
                sendInAppReviewCtaShownOnGameOverEvent: jest.fn(),
                sendInAppReviewFormShownEvent: jest.fn(),
            },
        }

        const { result } = renderHook(() => realUseInAppReview(mockParams))

        await act(async () => {
            await result.current.checkAndShowReviewSection(true)
        })

        expect(inAppReviewAdapter.setReviewShownThisSession).toHaveBeenCalled()
    })
})
