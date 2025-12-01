export type FeedbackData = {
    improvements: string[]
    additionalFeedback: string
}

export type FeedbackSubmitResponse = {
    success: boolean
    error?: string
}

export interface FeedbackAdapter {
    getDNDStatus: () => Promise<boolean>
    setDNDStatus: (status: boolean) => Promise<void>
    hasProvidedFeedback: () => Promise<boolean>
    setFeedbackProvided: () => Promise<void>
    getGamesLostCount: () => Promise<number>
    incrementGamesLostCount: () => Promise<void>
    resetGamesLostCount: () => Promise<void>
    isFeedbackShownThisSession: () => boolean
    setFeedbackShownThisSession: () => void
    submitFeedback: (data: FeedbackData) => Promise<FeedbackSubmitResponse>
}

