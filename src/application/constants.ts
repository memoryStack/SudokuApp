import { AUTO_GENERATED_NEW_GAME_IDS, NEW_GAME_IDS } from "./usecases/newGameMenu/constants"

export enum BOARD_MOVES_TYPES {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
}

export enum PENCIL_STATE {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

// TODO: right now while displaying hint the game_state is considered as ACTIVE
// we should have a clear distinction so that we can build a game_state machine
// to build out logic around these states
// it's usecase came up while writing "shouldShowHintsMenuTooltip", here i don't want to
// show tooltip while game is not ACTIVE but turns out while displaying hint the game_state is ACTIVE
// and i was expecting that game_state would be DISPLAY_HINT
export enum GAME_STATE {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DISPLAY_HINT = 'DISPLAY_HINT',
    GAME_SELECT = 'GAME_SELECT',
    OVER_SOLVED = 'SOLVED',
    OVER_UNSOLVED = 'UNSOLVED',
}

export enum LEVEL_DIFFICULTIES {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
    EXPERT = 'EXPERT',
}

export const GAME_LEVEL_VS_CLUES = {
    [AUTO_GENERATED_NEW_GAME_IDS.EASY]: 36,
    [AUTO_GENERATED_NEW_GAME_IDS.MEDIUM]: 32,
    [AUTO_GENERATED_NEW_GAME_IDS.HARD]: 28,
    [AUTO_GENERATED_NEW_GAME_IDS.EXPERT]: 24,
}

export enum PUZZLE_SOLUTION_TYPES {
    NO_SOLUTION = 'NO_SOLUTION',
    UNIQUE_SOLUTION = 'UNIQUE_SOLUTION',
    MULTIPLE_SOLUTIONS = 'MULTIPLE_SOLUTIONS',
}

// these are copy from "src/navigation/route.constants.ts"
enum DESIGN_SYSTEM_ROUTES {
    DESIGN_SYSTEM = 'design_system',
    BADGE = 'badge',
    TYPOGRAPHY = 'typography',
    BUTTON = 'button',
    DIVIDER = 'divider',
    DIALOG = 'dialog',
    LEVEL_CARD = 'level_card',
}

// TODO: this is duplicate of ROUTES in naviation folder, manage it properly
export enum ROUTES {
    HOME = 'home',
    ARENA = 'arena',
    PLAY_GUIDE = 'play_guide',
    HINTS_VOCABULARY_EXPLAINATION = 'hints_vocabulary_explaination',
    LEVELS = 'levels',
    GAME_SETTINGS = 'game_settings',
    DESIGN_SYSTEM = DESIGN_SYSTEM_ROUTES.DESIGN_SYSTEM,
    BADGE = DESIGN_SYSTEM_ROUTES.BADGE,
    TYPOGRAPHY = DESIGN_SYSTEM_ROUTES.TYPOGRAPHY,
    BUTTON = DESIGN_SYSTEM_ROUTES.BUTTON,
    DIVIDER = DESIGN_SYSTEM_ROUTES.DIVIDER,
    DIALOG = DESIGN_SYSTEM_ROUTES.DIALOG,
    LEVEL_CARD = DESIGN_SYSTEM_ROUTES.LEVEL_CARD,
}

// in seconds
export const INACTIVITY_THRESHOLD_FOR_HINT_SUGGESTION = {
    [NEW_GAME_IDS.EASY]: 90,
    [NEW_GAME_IDS.MEDIUM]: 120,
    [NEW_GAME_IDS.HARD]: 180,
    [NEW_GAME_IDS.CUSTOMIZE_PUZZLE]: 180, // let's keep hard and customized as same
    DEFAULT: 90
}
