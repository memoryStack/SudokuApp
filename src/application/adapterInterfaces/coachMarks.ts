export type CoachMarksAdapter = {
    getUserLearnedToGetHints: () => Promise<boolean>
}

export enum COACHMARKS {
    HOW_TO_GET_HINTS = 'HOW_TO_GET_HINTS'
}
