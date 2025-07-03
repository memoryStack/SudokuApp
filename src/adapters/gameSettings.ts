import { GameSettingsAdapter } from "@interfaces/gameSettingsAdapter"

const DEFAULT_SETTING = {
    ALLOW_ANY_NOTE_IN_CELL: false,
    FILL_NOTE_ON_SHORT_CLICK: false,
    HIGHLIGHT_CELLS: true,
    HIGHLIGHT_NUMBERS_FONTS: true,
    SOUNDS_ENABLED: true,
    SHOW_TIMER: true,
    MISTAKES_LIMIT: 3,
    REMIND_TO_TAKE_HINT: true,
}

/*
    1. init a local object here and make all of these queries sync
    2. add handler for updating the settings and refresh the local object
        with new settings
*/

export const gameSettingsAdapter: GameSettingsAdapter = {
    allowAnyNoteInCell: async () => {
        return DEFAULT_SETTING.ALLOW_ANY_NOTE_IN_CELL
    },
    fillNoteOnShortClick: async () => {
        return DEFAULT_SETTING.FILL_NOTE_ON_SHORT_CLICK
    },
    highlightCells: () => {
        return DEFAULT_SETTING.HIGHLIGHT_CELLS
    },
    highlightNumbersFonts: () => {
        return DEFAULT_SETTING.HIGHLIGHT_NUMBERS_FONTS
    },
    soundsEnabled: () => {
        return DEFAULT_SETTING.SOUNDS_ENABLED
    },
    showTimer: () => {
        return DEFAULT_SETTING.SHOW_TIMER
    },
    getMistakesLimit: () => {
        return DEFAULT_SETTING.MISTAKES_LIMIT
    },
    remindToTakeHint: () => {
        return DEFAULT_SETTING.REMIND_TO_TAKE_HINT
    }
}
