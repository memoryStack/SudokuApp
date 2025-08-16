import { GAME_SETTINGS_KEYS } from "@interfaces/gameSettingsAdapter";

export enum GAME_SETTINGS_STATE {
    BOARD = 'gameSettingsPreview',
    BOARD_CONTROLLER = 'gameSettingsBoardController',
    GAME_STATE = 'gameSettingsGameState'
}

export enum OPTION_STATES {
    ON = 'ON',
    OFF = 'OFF'
}

export enum DYNAMIC_DATA_KEYS {
    MISTAKES_LIMIT = 'MISTAKES_LIMIT'
}

export const SNACKBAR_MSGS = {
    [GAME_SETTINGS_KEYS.SOUNDS_ENABLED]: {
        [OPTION_STATES.ON]: 'sounds have been enabled. now try pressing any cell in puzzle and you will hear it',
        [OPTION_STATES.OFF]: 'no more sounds in game. wish you a nice meditative session',
    },
    [GAME_SETTINGS_KEYS.ALLOW_ANY_NOTE_IN_CELL]: {
        [OPTION_STATES.ON]: 'all the numbers from 1-9 can be filled as notes in any cell',
        [OPTION_STATES.OFF]: "only numbers which are not filled in a cell's row, column or block will be filled as notes",
    },
    [GAME_SETTINGS_KEYS.FILL_NOTE_ON_SHORT_CLICK]: {
        [OPTION_STATES.ON]: `ow a note will be filled by just pressing the number\nto fill cell with it's soluton, long press the number`,
        [OPTION_STATES.OFF]: 'now you have to turn on Pencil to fill note in cell',
    },
    [GAME_SETTINGS_KEYS.HIGHLIGHT_CELLS]: {
        [OPTION_STATES.ON]: 'now cells will have colorful backgrounds',
        [OPTION_STATES.OFF]: 'all the cells will have same background like solving Sudoku on paper',
    },
    [GAME_SETTINGS_KEYS.REMIND_TO_TAKE_HINT]: {
        [OPTION_STATES.ON]: 'we will remind you to use hint at a regular interval when no progress is made in puzzle',
        [OPTION_STATES.OFF]: 'you are the champ. no more reminders to take hint',
    },
    [GAME_SETTINGS_KEYS.GAME_OVER_ON_MISTAKES_THRESHOLD_CROSSED]: {
        [OPTION_STATES.ON]: `game will be over once your mistakes count is {{${DYNAMIC_DATA_KEYS.MISTAKES_LIMIT}}}. WATCH OUT!`,
        [OPTION_STATES.OFF]: "game won't be over on making mistakes. BE FEARLESS",
    },
    [GAME_SETTINGS_KEYS.SHOW_FEEDBACK_ON_MISTAKE]: {
        [OPTION_STATES.ON]: 'you will get instant feedback on making a mistake',
        [OPTION_STATES.OFF]: 'you are a PRO. make mistakes and figure out yourself',
    }
}
