import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'
import { getEmptyRectangleRawHints } from './emptyRectangle'

describe('getEmptyRectangleRawHints()', () => {
    test('', () => {
        const puzzle = '724956138168423597935718624500300810040081750081070240013000072000100085050007061'
        const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)
        const expectedResult = {}

        expect(getEmptyRectangleRawHints()).toBeUndefined()
    })
})
