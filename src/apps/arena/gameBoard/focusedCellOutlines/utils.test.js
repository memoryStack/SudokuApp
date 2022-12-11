import { BOARD_GRID_BORDERS_DIRECTION, STATIC_BOARD_ELEMENTS_DIMENSIONS } from "../../constants";
import {
    getVerticalBorderWidthBetweenCells,
    getHorizontalBorderWidthBetweenCells,
    getBordersWidthBetweenCells,
    getBorderTypesBetweenCells
} from "./borderUtils";
// TODO: add test casses for this in a different file
import { getStartCellInGroup, getNextCellAndBorderToPaint, CELL_BORDER_TYPES, getCellOutline } from "./outlinePathNavigator";

test.skip('getCellOutline()', () => {
    const cellsGroup = [
        { row: 1, col: 2 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        { row: 3, col: 2 },
    ]
    const strokeWidth = 10
    console.log(getCellOutline(cellsGroup, strokeWidth, { width: 38, height: 38 }, { x: 200, y: 200 }))
})

describe('getNextCellAndBorderToPaint()', () => {
    const cellsGroup = [
        { row: 1, col: 2 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        { row: 3, col: 2 },
    ]

    test('turn from top border to right border', () => {
        const previousBorder = CELL_BORDER_TYPES.TOP
        const previousCell = { row: 2, col: 3 }
        const expectedResult = {
            nextBorder: CELL_BORDER_TYPES.RIGHT,
            nextCell: { row: 1, col: 2 }
        }
        expect(getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)).toStrictEqual(expectedResult)
    })

    test('turn from top border to left border', () => {
        const previousBorder = CELL_BORDER_TYPES.TOP
        const previousCell = { row: 1, col: 2 }
        const expectedResult = {
            nextBorder: CELL_BORDER_TYPES.LEFT,
            nextCell: { row: 1, col: 2 }
        }
        expect(getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)).toStrictEqual(expectedResult)
    })

    test('turn from left border to bottom border', () => {
        const previousBorder = CELL_BORDER_TYPES.LEFT
        const previousCell = { row: 3, col: 2 }
        const expectedResult = {
            nextBorder: CELL_BORDER_TYPES.BOTTOM,
            nextCell: { row: 3, col: 2 }
        }
        expect(getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)).toStrictEqual(expectedResult)
    })

    test('turn from left border to top border', () => {
        const previousBorder = CELL_BORDER_TYPES.LEFT
        const previousCell = { row: 1, col: 2 }
        const expectedResult = {
            nextBorder: CELL_BORDER_TYPES.TOP,
            nextCell: { row: 2, col: 1 }
        }
        expect(getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)).toStrictEqual(expectedResult)
    })

    test('turn from bottom border to left border', () => {
        const previousBorder = CELL_BORDER_TYPES.BOTTOM
        const previousCell = { row: 2, col: 1 }
        const expectedResult = {
            nextBorder: CELL_BORDER_TYPES.LEFT,
            nextCell: { row: 3, col: 2 }
        }
        expect(getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)).toStrictEqual(expectedResult)
    })

    test('turn from bottom border to right border', () => {
        const previousBorder = CELL_BORDER_TYPES.BOTTOM
        const previousCell = { row: 3, col: 2 }
        const expectedResult = {
            nextBorder: CELL_BORDER_TYPES.RIGHT,
            nextCell: { row: 3, col: 2 }
        }
        expect(getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)).toStrictEqual(expectedResult)
    })

    test('turn from right border to top border', () => {
        const previousBorder = CELL_BORDER_TYPES.RIGHT
        const previousCell = { row: 2, col: 3 }
        const expectedResult = {
            nextBorder: CELL_BORDER_TYPES.TOP,
            nextCell: { row: 2, col: 3 }
        }
        expect(getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)).toStrictEqual(expectedResult)
    })

    test('turn from right border to bottom border', () => {
        const previousBorder = CELL_BORDER_TYPES.RIGHT
        const previousCell = { row: 3, col: 2 }
        const expectedResult = {
            nextBorder: CELL_BORDER_TYPES.BOTTOM,
            nextCell: { row: 2, col: 3 }
        }
        expect(getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)).toStrictEqual(expectedResult)
    })

    // above test-cases conver correctness when there is a turn to be taken
    // below will test when no turn is required
    test('move left to paint top border of a cell in previous column', () => {
        const cellsGroup = [{ row: 1, col: 2 }, { row: 1, col: 3 }, { row: 2, col: 4 }]
        const previousBorder = CELL_BORDER_TYPES.TOP
        const previousCell = { row: 1, col: 3 }
        const expectedResult = {
            nextBorder: CELL_BORDER_TYPES.TOP,
            nextCell: { row: 1, col: 2 }
        }
        expect(getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)).toStrictEqual(expectedResult)
    })

    test('move top to paint right border of a cell in previous row', () => {
        const cellsGroup = [{ row: 1, col: 2 }, { row: 2, col: 2 }, { row: 3, col: 1 }]
        const previousBorder = CELL_BORDER_TYPES.RIGHT
        const previousCell = { row: 2, col: 2 }
        const expectedResult = {
            nextBorder: CELL_BORDER_TYPES.RIGHT,
            nextCell: { row: 1, col: 2 }
        }
        expect(getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)).toStrictEqual(expectedResult)
    })

    test('move right to paint bottom border of a cell in next column', () => {
        const cellsGroup = [{ row: 1, col: 2 }, { row: 1, col: 3 }, { row: 0, col: 3 }]
        const previousBorder = CELL_BORDER_TYPES.BOTTOM
        const previousCell = { row: 1, col: 2 }
        const expectedResult = {
            nextBorder: CELL_BORDER_TYPES.BOTTOM,
            nextCell: { row: 1, col: 3 }
        }
        expect(getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)).toStrictEqual(expectedResult)
    })

    test('move down to paint left border of a cell in next row', () => {
        const cellsGroup = [{ row: 1, col: 2 }, { row: 2, col: 2 }, { row: 0, col: 3 }]
        const previousBorder = CELL_BORDER_TYPES.LEFT
        const previousCell = { row: 1, col: 2 }
        const expectedResult = {
            nextBorder: CELL_BORDER_TYPES.LEFT,
            nextCell: { row: 2, col: 2 }
        }
        expect(getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)).toStrictEqual(expectedResult)
    })

})

