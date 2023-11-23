import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'

import { getNakedSingleRawHints, isNakedSinglePresent } from './nakedSingle'
import { NAKED_SINGLE_TYPES } from '../constants'

const puzzle = '615030700000790010040005030000523090520000008400068000306080970200479006900300281'
const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)

describe('isNakedSinglePresent()', () => {
    test('returns a boolean as true and number which is naked single in cell', () => {
        const expectedResult = { present: true, mainNumber: 8 }
        expect(isNakedSinglePresent(notes, { row: 1, col: 0 })).toEqual(expectedResult)
    })

    test('returns a boolean as false and number as -1 if cell does not have Naked Single', () => {
        const expectedResult = { present: false, mainNumber: -1 }
        expect(isNakedSinglePresent(notes, { row: 0, col: 0 })).toEqual(expectedResult)
    })
})

test('naked singles', () => {
    // TODO: order of records is coupled with the algorithm implementation
    // how to decouple this in any way ??
    // TODO: another test case would be better with a mix of types. here all type are MIX
    const expectedNakedSingles = [
        { cell: { row: 1, col: 0 }, mainNumber: 8, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 2, col: 4 }, mainNumber: 1, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 6, col: 1 }, mainNumber: 5, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 7, col: 7 }, mainNumber: 5, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 8, col: 4 }, mainNumber: 5, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 8, col: 5 }, mainNumber: 6, type: NAKED_SINGLE_TYPES.MIX },
    ]
    const maxHintsThreshold = Number.POSITIVE_INFINITY
    expect(getNakedSingleRawHints(mainNumbers, notes, possibleNotes, maxHintsThreshold)).toStrictEqual(expectedNakedSingles)
})
