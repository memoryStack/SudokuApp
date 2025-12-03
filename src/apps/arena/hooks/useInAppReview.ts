import { useState, useRef, useCallback } from 'react'
import { inAppReviewAdapter } from 'src/adapters/inAppReviewAdapter'
import type { InAppReviewShownEventData } from '@application/adapterInterfaces/analytics'

const MIN_GAMES_SOLVED_BEFORE_REVIEW = 3

interface UseInAppReviewParams {
    analytics?: {
        sendInAppReviewShownEvent: (data: InAppReviewShownEventData) => Promise<void>
        sendInAppReviewCompletedEvent: () => Promise<void>
    }
}

export const useInAppReview = ({
    analytics,
}: UseInAppReviewParams) => {
    const [showReviewSection, setShowReviewSection] = useState(false)
    const gamesSolvedCountRef = useRef<number>(0)

    const shouldShowReviewSection = useCallback(async (isGameSolved: boolean): Promise<boolean> => {
        if (!isGameSolved) return false

        if (inAppReviewAdapter.isReviewShownThisSession()) return false

        const hasProvided = await inAppReviewAdapter.hasReviewBeenProvided()
        if (hasProvided) return false

        const isAvailable = await inAppReviewAdapter.isInAppReviewAvailable()
        if (!isAvailable) return false

        const gamesSolved = await inAppReviewAdapter.getGamesSolvedCount()
        gamesSolvedCountRef.current = gamesSolved

        return gamesSolved >= MIN_GAMES_SOLVED_BEFORE_REVIEW
    }, [])

    const incrementGamesSolvedCount = useCallback(async () => {
        await inAppReviewAdapter.incrementGamesSolvedCount()
    }, [])

    const checkAndShowReviewSection = useCallback(async (isGameSolved: boolean) => {
        const shouldShow = await shouldShowReviewSection(isGameSolved)

        if (shouldShow) {
            setShowReviewSection(true)
            inAppReviewAdapter.setReviewShownThisSession()
            analytics?.sendInAppReviewShownEvent({ gamesSolvedBeforeShowing: gamesSolvedCountRef.current })
        }
    }, [shouldShowReviewSection, analytics])

    const requestReview = useCallback(async () => {
        const reviewCompleted = await inAppReviewAdapter.requestInAppReview()

        if (reviewCompleted) {
            await inAppReviewAdapter.setReviewProvided()
            await inAppReviewAdapter.resetGamesSolvedCount()
            analytics?.sendInAppReviewCompletedEvent()
            setShowReviewSection(false)
        }

    }, [analytics])

    const hideReviewSection = useCallback(() => {
        setShowReviewSection(false)
    }, [])

    return {
        showReviewSection,
        checkAndShowReviewSection,
        requestReview,
        hideReviewSection,
        incrementGamesSolvedCount,
    }
}
