import { getKey, setKey } from "@utils/storage"
import { INITIAL_STATE } from "src/apps/arena/store/state/refree.state"
import { AllGameSettingsValues, GAME_SETTINGS_KEYS, GameSettingsAdapter, UpdateGameSettingValueArgs } from "src/interfaces/gameSettingsAdapter"

const DEFAULT_SETTING = {
    [GAME_SETTINGS_KEYS.ALLOW_ANY_NOTE_IN_CELL]: false,
    [GAME_SETTINGS_KEYS.FILL_NOTE_ON_SHORT_CLICK]: false,
    [GAME_SETTINGS_KEYS.HIGHLIGHT_CELLS]: true,
    [GAME_SETTINGS_KEYS.HIGHLIGHT_NUMBERS_FONTS]: true,
    [GAME_SETTINGS_KEYS.SOUNDS_ENABLED]: true,
    [GAME_SETTINGS_KEYS.SHOW_TIMER]: true,
    [GAME_SETTINGS_KEYS.MISTAKES_LIMIT]: INITIAL_STATE.maxMistakesLimit,
    [GAME_SETTINGS_KEYS.REMIND_TO_TAKE_HINT]: true,
    [GAME_SETTINGS_KEYS.GAME_OVER_ON_MISTAKES_THRESHOLD_CROSSED]: false,
    [GAME_SETTINGS_KEYS.SHOW_FEEDBACK_ON_MISTAKE]: true,
    [GAME_SETTINGS_KEYS.FILL_NUMBER_ON_CELL_CLICK]: true,
}

let currentSettings = {
    ...DEFAULT_SETTING
} as AllGameSettingsValues

const GAME_SETTINGS_STORAGE_KEY = 'GAME_SETTINGS_STORAGE'

export const gameSettingsAdapter: GameSettingsAdapter = {
    init: async () => {
        currentSettings = await getKey(GAME_SETTINGS_STORAGE_KEY) ?? { ...DEFAULT_SETTING }
    },
    allowAnyNoteInCell: () => {
        return currentSettings[GAME_SETTINGS_KEYS.ALLOW_ANY_NOTE_IN_CELL] as boolean
    },
    fillNoteOnShortClick: () => {
        return currentSettings[GAME_SETTINGS_KEYS.FILL_NOTE_ON_SHORT_CLICK] as boolean
    },
    highlightCells: () => {
        return currentSettings[GAME_SETTINGS_KEYS.HIGHLIGHT_CELLS] as boolean
    },
    highlightNumbersFonts: () => {
        return currentSettings[GAME_SETTINGS_KEYS.HIGHLIGHT_NUMBERS_FONTS] as boolean
    },
    soundsEnabled: () => {
        return currentSettings[GAME_SETTINGS_KEYS.SOUNDS_ENABLED] as boolean
    },
    showTimer: () => {
        return true
        return currentSettings[GAME_SETTINGS_KEYS.SHOW_TIMER] as boolean
    },
    getMistakesLimit: () => {
        return currentSettings[GAME_SETTINGS_KEYS.MISTAKES_LIMIT] as number
    },
    remindToTakeHint: () => {
        return currentSettings[GAME_SETTINGS_KEYS.REMIND_TO_TAKE_HINT] as boolean
    },
    getAllGameSettingsValues: async () => {
        return { ...currentSettings }
    },
    shouldGameOverOnMistakesThresholdCrossed: () => {
        return currentSettings[GAME_SETTINGS_KEYS.GAME_OVER_ON_MISTAKES_THRESHOLD_CROSSED] as boolean
    },
    showFeedbackOnMistake: () => {
        return currentSettings[GAME_SETTINGS_KEYS.SHOW_FEEDBACK_ON_MISTAKE] as boolean
    },
    updateGameSettingValue: async (args: UpdateGameSettingValueArgs) => {
        await setKey(GAME_SETTINGS_STORAGE_KEY, {
            ...currentSettings,
            [args.key]: args.value
        })
        currentSettings = await getKey(GAME_SETTINGS_STORAGE_KEY) ?? { ...DEFAULT_SETTING }
    },
    fillNumberOnCellClick: () => {
        return currentSettings[GAME_SETTINGS_KEYS.FILL_NUMBER_ON_CELL_CLICK] as boolean
    }
}
