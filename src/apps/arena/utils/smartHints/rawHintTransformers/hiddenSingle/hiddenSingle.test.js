import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'

import { GRID_TRAVERSALS } from '../../../../constants'
import { HOUSE_TYPE } from '@domain/board/board.constants'

import {
    getEmptyCellsCountAndCandidatePosition,
    getBlockCellRowOrColNeighbourHousesInBlock,
    getMustHighlightableNeighbourHouses,
} from './hiddenSingle'

import {
    getNextNeighbourBlock,
    shouldHighlightWinnerCandidateInstanceInBlock,
    getCellFilledWithNumberInHouse,
} from './hiddenSingle.helpers'

describe('getNextNeighbourBlock()', () => {
    test('takes two arguments ', () => {
        getNextNeighbourBlock(
            1, // current block number in [0..n] format
            GRID_TRAVERSALS.ROW, // direction to search in for next block
        )
    })

    test('returns next block in right to the current block when passed direction is row', () => {
        expect(getNextNeighbourBlock(1, GRID_TRAVERSALS.ROW)).toBe(2)
    })

    test('returns next block in bottom to the current block when passed direction is column', () => {
        expect(getNextNeighbourBlock(1, GRID_TRAVERSALS.COL)).toBe(4)
    })

    test('returns next block in a cyclic manner', () => {
        expect(getNextNeighbourBlock(2, GRID_TRAVERSALS.ROW)).toBe(0)
        expect(getNextNeighbourBlock(7, GRID_TRAVERSALS.COL)).toBe(1)
    })
})

describe('shouldHighlightWinnerCandidateInstanceInBlock()', () => {
    test('returns true if host house and block house have some empty common cells', () => {
        const puzzle = '001543006543270090070800500900030000034020980000080004008009020050062418600418300'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle)
        const blockHouse = { type: HOUSE_TYPE.BLOCK, num: 6 }
        const hostHouse = { type: HOUSE_TYPE.COL, num: 0 }

        expect(shouldHighlightWinnerCandidateInstanceInBlock(hostHouse, blockHouse, mainNumbers)).toBeTruthy()
    })

    test('returns false if host house and block house have no empty empty common cells', () => {
        const puzzle = '001543006543270090070800500900030000034020980000080004008009020050062418600418300'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle)
        const blockHouse = { type: HOUSE_TYPE.BLOCK, num: 1 }
        const hostHouse = { type: HOUSE_TYPE.ROW, num: 0 }

        expect(shouldHighlightWinnerCandidateInstanceInBlock(hostHouse, blockHouse, mainNumbers)).toBeFalsy()
    })
})

describe('getCellFilledWithNumberInHouse()', () => {
    test('returns true if host house and block house have some empty common cells', () => {
        const puzzle = '001543006543270090070800500900030000034020980000080004008009020050062418600418300'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle)
        const number = 8
        const blockHouse = { type: HOUSE_TYPE.BLOCK, num: 6 }
        expect(getCellFilledWithNumberInHouse(number, blockHouse, mainNumbers)).toEqual({ row: 6, col: 2 })
    })
})

