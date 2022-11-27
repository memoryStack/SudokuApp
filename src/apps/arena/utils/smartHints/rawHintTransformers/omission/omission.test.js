import { HOUSE_TYPE } from '../../constants'

import { getHouseNoteHostCells } from './omission'

describe('getHouseNoteHostCells()', () => {
    test('returns list of cells from 4th row in first come order where 8 is present as a visible note', () => {
        const { notesData } = require('../../omission/testData')
        const house = { type: HOUSE_TYPE.ROW, num: 3 }
        const note = 8
        const expectedResult = [
            { row: 3, col: 6 },
            { row: 3, col: 7 },
        ]
        expect(getHouseNoteHostCells(note, house, notesData)).toStrictEqual(expectedResult)
    })
})
