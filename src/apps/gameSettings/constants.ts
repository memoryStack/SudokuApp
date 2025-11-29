import { GAME_SETTINGS_KEYS } from "@interfaces/gameSettingsAdapter";

export enum GAME_SETTINGS_STATE {
    BOARD = 'gameSettingsPreview',
    BOARD_CONTROLLER = 'gameSettingsBoardController',
    GAME_STATE = 'gameSettingsGameState',
    REFREE = 'gameSettingsRefree',
    INPUT_PANEL = 'gameSettingsInputPanel'
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
        [OPTION_STATES.ON]: 'sounds have been enabled. now try pressing any cell in puzzle and you will hear the tunes',
        [OPTION_STATES.OFF]: 'no more sounds in game. wish you a nice meditative session',
    },
    [GAME_SETTINGS_KEYS.ALLOW_ANY_NOTE_IN_CELL]: {
        [OPTION_STATES.ON]: `in Preview do below\npick an empty cell and try to fill 1-9 as notes, notice now you can fill all the notes`,
        [OPTION_STATES.OFF]: "in Preview do below\nin 1st try to fill all the notes. notice only 1, 4, 8 can be filled",
    },
    [GAME_SETTINGS_KEYS.FILL_NOTE_ON_SHORT_CLICK]: {
        [OPTION_STATES.ON]: `now notes will be filled without turning on Pencil. just press the number.\nlong press the number to fill cell with it's soluton`,
        [OPTION_STATES.OFF]: 'now you have to turn on Pencil to fill notes in cell',
    },
    [GAME_SETTINGS_KEYS.FILL_NUMBER_ON_CELL_CLICK]: {
        [OPTION_STATES.ON]: `now numbers & Notes will be filled faster.In Preview do below\na. long press any number to lock it\nb. tap on an empty cell and number will be filled`,
        [OPTION_STATES.OFF]: 'now you have to first select a cell and then press on number to fill',
    },
    [GAME_SETTINGS_KEYS.HIGHLIGHT_CELLS]: {
        [OPTION_STATES.ON]: 'now cells will have colorful backgrounds',
        [OPTION_STATES.OFF]: 'all the cells will have same background like solving Sudoku on paper',
    },
    [GAME_SETTINGS_KEYS.HIGHLIGHT_NUMBERS_FONTS]: {
        [OPTION_STATES.ON]: 'now notes will be highlighted in puzzle.\nin Preview do below\n  a. click Fast Pencil\n  b. select a filled cell\nnotice notes have been highlighted',
        [OPTION_STATES.OFF]: 'in Preview do below\n  a. click Fast Pencil\n  b. select a filled cell\nnotice all the notes have same color',
    },
    [GAME_SETTINGS_KEYS.REMIND_TO_TAKE_HINT]: {
        [OPTION_STATES.ON]: 'we will remind you to use hint at a regular interval when no progress is made in puzzle',
        [OPTION_STATES.OFF]: 'you are the champ. no more reminders to take hint',
    },
    [GAME_SETTINGS_KEYS.GAME_OVER_ON_MISTAKES_THRESHOLD_CROSSED]: {
        [OPTION_STATES.ON]: `game will be over once your mistakes count is {{${DYNAMIC_DATA_KEYS.MISTAKES_LIMIT}}}. WATCH OUT!`,
        [OPTION_STATES.OFF]: "game won't be over on making mistakes. BE FEARLESS!",
    },
    [GAME_SETTINGS_KEYS.SHOW_FEEDBACK_ON_MISTAKE]: {
        [OPTION_STATES.ON]: `in Preview do below\n a. fill 1 in first cell\nit's a mistake and see mistakes count has gone up`,
        [OPTION_STATES.OFF]: `in Preview do below\n a. fill 1 in first cell\nit's a mistake and see you can't notice it in preview`,
    },
    [GAME_SETTINGS_KEYS.FILL_NOTES_WITHOUT_PENCIL]: {
        [OPTION_STATES.ON]: `in Preview now you will see 2 input panels, one for notes and one for main numbers`,
        [OPTION_STATES.OFF]: `now you have to tap on Pencil first before filling Notes`,
    }
}
