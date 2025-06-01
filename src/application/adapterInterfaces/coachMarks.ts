export type CoachMarksAdapter = {
    getUserLearnedToGetHints: () => Promise<boolean>
    increaseHintsMenuTooltipShownCount: () => Promise<void>
    getHintsMenuTooltipCount: () => Promise<number>
}

export const MAX_HINTS_MENU_TOOLTIP_SHOWN_COUNT = 3

export enum COACHMARKS {
    HOW_TO_GET_HINTS = 'HOW_TO_GET_HINTS',
    HINTS_MENU_TOOLTIP = 'HINTS_MENU_TOOLTIP'
}
