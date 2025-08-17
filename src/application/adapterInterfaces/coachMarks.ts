export type CoachMarksAdapter = {
    getUserLearnedToGetHints: () => Promise<boolean>
    increaseHintsMenuTooltipShownCount: () => Promise<void>
    getHintsMenuTooltipCount: () => Promise<number>
    getCustomizeExperienceTooltipShownCount: () => Promise<number>
    increaseCustomizeExperienceTooltipShownCount: () => Promise<void>
    getCustomizeExperiencePreviewTooltipShownCount: () => Promise<number>
    increaseCustomizeExperiencePreviewTooltipShownCount: () => Promise<void>
}

export const MAX_HINTS_MENU_TOOLTIP_SHOWN_COUNT = 3
export const CUSTOMIZE_EXPERIENCE_TOOLTIP_SHOWN_COUNT_THRESHOLD = 3
export const MAX_GAME_SETTINGS_PRVIEW_TOOLTIP_SHOWN_COUNT = 2
export enum COACHMARKS {
    HOW_TO_GET_HINTS = 'HOW_TO_GET_HINTS',
    HINTS_MENU_TOOLTIP = 'HINTS_MENU_TOOLTIP',
    CUSTOMIZE_EXPERIENCE_TOOLTIP = 'CUSTOMIZE_EXPERIENCE_TOOLTIP',
    GAME_SETTINGS_PREVIEW_TOOLTIP = 'GAME_SETTINGS_PREVIEW_TOOLTIP'
}
