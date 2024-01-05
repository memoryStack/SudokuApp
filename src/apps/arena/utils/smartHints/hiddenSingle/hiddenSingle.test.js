import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'

import { HIDDEN_SINGLE_TYPES } from '../constants'
import { getHiddenSingleRawHints } from './hiddenSingle'

test('hidden singles', () => {
    const puzzle = '615030700000790010040005030000523090520000008400068000306080970200479006974356281'
    const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)

    const nakedSingles = {
        9: 8, 22: 1, 55: 5, 70: 5,
    }

    const hiddenSingles = [
        { cell: { row: 0, col: 3 }, mainNumber: 8, type: HIDDEN_SINGLE_TYPES.ROW },
        { cell: { row: 0, col: 8 }, mainNumber: 9, type: HIDDEN_SINGLE_TYPES.ROW },
        { cell: { row: 1, col: 6 }, mainNumber: 6, type: HIDDEN_SINGLE_TYPES.ROW },
        { cell: { row: 2, col: 2 }, mainNumber: 9, type: HIDDEN_SINGLE_TYPES.BLOCK },
        { cell: { row: 2, col: 3 }, mainNumber: 6, type: HIDDEN_SINGLE_TYPES.BLOCK },
        { cell: { row: 3, col: 0 }, mainNumber: 1, type: HIDDEN_SINGLE_TYPES.COL },
        { cell: { row: 3, col: 1 }, mainNumber: 6, type: HIDDEN_SINGLE_TYPES.BLOCK },
        { cell: { row: 4, col: 4 }, mainNumber: 4, type: HIDDEN_SINGLE_TYPES.COL },
        { cell: { row: 4, col: 5 }, mainNumber: 7, type: HIDDEN_SINGLE_TYPES.BLOCK },
        { cell: { row: 4, col: 7 }, mainNumber: 6, type: HIDDEN_SINGLE_TYPES.COL },
        { cell: { row: 5, col: 1 }, mainNumber: 9, type: HIDDEN_SINGLE_TYPES.COL },
        { cell: { row: 5, col: 8 }, mainNumber: 3, type: HIDDEN_SINGLE_TYPES.COL },
        { cell: { row: 6, col: 8 }, mainNumber: 4, type: HIDDEN_SINGLE_TYPES.BLOCK },
        { cell: { row: 7, col: 2 }, mainNumber: 1, type: HIDDEN_SINGLE_TYPES.BLOCK },
        { cell: { row: 7, col: 6 }, mainNumber: 3, type: HIDDEN_SINGLE_TYPES.BLOCK },
    ]
    const maxHintsThreshold = Number.POSITIVE_INFINITY
    expect(getHiddenSingleRawHints(mainNumbers, notes, possibleNotes, nakedSingles, maxHintsThreshold)).toStrictEqual(hiddenSingles)
})

test('naked singles and hidden singles will not be reported for same cells', () => {
    const puzzle = '497518362518632497362497518945781623781263945623945781174859236859326174236174850'
    const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)

    const nakedSingles = { 80: 9 }

    const hiddenSingles = []
    const maxHintsThreshold = Number.POSITIVE_INFINITY
    expect(getHiddenSingleRawHints(mainNumbers, notes, possibleNotes, nakedSingles, maxHintsThreshold)).toStrictEqual(hiddenSingles)
})
