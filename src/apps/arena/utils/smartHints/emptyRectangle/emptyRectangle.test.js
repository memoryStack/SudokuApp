import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'
import { HOUSE_TYPE } from '../constants'
import { getEmptyRectangleRawHints } from './emptyRectangle'

describe('getEmptyRectangleRawHints()', () => {
    test('', () => {
        const puzzle = '724956138168423597935718624500300810040081750081070240013000072000100085050007061'
        const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)

        const expectedResult = {
            blockHouse: { type: HOUSE_TYPE.BLOCK, num: 4 },
            rowHouse: { type: HOUSE_TYPE.ROW, num: 3 },
            colHouse: { type: HOUSE_TYPE.COL, num: 5 },
            note: 9,
            conjugatePairsHouse: { type: HOUSE_TYPE.COL, num: 1 },
            removableNotesCells: [{ row: 7, col: 5 }],
        }

        expect(getEmptyRectangleRawHints()).toEqual(expectedResult)
    })
})
