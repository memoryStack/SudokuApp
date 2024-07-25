import { getPuzzleDataFromPuzzleString } from '@domain/board/testingUtils/puzzleDataGenerator'

import { HOUSE_TYPE } from '@domain/board/board.constants'

import { getHouseNoteHostCells } from './omission'

describe('getHouseNoteHostCells()', () => {
    test('returns list of cells from 4th row in first come order where 8 is present as a visible note', () => {
        const puzzle = '400005608370806490008402370940257006200000900086900000000009060039001020800720500'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const house = { type: HOUSE_TYPE.ROW, num: 3 }
        const note = 8
        const expectedResult = [
            { row: 3, col: 6 },
            { row: 3, col: 7 },
        ]
        expect(getHouseNoteHostCells(note, house, notes)).toStrictEqual(expectedResult)
    })
})
