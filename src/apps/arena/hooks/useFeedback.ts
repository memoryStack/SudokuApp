import { useState, useRef, useCallback, useEffect } from 'react'
import { feedbackAdapter } from 'src/adapters/feedbackAdapter'
import type { FeedbackBottomSheetRef } from '../FeedbackBottomSheet'

const MIN_GAMES_LOST_BEFORE_FEEDBACK = 2

type PendingAction = 'restart' | 'newGame' | null

interface UseFeedbackParams {
    analytics?: {
        sendFeedbackDialogShownEvent: (data: { gamesLostBeforeShowing: number }) => Promise<void>
        sendFeedbackSubmittedEvent: (data: { improvements: string[], hasAdditionalText: boolean }) => Promise<void>
        sendFeedbackSkippedEvent: () => Promise<void>
        sendFeedbackDNDSelectedEvent: () => Promise<void>
        sendFeedbackApiErrorEvent: (error: string) => Promise<void>
    }
    onRestartGame: () => void
    onOpenNextGameMenu: () => void
}

export const useFeedback = ({
    analytics,
    onRestartGame,
    onOpenNextGameMenu,
}: UseFeedbackParams) => {
    const feedbackRef = useRef<FeedbackBottomSheetRef>(null)
    const [showFeedbackSheet, setShowFeedbackSheet] = useState(false)
    const pendingActionRef = useRef<PendingAction>(null)
    const gamesLostCountRef = useRef<number>(0)

    const shouldShowFeedback = useCallback(async (isGameSolved: boolean): Promise<boolean> => {
        if (isGameSolved) return false

        const isDND = await feedbackAdapter.getDNDStatus()
        if (isDND) return false

        const hasProvided = await feedbackAdapter.hasProvidedFeedback()
        if (hasProvided) return false

        if (feedbackAdapter.isFeedbackShownThisSession()) return false

        const gamesLost = await feedbackAdapter.getGamesLostCount()
        gamesLostCountRef.current = gamesLost
        return gamesLost >= MIN_GAMES_LOST_BEFORE_FEEDBACK
    }, [])

    const incrementGamesLostCount = useCallback(async () => {
        await feedbackAdapter.incrementGamesLostCount()
    }, [])

    const showFeedbackDialog = useCallback(() => {
        setShowFeedbackSheet(true)
        feedbackAdapter.setFeedbackShownThisSession()
        analytics?.sendFeedbackDialogShownEvent({ gamesLostBeforeShowing: gamesLostCountRef.current })
    }, [analytics])

    useEffect(() => {
        if (showFeedbackSheet && feedbackRef.current) {
            feedbackRef.current.open()
        }
    }, [showFeedbackSheet])

    const handleGameOverAction = useCallback(async (
        action: 'restart' | 'newGame',
        isGameSolved: boolean
    ) => {
        const shouldShow = await shouldShowFeedback(isGameSolved)

        if (shouldShow) {
            pendingActionRef.current = action
            showFeedbackDialog()
        } else {
            if (action === 'restart') {
                onRestartGame()
            } else {
                onOpenNextGameMenu()
            }
        }
    }, [shouldShowFeedback, showFeedbackDialog, onRestartGame, onOpenNextGameMenu])

    const executePendingAction = useCallback(() => {
        const action = pendingActionRef.current
        pendingActionRef.current = null
        setShowFeedbackSheet(false)

        if (action === 'restart') {
            onRestartGame()
        } else if (action === 'newGame') {
            onOpenNextGameMenu()
        }
    }, [onRestartGame, onOpenNextGameMenu])

    const handleSubmit = useCallback(async (improvements: string[], additionalFeedback: string) => {
        const result = await feedbackAdapter.submitFeedback({ improvements, additionalFeedback })

        analytics?.sendFeedbackSubmittedEvent({
            improvements,
            hasAdditionalText: additionalFeedback.length > 0,
        })

        if (result.success) {
            await feedbackAdapter.setFeedbackProvided()
            await feedbackAdapter.resetGamesLostCount()
        } else {
            analytics?.sendFeedbackApiErrorEvent(result.error || 'Unknown error')
        }

        executePendingAction()
        return result
    }, [analytics, executePendingAction])

    const handleSkip = useCallback(() => {
        analytics?.sendFeedbackSkippedEvent()
        executePendingAction()
    }, [analytics, executePendingAction])

    const handleDND = useCallback(async () => {
        await feedbackAdapter.setDNDStatus(true)
        analytics?.sendFeedbackDNDSelectedEvent()
        executePendingAction()
    }, [analytics, executePendingAction])

    const handleFeedbackClosed = useCallback(() => {
        if (pendingActionRef.current) {
            executePendingAction()
        }
    }, [executePendingAction])

    return {
        feedbackRef,
        showFeedbackSheet,
        handleGameOverAction,
        handleSubmit,
        handleSkip,
        handleDND,
        handleFeedbackClosed,
        incrementGamesLostCount,
    }
}

