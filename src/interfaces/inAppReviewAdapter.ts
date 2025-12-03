export interface InAppReviewAdapter {
    getGamesSolvedCount: () => Promise<number>
    incrementGamesSolvedCount: () => Promise<void>
    resetGamesSolvedCount: () => Promise<void>
    isReviewShownThisSession: () => boolean
    setReviewShownThisSession: () => void
    isInAppReviewAvailable: () => Promise<boolean>
    requestInAppReview: () => Promise<boolean>
    hasReviewBeenProvided: () => Promise<boolean>
    setReviewProvided: () => Promise<void>
}

