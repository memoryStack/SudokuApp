export const TRY_OUT_RESULT_STATES = {
    START: 'START',
    ERROR: 'ERROR',
    VALID_PROGRESS: 'VALID_PROGRESS',
}

export const TRY_OUT_ERROR_TYPES = {
    MULTIPLE_CELLS_NAKED_SINGLE: 'MULTIPLE_CELLS_NAKED_SINGLE',
    EMPTY_CELL_IN_SOLUTION: 'EMPTY_CELL_IN_SOLUTION',
}

export const TRY_OUT_ERROR_TYPES_VS_ERROR_MSG = {
    [TRY_OUT_ERROR_TYPES.MULTIPLE_CELLS_NAKED_SINGLE]: `candidate highlighted in green color can't be naked single for more than 1 cell in a house. undo your move.`,
    [TRY_OUT_ERROR_TYPES.EMPTY_CELL_IN_SOLUTION]: 'one or more cells have no candidates in them. undo your move.',
}
