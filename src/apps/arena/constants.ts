import { BOARD_CELLS_COUNT } from '@domain/board/board.constants'

import { roundToNearestPixel } from '../../utils/util'

export const BOARD_AXES_VALUES = {
    Y_AXIS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    X_AXIS: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
}

export const BOARD_TO_WINDOW_WIDTH_RATIO = 0.94
export const THICK_BORDER_COUNT = 2
export const THIN_BORDER_COUNT = 6
export const BLOCKS_COUNT_IN_ROW = 3

export enum GRID_TRAVERSALS {
    ROW = 'ROW',
    COL = 'COL',
    BLOCK = 'BLOCK',
}

export const STATIC_BOARD_ELEMENTS_DIMENSIONS = {
    THICK_BORDER_WIDTH: roundToNearestPixel(3),
    THIN_BORDER_WIDTH: roundToNearestPixel(1),
    AXIS_WIDTH: roundToNearestPixel(20),
    BOARD_BORDER_WIDTH: roundToNearestPixel(1),
}

export const DEEPLINK_PUZZLE_URL_ERRORS = {
    EMPTY_URL: 'Invaild Url',
    INCOMPLETE_NUMBERS: `Puzzle doesn't have ${BOARD_CELLS_COUNT} numbers`,
    INVALID_CHARACTERS: 'Puzzle has invalid characters other than 0-9',
}

export enum PUZZLE_SOLUTION_TYPES {
    NO_SOLUTION = 'NO_SOLUTION',
    UNIQUE_SOLUTION = 'UNIQUE_SOLUTION',
    MULTIPLE_SOLUTIONS = 'MULTIPLE_SOLUTIONS',
}

export const BOARD_MOVES_TYPES = {
    ADD: 'ADD',
    REMOVE: 'REMOVE',
}

export const BOARD_GRID_BORDERS_DIRECTION = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal',
}

export type BoardGridBorderDirectionValue = typeof BOARD_GRID_BORDERS_DIRECTION[keyof typeof BOARD_GRID_BORDERS_DIRECTION];

export const ARENA_PAGE_TEST_ID = 'arena_test_id'

export const GAME_OVER_CARD_OVERLAY_TEST_ID = 'GAME_OVER_CARD_OVERLAY_TEST_ID'

export const SMART_HEIGHT_HC_MAX_HEIGHT = 250
