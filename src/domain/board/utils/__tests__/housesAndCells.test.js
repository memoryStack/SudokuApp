import { HOUSE_TYPE } from '../../board.constants'

import { getHouseCells, isRowHouse, isColHouse, isBlockHouse } from '../housesAndCells'

describe('getHouseCells', () => {
    test('returns row house cells in order from left to right', () => {
        const house = { type: HOUSE_TYPE.ROW, num: 5 }
        const expectedResult = [
            { row: 5, col: 0 },
            { row: 5, col: 1 },
            { row: 5, col: 2 },
            { row: 5, col: 3 },
            { row: 5, col: 4 },
            { row: 5, col: 5 },
            { row: 5, col: 6 },
            { row: 5, col: 7 },
            { row: 5, col: 8 },
        ]
        expect(getHouseCells(house)).toEqual(expectedResult)
    })

    test('returns column house cells in order from top to down', () => {
        const house = { type: HOUSE_TYPE.COL, num: 2 }
        const expectedResult = [
            { row: 0, col: 2 },
            { row: 1, col: 2 },
            { row: 2, col: 2 },
            { row: 3, col: 2 },
            { row: 4, col: 2 },
            { row: 5, col: 2 },
            { row: 6, col: 2 },
            { row: 7, col: 2 },
            { row: 8, col: 2 },
        ]
        expect(getHouseCells(house)).toEqual(expectedResult)
    })

    test('returns block house cells in order from first row to last row', () => {
        const house = { type: HOUSE_TYPE.BLOCK, num: 2 }
        const expectedResult = [
            { row: 0, col: 6 },
            { row: 0, col: 7 },
            { row: 0, col: 8 },
            { row: 1, col: 6 },
            { row: 1, col: 7 },
            { row: 1, col: 8 },
            { row: 2, col: 6 },
            { row: 2, col: 7 },
            { row: 2, col: 8 },
        ]
        expect(getHouseCells(house)).toEqual(expectedResult)
    })

    test('returns empty array if house type is not one of row, column or block', () => {
        const house = { type: 't', num: 0 }
        expect(getHouseCells(house)).toEqual([])
    })
})

describe('Houses Type Check', () => {
    test('isRowHouse() class method verifies if passed houseType is row or not', () => {
        expect(isRowHouse(HOUSE_TYPE.ROW)).toBeTruthy()
    })

    test('isColumnHouse() class method verifies if passed houseType is row or not', () => {
        expect(isColHouse(HOUSE_TYPE.COL)).toBeTruthy()
    })

    test('isBlockHouse() class method verifies if passed houseType is row or not', () => {
        expect(isBlockHouse(HOUSE_TYPE.BLOCK)).toBeTruthy()
    })
})
