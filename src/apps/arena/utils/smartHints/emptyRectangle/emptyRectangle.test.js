import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'
import { getEmptyRectangleRawHints } from './emptyRectangle'

describe('getEmptyRectangleRawHints()', () => {
    test('', () => {
        const puzzle = '700056038108420000000000000500300000040080700001000240003000000000100005050007060'
        const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)
        const expectedResult = {}
        expect(getEmptyRectangleRawHints()).toEqual(expectedResult)
    })
})
