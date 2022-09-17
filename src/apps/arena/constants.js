export const BOARD_AXES_VALUES = {
    Y_AXIS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    X_AXIS: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
}

export const BOARD_CELLS_COUNT = 81
export const MAX_INSTANCES_OF_NUMBER = 9

export const DEEPLINK_PUZZLE_URL_ERRORS = {
    EMPTY_URL: 'Invaild Url',
    INCOMPLETE_NUMBERS: `Puzzle doesn't have ${BOARD_CELLS_COUNT} numbers`,
    INVALID_CHARACTERS: 'Puzzle has invalid characters other than 0-9',
}