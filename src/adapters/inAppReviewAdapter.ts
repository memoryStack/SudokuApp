import InAppReview from 'react-native-in-app-review'

import { getKey, setKey } from '@utils/storage'
import { Platform } from '@utils/classes/platform'

import type { InAppReviewAdapter } from 'src/interfaces/inAppReviewAdapter'

const IN_APP_REVIEW_STORAGE_KEYS = {
    GAMES_SOLVED_COUNT: 'IN_APP_REVIEW_GAMES_SOLVED_COUNT',
    REVIEW_PROVIDED: 'IN_APP_REVIEW_PROVIDED',
}

let reviewShownThisSession = false

export const inAppReviewAdapter: InAppReviewAdapter = {
    getGamesSolvedCount: async () => {
        const count = await getKey<number>(IN_APP_REVIEW_STORAGE_KEYS.GAMES_SOLVED_COUNT)
        return typeof count === 'number' ? count : 0
    },

    incrementGamesSolvedCount: async () => {
        const currentCount = await inAppReviewAdapter.getGamesSolvedCount()
        await setKey(IN_APP_REVIEW_STORAGE_KEYS.GAMES_SOLVED_COUNT, currentCount + 1)
    },

    resetGamesSolvedCount: async () => {
        await setKey(IN_APP_REVIEW_STORAGE_KEYS.GAMES_SOLVED_COUNT, 0)
    },

    isReviewShownThisSession: () => {
        return reviewShownThisSession
    },

    setReviewShownThisSession: () => {
        reviewShownThisSession = true
    },

    isInAppReviewAvailable: async () => {
        if (!Platform.isAndroid()) return false
        return InAppReview.isAvailable()
    },

    requestInAppReview: async () => {
        if (!Platform.isAndroid()) return false

        try {
            const isAvailable = InAppReview.isAvailable()
            if (!isAvailable) return false

            const hasFlowFinished = await InAppReview.RequestInAppReview()
            return hasFlowFinished
        } catch {
            return false
        }
    },

    hasReviewBeenProvided: async () => {
        const provided = await getKey<boolean>(IN_APP_REVIEW_STORAGE_KEYS.REVIEW_PROVIDED)
        return Boolean(provided)
    },

    setReviewProvided: async () => {
        await setKey(IN_APP_REVIEW_STORAGE_KEYS.REVIEW_PROVIDED, true)
    },
}