describe('getStartCellInGroup()', () => {
    test('returns first cell when all cells are in same row', () => {
        const cellsInGroup = [
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
            { row: 2, col: 5 },
        ]
        expect(getStartCellInGroup(cellsInGroup)).toStrictEqual({ row: 2, col: 2 })
    })

    test('returns last cell when all cells are in same column', () => {
        const cellsInGroup = [
            { row: 2, col: 2 },
            { row: 3, col: 2 },
            { row: 4, col: 2 },
            { row: 5, col: 2 },
        ]
        expect(getStartCellInGroup(cellsInGroup)).toStrictEqual({ row: 5, col: 2 })
    })

    test('returns left most cells in bottom most cells', () => {
        const cellsInGroup = [
            { row: 1, col: 2 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 3, col: 2 },
        ]
        expect(getStartCellInGroup(cellsInGroup)).toStrictEqual({ row: 3, col: 2 })
    })

    test('returns left most cells in bottom most cells', () => {
        const cellsInGroup = [
            { row: 2, col: 4 },
            { row: 1, col: 2 },
            { row: 2, col: 3 },
        ]
        expect(getStartCellInGroup(cellsInGroup)).toStrictEqual({ row: 2, col: 3 })
    })

})

// Note: these functions support cases where two cells are either in same row, column
//      or in adjacent rows or columns
describe('getVerticalBorderWidthBetweenCells()', () => {
    test('returns vertical border thickness between cells in same row', () => {
        const cellA = { row: 2, col: 2 }
        const cellB = { row: 2, col: 3 }
        expect(getVerticalBorderWidthBetweenCells(cellA, cellB)).toBe(STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH)
    })

    test('returns vertical border thickness between cells sharing a corner', () => {
        const cellA = { row: 2, col: 2 }
        const cellB = { row: 3, col: 3 }
        expect(getVerticalBorderWidthBetweenCells(cellA, cellB)).toBe(STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH)
    })
})

