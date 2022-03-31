// key is level name and value is number of clues for that level

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
    // [LEVEL_DIFFICULTIES.EASY]: 70,
    [LEVEL_DIFFICULTIES.EASY]: 36,
    [LEVEL_DIFFICULTIES.MEDIUM]: 32,
    [LEVEL_DIFFICULTIES.HARD]: 28,
    [LEVEL_DIFFICULTIES.EXPERT]: 24,
}

const DEFAULT_BEST_STATS = {
    Easy: {
        time: {},
        mistakes: -1,
    },
    Medium: {
        time: {},
        mistakes: -1,
    },
    Hard: {
        time: {},
        mistakes: -1,
    },
    Expert: {
        time: {},
        mistakes: -1,
    },
}

// TODO: make a directory named `event` and  add these constants there along with the
// GlobalEvetBus file

const CELL_ACTION_EVENTS = {
    INPUT_NUMBER_CLICKED: 'INPUT_NUMBER_CLICKED',
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
    MADE_MISTAKE: 'MADE_MISTAKE',
    INPUT_CUSTOM_PUZZLE: 'INPUT_CUSTOM_PUZZLE',
    OPEN_CUSTOM_PUZZLE_INPUT_VIEW: 'OPEN_CUSTOM_PUZZLE_INPUT_VIEW',
    SHOW_SNACK_BAR: 'SHOW_SNACK_BAR',
    START_CUSTOM_PUZZLE_GAME: 'START_CUSTOM_PUZZLE_GAME',
    GENERATE_NEW_PUZZLE: 'GENERATE_NEW_PUZZLE',
    RESUME_PREVIOUS_GAME: 'RESUME_PREVIOUS_GAME',
    CACHE_GAME_DATA: 'CACHE_GAME_DATA',
    START_DEEPLINK_PUZZLE: 'START_DEEPLINK_PUZZLE',
    START_DEFAULT_GAME_PROCESS: 'START_DEFAULT_GAME_PROCESS',
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

const SCREEN_NAME = {
    HOME: 'home',
    ARENA: 'arena',
    CUSTOM_PUZZLE: 'custom-puzzle',
}

const CUSTOMIZED_PUZZLE_LEVEL_TITLE = 'Customized Puzzle'
const DEEPLINK_HOST_NAME = 'https://www.amazing-sudoku.com/puzzle/'

const N_CHOOSE_K = {
    2: {
        2: [[1, 0]],
        3: [],
    },
    3: {
        2: [
            [1, 0],
            [2, 0],
            [2, 1],
        ],
        3: [[2, 1, 0]],
    },
    4: {
        2: [
            [1, 0],
            [2, 0],
            [3, 0],
            [2, 1],
            [3, 1],
            [3, 2],
        ],
        3: [
            [2, 1, 0],
            [3, 1, 0],
            [3, 2, 0],
            [3, 2, 1],
        ],
    },
    5: {
        2: [
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
            [2, 1],
            [3, 1],
            [4, 1],
            [3, 2],
            [4, 2],
            [4, 3],
        ],
        3: [
            [2, 1, 0],
            [3, 1, 0],
            [4, 1, 0],
            [3, 2, 0],
            [4, 2, 0],
            [4, 3, 0],
            [3, 2, 1],
            [4, 2, 1],
            [4, 3, 1],
            [4, 3, 2],
        ],
    },
    6: {
        2: [
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
            [5, 0],
            [2, 1],
            [3, 1],
            [4, 1],
            [5, 1],
            [3, 2],
            [4, 2],
            [5, 2],
            [4, 3],
            [5, 3],
            [5, 4],
        ],
        3: [
            [2, 1, 0],
            [3, 1, 0],
            [4, 1, 0],
            [5, 1, 0],
            [3, 2, 0],
            [4, 2, 0],
            [5, 2, 0],
            [4, 3, 0],
            [5, 3, 0],
            [5, 4, 0],
            [3, 2, 1],
            [4, 2, 1],
            [5, 2, 1],
            [4, 3, 1],
            [5, 3, 1],
            [5, 4, 1],
            [4, 3, 2],
            [5, 3, 2],
            [5, 4, 2],
            [5, 4, 3],
        ],
    },
}

export {
    PREVIOUS_GAME_STATUS,
    LEVEL_DIFFICULTIES,
    LEVELS_CLUES_INFO,
    DEFAULT_BEST_STATS,
    EVENTS,
    PENCIL_STATE,
    GAME_STATE,
    SCREEN_NAME,
    CUSTOMIZED_PUZZLE_LEVEL_TITLE,
    DEEPLINK_HOST_NAME,
    N_CHOOSE_K,
}