describe('getEmptyCellsCountAndCandidatePosition()', () => {
    test('returnw how many cells shared by row and block are empty and where hidden single candidate is present in row', () => {
        const puzzle = '001543006543270090070800500900030000034020980000080004008009020050062418600418300'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle)
        const blockHouse = { type: HOUSE_TYPE.BLOCK, num: 3 }
        const rowHouse = { type: HOUSE_TYPE.ROW, num: 4 }
        const winnerCandidate = 8
        const expectedResult = getEmptyCellsCountAndCandidatePosition(blockHouse, rowHouse, winnerCandidate, mainNumbers)
        expect(expectedResult).toEqual({
            emptyCellsCount: 1, candidateHostCell: { row: 4, col: 7 },
        })
    })

    test('returns null if hidden single candidate is not present in row or no empty cells present shared by block and row', () => {
        const puzzle = '001543006543270090070800500900030000034020980000080004008009020050062418600418300'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle)
        const winnerCandidate = 6
        const blockHouse = { type: HOUSE_TYPE.BLOCK, num: 8 }
        const rowHouse = { type: HOUSE_TYPE.ROW, num: 7 }
        const expectedResult = getEmptyCellsCountAndCandidatePosition(blockHouse, rowHouse, winnerCandidate, mainNumbers)
        expect(expectedResult).toBe(null)
    })

    test('returnw how many cells shared by column and block are empty and where hidden single candidate is present in column', () => {
        const puzzle = '001543006543270090070800500900030000034020980000080004008009020050062418600418300'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle)
        const winnerCandidate = 6
        const neighbourCols = {}
        const blockHouse = { type: HOUSE_TYPE.BLOCK, num: 8 }
        const colHouse = { type: HOUSE_TYPE.COL, num: 7 }
        const expectedResult = getEmptyCellsCountAndCandidatePosition(blockHouse, colHouse, winnerCandidate, mainNumbers, neighbourCols)
        expect(expectedResult).toEqual(null)
    })

    test('returns null if hidden single candidate is not present in column or no empty cells present shared by block and column', () => {
        const puzzle = '001543006543270090070800500900030000034020980000080004008009020050062418600418300'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle)
        const winnerCandidate = 6
        const neighbourCols = {}
        const blockHouse = { type: HOUSE_TYPE.BLOCK, num: 8 }
        const colHouse = { type: HOUSE_TYPE.COL, num: 8 }
        const expectedResult = getEmptyCellsCountAndCandidatePosition(blockHouse, colHouse, winnerCandidate, mainNumbers, neighbourCols)
        expect(expectedResult).toEqual({
            emptyCellsCount: 2, candidateHostCell: { row: 0, col: 8 },
        })
    })
})

describe('getBlockCellRowOrColNeighbourHousesInBlock()', () => {
    test('returns both row neighbour houses in order for given block cell', () => {
        const blockCell = { row: 0, col: 0 }
        const neighbourHouseType = HOUSE_TYPE.ROW
        const expectedResult = [
            { type: HOUSE_TYPE.ROW, num: 1 },
            { type: HOUSE_TYPE.ROW, num: 2 },
        ]
        expect(getBlockCellRowOrColNeighbourHousesInBlock(blockCell, neighbourHouseType)).toEqual(expectedResult)
    })

    test('returns both column neighbour houses in order for given block cell', () => {
        const blockCell = { row: 3, col: 5 }
        const neighbourHouseType = HOUSE_TYPE.COL
        const expectedResult = [
            { type: HOUSE_TYPE.COL, num: 3 },
            { type: HOUSE_TYPE.COL, num: 4 },
        ]
        expect(getBlockCellRowOrColNeighbourHousesInBlock(blockCell, neighbourHouseType)).toEqual(expectedResult)
    })
})

describe('getMustHighlightableNeighbourHouses()', () => {
    test('returns a map of neighbour rows which must highlight their candidate host cell', () => {
        const puzzle = '001543006543270090070800500900030000034020980000080004008009020050062418600418300'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle)
        const hostCell = { row: 3, col: 1 }
        const expectedResult = { 5: true }
        expect(getMustHighlightableNeighbourHouses(HOUSE_TYPE.ROW, hostCell, mainNumbers)).toEqual(expectedResult)
    })

    test('returns a map of neighbour columns which must highlight their candidate host cell', () => {
        const puzzle = '001543006543270090070800500900030000034020980000080004008009020050062418600418300'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle)
        const hostCell = { row: 3, col: 1 }
        const expectedResult = { 2: true }
        expect(getMustHighlightableNeighbourHouses(HOUSE_TYPE.COL, hostCell, mainNumbers)).toEqual(expectedResult)
    })
})
