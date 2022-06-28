import { getCellsFromCellsToFocusedData } from './util'

describe('getCellsFromCellsToFocusedData()', () => {
    test('returns cells which are basically the keys mentioned in the cellsToFocusData, first level keys are row numbers and second levels keys are column numbers in each row', () => {
        const cellsToFocusData = {
            0: {
                0: {},
                1: {},
                2: {},
            },
            2: {
                4: {},
                7: {},
                8: {},
            },
        }
        const expectedResult = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 2, col: 4 },
            { row: 2, col: 7 },
            { row: 2, col: 8 },
        ]

        expect(getCellsFromCellsToFocusedData(cellsToFocusData)).toStrictEqual(expectedResult)
    })
})
