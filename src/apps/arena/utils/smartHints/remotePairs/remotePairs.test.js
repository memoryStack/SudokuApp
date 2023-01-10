import { mainNumbers, notes } from './testData'

import { getAllCellsWithPairs } from './remotePairs'

// TODO: fix these linting errors
describe('getAllCellsWithPairs()', () => {
    test('returns all the cells which have only 2 notes in them', () => {
        const expectedResult = [
            { row: 0, col: 0 },
            { row: 0, col: 7 },
            { row: 1, col: 2 },
            { row: 1, col: 4 },
            { row: 2, col: 3 },
            { row: 2, col: 8 },
            { row: 3, col: 4 },
            { row: 3, col: 6 },
            { row: 4, col: 0 },
            { row: 4, col: 8 },
            { row: 5, col: 2 },
            { row: 5, col: 3 },
        ]
        expect(getAllCellsWithPairs(mainNumbers, notes)).toStrictEqual(expectedResult)
    })
})
