
// key is level name and value is number of clues for that level

const LEVEL_DIFFICULTIES = {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD',
    EXPERT: 'EXPERT',
}

const LEVELS_CLUES_INFO = {
    [LEVEL_DIFFICULTIES.EASY]: 38,
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

// events whose source is Sudoku Board
const BOARD_EVENTS = {
    MADE_MISTAKE: 'MADE_MISTAKE',
    PUZZLE_SOLVED: 'PUZZLE_SOLVED',
}

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
    START_NEW_GAME: 'START_NEW_GAME',
    RESTART_GAME: 'RESTART_GAME',
    NEW_GAME_STARTED: 'NEW_GAME_STARTED', // either new game is started of previous game re-started. will be helpful in reseting the components state for new game
    ...CELL_ACTION_EVENTS,
    ...BOARD_EVENTS,
}

// freeze these objects
// TODO: think over this automaton
const GAME_STATE = {
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
    OVER: 'OVER',
}

const PENCIL_STATE = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
}

export {
    LEVEL_DIFFICULTIES,
    LEVELS_CLUES_INFO,
    DEFAULT_BEST_STATS,
    EVENTS,
    PENCIL_STATE,
}