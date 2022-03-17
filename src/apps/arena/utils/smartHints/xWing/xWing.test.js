// how to name the file so that xWing prefix doesn't need to be there ??

import { getXWing } from '.'
import { HOUSE_TYPE } from '../constants'

test('perfect xWing', () => {
    const { mainNumbers, notesData } = require('./testData')

    const expectedXWings = [
        {
            cells: [
                [
                    { row: 0, col: 1 },
                    { row: 7, col: 1 },
                ],
                [
                    { row: 0, col: 6 },
                    { row: 7, col: 6 },
                ],
            ],
            candidate: 8,
            type: HOUSE_TYPE.COL,
        },
        {
            cells: [
                [
                    { row: 1, col: 2 },
                    { row: 1, col: 7 },
                ],
                [
                    { row: 8, col: 2 },
                    { row: 8, col: 7 },
                ],
            ],
            candidate: 8,
            type: HOUSE_TYPE.ROW,
        },
    ]
    expect(getXWing(mainNumbers, notesData)).toStrictEqual(expectedXWings)
})
