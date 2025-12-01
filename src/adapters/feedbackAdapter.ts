import { getKey, setKey } from '@utils/storage'
import type { FeedbackAdapter, FeedbackData, FeedbackSubmitResponse } from 'src/interfaces/feedbackAdapter'

const FEEDBACK_STORAGE_KEYS = {
    DND: 'FEEDBACK_DO_NOT_DISTURB',
    PROVIDED: 'FEEDBACK_ALREADY_PROVIDED',
    GAMES_LOST_COUNT: 'FEEDBACK_GAMES_LOST_COUNT'
}

const API_ENDPOINT = '/feedbacks'

let feedbackShownThisSession = false

const HOSTNAME = "http://52.66.253.10:3000";

export const feedbackAdapter: FeedbackAdapter = {
    getDNDStatus: async () => {
        const status = await getKey(FEEDBACK_STORAGE_KEYS.DND)
        return Boolean(status)
    },

    setDNDStatus: async (status: boolean) => {
        await setKey(FEEDBACK_STORAGE_KEYS.DND, status)
    },

    hasProvidedFeedback: async () => {
        const provided = await getKey(FEEDBACK_STORAGE_KEYS.PROVIDED)
        return Boolean(provided)
    },

    setFeedbackProvided: async () => {
        await setKey(FEEDBACK_STORAGE_KEYS.PROVIDED, true)
    },

    getGamesLostCount: async () => {
        const count = await getKey(FEEDBACK_STORAGE_KEYS.GAMES_LOST_COUNT)
        return typeof count === 'number' ? count : 0
    },

    incrementGamesLostCount: async () => {
        const currentCount = await feedbackAdapter.getGamesLostCount()
        await setKey(FEEDBACK_STORAGE_KEYS.GAMES_LOST_COUNT, currentCount + 1)
    },

    resetGamesLostCount: async () => {
        await setKey(FEEDBACK_STORAGE_KEYS.GAMES_LOST_COUNT, 0)
    },

    isFeedbackShownThisSession: () => {
        return feedbackShownThisSession
    },

    setFeedbackShownThisSession: () => {
        feedbackShownThisSession = true
    },

    submitFeedback: async (data: FeedbackData): Promise<FeedbackSubmitResponse> => {
        try {
            const response = await fetch(`${HOSTNAME}${API_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }
}

