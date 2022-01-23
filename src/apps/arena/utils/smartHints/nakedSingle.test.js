import { notesDataTestOne } from './nakedSingleTestData'
import { getAllNakedSingles } from './nakedSingle'
import { NAKED_SINGLE_TYPES } from './constants'

// TODO: how to import in only 1 func instead of global in JS
test('naked singles', () => {
    // TODO: order of records is coupled with the algorithm implementation
    // how to decouple this in any way ??
    const nakedSinglesData = [
        { cell: { row: 1, col: 0 }, mainNumber: 8, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 2, col: 4 }, mainNumber: 1, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 6, col: 1 }, mainNumber: 5, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 7, col: 7 }, mainNumber: 5, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 8, col: 4 }, mainNumber: 5, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 8, col: 5 }, mainNumber: 6, type: NAKED_SINGLE_TYPES.MIX },
    ]
    expect(getAllNakedSingles(notesDataTestOne)).toStrictEqual(nakedSinglesData)
})