describe('getHorizontalBorderWidthBetweenCells()', () => {
    test('returns horizontal border thickness between cells in same column', () => {
        const cellA = { row: 2, col: 3 }
        const cellB = { row: 3, col: 3 }
        expect(getHorizontalBorderWidthBetweenCells(cellA, cellB)).toBe(STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH)
    })

    test('returns horizontal border thickness between cells sharing a corner', () => {
        const cellA = { row: 2, col: 3 }
        const cellB = { row: 1, col: 4 }
        expect(getHorizontalBorderWidthBetweenCells(cellA, cellB)).toBe(STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH)
    })
})

describe('getBordersWidthBetweenCells()', () => {
    test('returns 0 when both cells are same', () => {
        const cellA = { row: 2, col: 3 }
        const cellB = { row: 2, col: 3 }
        expect(getBordersWidthBetweenCells(cellA, cellB)).toBe(0)
    })

    test('returns vetical border width between row adjacent cells', () => {
        const cellA = { row: 2, col: 3 }
        const cellB = { row: 2, col: 4 }
        const expectedResult = {
            [BOARD_GRID_BORDERS_DIRECTION.VERTICAL]: STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH
        }
        expect(getBordersWidthBetweenCells(cellA, cellB)).toStrictEqual(expectedResult)
    })

    test('returns horizontal border width between column adjacent cells', () => {
        const cellA = { row: 2, col: 3 }
        const cellB = { row: 3, col: 3 }
        const expectedResult = {
            [BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL]: STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH
        }
        expect(getBordersWidthBetweenCells(cellA, cellB)).toStrictEqual(expectedResult)
    })

    test('returns both borders width between cells sharing a corner', () => {
        const cellA = { row: 2, col: 1 }
        const cellB = { row: 3, col: 2 }
        const expectedResult = {
            [BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL]: STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH,
            [BOARD_GRID_BORDERS_DIRECTION.VERTICAL]: STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH
        }
        expect(getBordersWidthBetweenCells(cellA, cellB)).toStrictEqual(expectedResult)
    })

})

describe('getBorderTypesBetweenCells()', () => {
    test('takes two cells which have only one border between them and returns an array or borders between them', () => {
        const cellA = { row: 2, col: 3 }
        const cellB = { row: 3, col: 3 }
        const borderType = getBorderTypesBetweenCells(cellA, cellB)
    })

    test('returns vertical border type for same row adjacent cells', () => {
        const cellA = { row: 2, col: 3 }
        const cellB = { row: 2, col: 4 }
        expect(getBorderTypesBetweenCells(cellA, cellB)).toStrictEqual([BOARD_GRID_BORDERS_DIRECTION.VERTICAL])
    })

    test('returns horizontal border type for same column adjacent cells', () => {
        const cellA = { row: 2, col: 4 }
        const cellB = { row: 1, col: 4 }
        expect(getBorderTypesBetweenCells(cellA, cellB)).toStrictEqual([BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL])
    })

    test('returns horizontal & vertical borders both when cells share a corner between them', () => {
        const cellA = { row: 2, col: 3 }
        const cellB = { row: 1, col: 4 }
        const expectedBordersInBetween = [BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL, BOARD_GRID_BORDERS_DIRECTION.VERTICAL]
        expect(getBorderTypesBetweenCells(cellA, cellB)).toStrictEqual(expectedBordersInBetween)
    })

    test('returns horizontal border when cells are in adjacent rows and also dont share a corner or column', () => {
        const cellA = { row: 2, col: 3 }
        const cellB = { row: 1, col: 6 }
        const expectedBordersInBetween = [BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL]
        expect(getBorderTypesBetweenCells(cellA, cellB)).toStrictEqual(expectedBordersInBetween)
    })

    test('returns vertical border when cells are in adjacent columns and also dont share a corner or row', () => {
        const cellA = { row: 2, col: 3 }
        const cellB = { row: 5, col: 4 }
        const expectedBordersInBetween = [BOARD_GRID_BORDERS_DIRECTION.VERTICAL]
        expect(getBorderTypesBetweenCells(cellA, cellB)).toStrictEqual(expectedBordersInBetween)
    })

})