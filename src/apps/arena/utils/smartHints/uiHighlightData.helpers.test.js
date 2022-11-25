import { getCellsAxesList } from "./uiHighlightData.helpers"

describe('getCellsAxesList()', () => {
    test('returns list of cells axes values', () => {
        const cells = [
            { row: 3, col: 8 },
            { row: 1, col: 7 },
        ]
        const expectedResult = ['D9', 'B8']
        expect(getCellsAxesList(cells)).toStrictEqual(expectedResult)
    })
})
