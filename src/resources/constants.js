
// key is level name and value is number of clues for that level

const PREVIOUS_GAME = 'PREVIOUS_GAME' // cache key to store previous game data

const PREVIOUS_GAME_STATUS = {
    SOLVED: 'SOLVED',
    UNSOLVED: 'UNSOLVED',
}

const LEVEL_DIFFICULTIES = {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD',
    EXPERT: 'EXPERT',
}

const LEVELS_CLUES_INFO = {
    // [LEVEL_DIFFICULTIES.EASY]: 80,
    [LEVEL_DIFFICULTIES.EASY]: 36,
    [LEVEL_DIFFICULTIES.MEDIUM]: 32,
    [LEVEL_DIFFICULTIES.HARD]: 28,
    [LEVEL_DIFFICULTIES.EXPERT]: 24
}

const DEFAULT_BEST_STATS = {
    'Easy': {
        time: {},
        mistakes: -1,
    },
    'Medium': {
        time: {},
        mistakes: -1,
    },
    'Hard': {
        time: {},
        mistakes: -1,
    },
    'Expert': {
        time: {},
        mistakes: -1,
    },
}

// TODO: make a directory named `event` and  add these constants there along with the 
// GlobalEvetBus file

const CELL_ACTION_EVENTS = {
    INPUT_NUMBER_CLICKED: 'INPUT_NUMBER_CLICKED',
    HINT_CLICKED: 'HINT_CLICKED',
    UNDO_CLICKED: 'UNDO_CLICKED',
    ERASER_CLICKED: 'ERASER_CLICKED',
    PENCIL_CLICKED: 'PENCIL_CLICKED',
    HINT_USED_SUCCESSFULLY: 'HINT_USED_SUCCESSFULLY',
    UNDO_USED_SUCCESSFULLY: 'UNDO_USED_SUCCESSFULLY',
}

// list of all the events in the app
const EVENTS = {
    ...CELL_ACTION_EVENTS,
    START_NEW_GAME: 'START_NEW_GAME',
    RESTART_GAME: 'RESTART_GAME',
    CHANGE_GAME_STATE: 'CHANGE_GAME_STATE',
    OPEN_NEXT_GAME_MENU: 'OPEN_NEXT_GAME_MENU',
    MADE_MISTAKE: 'MADE_MISTAKE',
}

// TODO: freeze these objects
const GAME_STATE = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    OVER_SOLVED: 'OVER_SOLVED',
    OVER_UNSOLVED: 'OVER_UNSOLVED',
}

// TODO: should make a general reusable state for these switches kind of states like "ON or OFF" or "ACTIVE or INACTIVE"
const PENCIL_STATE = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
}

export {
    PREVIOUS_GAME,
    PREVIOUS_GAME_STATUS,
    LEVEL_DIFFICULTIES,
    LEVELS_CLUES_INFO,
    DEFAULT_BEST_STATS,
    EVENTS,
    PENCIL_STATE,
    GAME_STATE,
}
