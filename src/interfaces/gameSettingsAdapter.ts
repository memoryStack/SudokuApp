import type {
    GameSettingsAdapter as ApplicationLayerGameSettingsAdapter
} from "@application/adapterInterfaces/gameSettings";

export enum GAME_SETTINGS_KEYS {
    ALLOW_ANY_NOTE_IN_CELL = 'ALLOW_ANY_NOTE_IN_CELL',
    FILL_NOTE_ON_SHORT_CLICK = 'FILL_NOTE_ON_SHORT_CLICK',
    HIGHLIGHT_CELLS = 'HIGHLIGHT_CELLS',
    HIGHLIGHT_NUMBERS_FONTS = 'HIGHLIGHT_NUMBERS_FONTS',
    SOUNDS_ENABLED = 'SOUNDS_ENABLED',
    SHOW_TIMER = 'SHOW_TIMER',
    MISTAKES_LIMIT = 'MISTAKES_LIMIT',
    REMIND_TO_TAKE_HINT = 'REMIND_TO_TAKE_HINT',
    GAME_OVER_ON_MISTAKES_THRESHOLD_CROSSED = 'GAME_OVER_ON_MISTAKES_THRESHOLD_CROSSED',
    SHOW_FEEDBACK_ON_MISTAKE = 'SHOW_FEEDBACK_ON_MISTAKE',
    FILL_NUMBER_ON_CELL_CLICK = 'FILL_NUMBER_ON_CELL_CLICK',
    DARK_MODE = 'DARK_MODE'
}

export type AllGameSettingsValues = Record<GAME_SETTINGS_KEYS, boolean | number | undefined>

export type UpdateGameSettingValueArgs = {
    key: GAME_SETTINGS_KEYS,
    value: boolean | number
}

export interface GameSettingsAdapter extends ApplicationLayerGameSettingsAdapter {
    init: () => Promise<void>
    fillNoteOnShortClick: () => boolean // will be removed
    highlightCells: () => boolean
    highlightNumbersFonts: () => boolean
    soundsEnabled: () => boolean
    showTimer: () => boolean
    getMistakesLimit: () => number
    remindToTakeHint: () => boolean
    getAllGameSettingsValues: () => Promise<AllGameSettingsValues>
    updateGameSettingValue: (args: UpdateGameSettingValueArgs) => Promise<void>
    shouldGameOverOnMistakesThresholdCrossed: () => boolean
    showFeedbackOnMistake: () => boolean
    fillNumberOnCellClick: () => boolean
    isDarkMode: () => boolean
}
