import { LANGUAGE_KEYS } from '../../i18n/languages'

export const LANGUAGE_VS_TITLE_CHARS = {
    [LANGUAGE_KEYS.ENGLISH]: ['S', 'U', 'D', 'O', 'K', 'U'],
    [LANGUAGE_KEYS.HINDI]: ['सु', 'डो', 'कु'],
}

export const HOME_PAGE_TEST_ID = 'home_page_test_id'

/** Single source of truth for customize experience tooltip IDs (used for storage, translation keys, display order). */
export const CUSTOMIZE_EXPERIENCE_TOOLTIP_ID = {
    DARK_MODE: 'darkMode',
    FILL_NOTES_WITHOUT_PENCIL: 'fillNotesWithoutPencil',
    SHOW_FEEDBACK_ON_MISTAKE: 'showFeedbackOnMistake',
    SOUNDS_ENABLED: 'soundsEnabled',
    FILL_NUMBER_ON_CELL_CLICK: 'fillNumberOnCellClick',
}

/** Display order for tooltips. */
export const CUSTOMIZE_EXPERIENCE_TOOLTIP_IDS = [
    CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.DARK_MODE,
    CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.FILL_NOTES_WITHOUT_PENCIL,
    CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.SHOW_FEEDBACK_ON_MISTAKE,
    CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.SOUNDS_ENABLED,
    CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.FILL_NUMBER_ON_CELL_CLICK,
]

export const CUSTOMIZE_EXPERIENCE_TOOLTIP_DISPLAY_DURATION_MS = 8000

export const MIN_GAMES_SOLVED_FOR_TOOLTIP = 1
