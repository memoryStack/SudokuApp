/* eslint-disable global-require */
import _isArray from '@lodash/isArray'
import _isEmpty from '@lodash/isEmpty'

import { CUSTOMIZED_PUZZLE_LEVEL_TITLE, GAME_STATE } from '@resources/constants'
import { getPuzzleDataFromPuzzleString } from '@domain/board/testingUtils/puzzleDataGenerator'
import { getStoragePromise } from '../../../../utils/testing/testingBoilerplate/storage'

import {
    shouldSaveDataOnGameStateChange,
    areSameCells,
    areSameBlockCells,
    areSameRowCells,
    areSameColCells,
    getPairCellsCommonHouses,
    getCellsCommonHouses,
    areSameCellsSets,
    areCommonHouseCells,
    previousInactiveGameExists,
    getHousesCellsSharedByCells,
    isGenerateNewPuzzleItem,
    getHousesCommonCells,
    getBlockStartCell,
    getHouseAxesValue,
    getCellsSharingHousesWithCells,
    getCellAllHousesCells,
    sortCells,
    getNoteHostCellsInHouse,
    areAdjacentCells,
    areCellsFromSameHouse,
} from '../util'
import { HOUSE_TYPE } from '@domain/board/board.constants'
import { GAME_DATA_KEYS } from '../cacheGameHandler'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import { LEVEL_DIFFICULTIES } from '@application/constants'

jest.mock('@utils/storage')

describe('should cache game data', () => {
    test('shouldSaveDataOnGameStateChange test 1', () => {
        expect(shouldSaveDataOnGameStateChange(GAME_STATE.OVER_SOLVED, GAME_STATE.ACTIVE)).toBe(true)
    })

    test('shouldSaveDataOnGameStateChange test 2', () => {
        expect(shouldSaveDataOnGameStateChange(GAME_STATE.OVER_UNSOLVED, GAME_STATE.ACTIVE)).toBe(true)
    })

    test('shouldSaveDataOnGameStateChange test 3', () => {
        expect(shouldSaveDataOnGameStateChange(GAME_STATE.ACTIVE, GAME_STATE.INACTIVE)).toBe(false)
    })

    test('shouldSaveDataOnGameStateChange test 4', () => {
        expect(shouldSaveDataOnGameStateChange(GAME_STATE.INACTIVE, GAME_STATE.ACTIVE)).toBe(true)
    })

    test('shouldSaveDataOnGameStateChange test 2', () => {
        expect(shouldSaveDataOnGameStateChange(GAME_STATE.DISPLAY_HINT, GAME_STATE.ACTIVE)).toBe(true)
    })
})

describe('are same cells', () => {
    test('areSameCells test 1', () => {
        const cellA = { row: 2, col: 2 }
        const cellB = { row: 2, col: 2 }
        expect(areSameCells(cellA, cellB)).toBe(true)
    })

    test('areSameCells test 2', () => {
        const cellA = { row: 2, col: 2 }
        const cellB = { row: 2, col: 3 }
        expect(areSameCells(cellA, cellB)).toBe(false)
    })

    test('areSameCells test 3', () => {
        const cellA = { row: 1, col: 2 }
        const cellB = { row: 3, col: 4 }
        expect(areSameCells(cellA, cellB)).toBe(false)
    })

    test('areSameCells test 4', () => {
        const cellA = { row: 5, col: 8 }
        const cellB = { row: 8, col: 8 }
        expect(areSameCells(cellA, cellB)).toBe(false)
    })
})

describe('are same block cells', () => {
    test('areSameBlockCells test 1', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 2, col: 0 },
        ]
        expect(areSameBlockCells(cells)).toBe(true)
    })

    test('areSameBlockCells test 2', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 2, col: 5 },
        ]
        expect(areSameBlockCells(cells)).toBe(false)
    })

    test('areSameBlockCells test 3', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 3, col: 3 },
            { row: 7, col: 7 },
        ]
        expect(areSameBlockCells(cells)).toBe(false)
    })
})

describe('are same row cells', () => {
    test('areSameRowCells test 1', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
        ]
        expect(areSameRowCells(cells)).toBe(true)
    })

    test('areSameRowCells test 2', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 0, col: 3 },
            { row: 0, col: 7 },
        ]
        expect(areSameRowCells(cells)).toBe(true)
    })

    test('areSameRowCells test 3', () => {
        const cells = [
            { row: 3, col: 5 },
            { row: 3, col: 3 },
            { row: 4, col: 7 },
        ]
        expect(areSameRowCells(cells)).toBe(false)
    })
})

describe('are same col cells', () => {
    test('areSameColCells test 1', () => {
        const cells = [
            { row: 0, col: 3 },
            { row: 4, col: 3 },
            { row: 8, col: 3 },
        ]
        expect(areSameColCells(cells)).toBe(true)
    })

    test('areSameColCells test 2', () => {
        const cells = [
            { row: 4, col: 4 },
            { row: 6, col: 4 },
            { row: 8, col: 4 },
        ]
        expect(areSameColCells(cells)).toBe(true)
    })

    test('areSameColCells test 3', () => {
        const cells = [
            { row: 3, col: 6 },
            { row: 3, col: 7 },
            { row: 4, col: 7 },
        ]
        expect(areSameColCells(cells)).toBe(false)
    })
})

test('pair cells common houses', () => {
    const testOne = {
        cellA: { row: 0, col: 5 },
        cellB: { row: 1, col: 5 },
    }
    const testOneExpectedResult = {
        [HOUSE_TYPE.ROW]: false,
        [HOUSE_TYPE.COL]: true,
        [HOUSE_TYPE.BLOCK]: true,
    }
    expect(getPairCellsCommonHouses(testOne.cellA, testOne.cellB)).toStrictEqual(testOneExpectedResult)

    const testTwo = {
        cellA: { row: 0, col: 5 },
        cellB: { row: 8, col: 6 },
    }
    const testTwoExpectedResult = {
        [HOUSE_TYPE.ROW]: false,
        [HOUSE_TYPE.COL]: false,
        [HOUSE_TYPE.BLOCK]: false,
    }
    expect(getPairCellsCommonHouses(testTwo.cellA, testTwo.cellB)).toStrictEqual(testTwoExpectedResult)
})

describe('areCommonHouseCells()', () => {
    test('return true when cells have common block and common row', () => {
        const cellA = { row: 0, col: 2 }
        const cellB = { row: 0, col: 1 }
        expect(areCommonHouseCells(cellA, cellB)).toBe(true)
    })

    test('return true when cells have common block only', () => {
        const cellA = { row: 4, col: 4 }
        const cellB = { row: 3, col: 3 }
        expect(areCommonHouseCells(cellA, cellB)).toBe(true)
    })

    test('return true when cells have only row house as common', () => {
        const cellA = { row: 0, col: 2 }
        const cellB = { row: 0, col: 3 }
        expect(areCommonHouseCells(cellA, cellB)).toBe(true)
    })

    test('return false when cells have no common house in them ', () => {
        const cellA = { row: 0, col: 2 }
        const cellB = { row: 4, col: 4 }
        expect(areCommonHouseCells(cellA, cellB)).toBe(false)
    })

    test('return false when cells have no common house in them', () => {
        const cellA = { row: 0, col: 0 }
        const cellB = { row: 3, col: 2 }
        expect(areCommonHouseCells(cellA, cellB)).toBe(false)
    })
})

test('common houses in cells ', () => {
    const testOne = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
    ]
    const expectedResultOne = {
        [HOUSE_TYPE.BLOCK]: true,
        [HOUSE_TYPE.ROW]: true,
        [HOUSE_TYPE.COL]: false,
    }
    expect(getCellsCommonHouses(testOne)).toStrictEqual(expectedResultOne)

    const testTwo = [{ row: 0, col: 0 }]
    const expectedResultTwo = {
        [HOUSE_TYPE.BLOCK]: true,
        [HOUSE_TYPE.ROW]: true,
        [HOUSE_TYPE.COL]: true,
    }
    expect(getCellsCommonHouses(testTwo)).toStrictEqual(expectedResultTwo)

    const testThree = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 4, col: 4 },
    ]
    const expectedResultThree = {
        [HOUSE_TYPE.BLOCK]: false,
        [HOUSE_TYPE.ROW]: false,
        [HOUSE_TYPE.COL]: false,
    }
    expect(getCellsCommonHouses(testThree)).toStrictEqual(expectedResultThree)
})

test('are same cells sets', () => {
    const testOne = {
        setA: [],
        setB: [],
    }
    expect(areSameCellsSets(testOne.setA, testOne.setB)).toBe(true)

    const testTwo = {
        setA: [{ row: 0, col: 0 }],
        setB: [],
    }
    expect(areSameCellsSets(testTwo.setA, testTwo.setB)).toBe(false)

    const testThree = {
        setA: [
            { row: 0, col: 0 },
            { row: 5, col: 8 },
        ],
        setB: [
            { row: 0, col: 0 },
            { row: 5, col: 8 },
        ],
    }
    expect(areSameCellsSets(testThree.setA, testThree.setB)).toBe(true)

    const testFour = {
        setA: [
            { row: 0, col: 0 },
            { row: 5, col: 8 },
        ],
        setB: [
            { row: 0, col: 0 },
            { row: 5, col: 0 },
        ],
    }
    expect(areSameCellsSets(testFour.setA, testFour.setB)).toBe(false)
})

describe('initMainNumbers()', () => {
    test('returns an array which contains 9 other arrays in init', () => {
        const mainNumbers = MainNumbersRecord.initMainNumbers()
        expect(_isArray(mainNumbers)).toBeTruthy()
    })

    test('returned value is a grid of 9*9', () => {
        const mainNumbers = MainNumbersRecord.initMainNumbers()
        expect(mainNumbers.length).toBe(9)
        mainNumbers.forEach(rowMainNumbers => {
            expect(_isArray(rowMainNumbers)).toBeTruthy()
            expect(rowMainNumbers.length).toBe(9)
        })
    })

    test('initializes default main number values for each 9*9 cells in board', () => {
        const mainNumbers = MainNumbersRecord.initMainNumbers()
        BoardIterators.forBoardEachCell(({ row, col }) => {
            expect(_isEmpty(mainNumbers[row][col])).toBeFalsy()
        })
    })
})

describe('previousInactiveGameExists()', () => {
    const { getKey } = require('@utils/storage')
    getKey
        .mockReturnValueOnce(getStoragePromise({ [GAME_DATA_KEYS.STATE]: GAME_STATE.INACTIVE }))
        .mockReturnValueOnce(getStoragePromise({ [GAME_DATA_KEYS.STATE]: GAME_STATE.DISPLAY_HINT }))
        .mockReturnValueOnce(getStoragePromise({ [GAME_DATA_KEYS.STATE]: GAME_STATE.ACTIVE }))
        .mockReturnValueOnce(getStoragePromise(null))

    test('returns true for game states INACTIVE and DISPLAY_HINT', () => {
        expect.assertions(2)
        expect(previousInactiveGameExists()).resolves.toBe(true)
        return expect(previousInactiveGameExists()).resolves.toBe(true)
    })

    test('returns false for game states other than above', () => {
        expect.assertions(1)
        return expect(previousInactiveGameExists()).resolves.toBe(false)
    })

    test('returns false if there is no game data', () => {
        expect.assertions(1)
        return expect(previousInactiveGameExists()).resolves.toBe(false)
    })

    test('storage handler is invoked 4 times', () => {
        expect(getKey).toHaveBeenCalledTimes(4)
    })
})

describe('getHousesCellsSharedByCells()', () => {
    test('returns row cells when only common houses is row', () => {
        const cells = [
            { row: 0, col: 1 },
            { row: 0, col: 4 },
        ]
        const expectedResult = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 0, col: 5 },
            { row: 0, col: 6 },
            { row: 0, col: 7 },
            { row: 0, col: 8 },
        ]
        expect(getHousesCellsSharedByCells(cells)).toStrictEqual(expectedResult)
    })

    test('returns unique column and block cells when cells are shared by column and block', () => {
        const cells = [
            { row: 3, col: 1 },
            { row: 4, col: 1 },
        ]
        const expectedResult = [
            { row: 0, col: 1 },
            { row: 1, col: 1 },
            { row: 2, col: 1 },
            { row: 3, col: 1 },
            { row: 4, col: 1 },
            { row: 5, col: 1 },
            { row: 6, col: 1 },
            { row: 7, col: 1 },
            { row: 8, col: 1 },
            { row: 3, col: 0 },
            { row: 4, col: 0 },
            { row: 5, col: 0 },
            { row: 3, col: 2 },
            { row: 4, col: 2 },
            { row: 5, col: 2 },
        ]
        const returnedResultAsExpected = areSameCellsSets(getHousesCellsSharedByCells(cells), expectedResult)
        expect(returnedResultAsExpected).toBeTruthy()
    })
})

describe('isGenerateNewPuzzleItem()', () => {
    test('returns true if chosen item will result in generating a new puzzle using algorithm', () => {
        expect(isGenerateNewPuzzleItem(LEVEL_DIFFICULTIES.MEDIUM)).toBeTruthy()
    })

    test('returns false if above consition is not satisfied', () => {
        expect(isGenerateNewPuzzleItem(CUSTOMIZED_PUZZLE_LEVEL_TITLE)).toBeFalsy()
    })
})

describe('getHousesCommonCells()', () => {
    test('returns cells common in 1st block and 3rd column', () => {
        const houseA = { type: HOUSE_TYPE.BLOCK, num: 0 }
        const houseB = { type: HOUSE_TYPE.COL, num: 2 }
        const expectedCommonCells = [
            { row: 0, col: 2 },
            { row: 1, col: 2 },
            { row: 2, col: 2 },
        ]
        expect(getHousesCommonCells(houseA, houseB)).toEqual(expectedCommonCells)
    })

    test('returns cells common in 1st row and 3rd column', () => {
        const houseA = { type: HOUSE_TYPE.ROW, num: 0 }
        const houseB = { type: HOUSE_TYPE.COL, num: 2 }
        const expectedCommonCells = [{ row: 0, col: 2 }]
        expect(getHousesCommonCells(houseA, houseB)).toEqual(expectedCommonCells)
    })

    test('returns empty array when no common cells are present in houses', () => {
        const houseA = { type: HOUSE_TYPE.ROW, num: 0 }
        const houseB = { type: HOUSE_TYPE.ROW, num: 2 }
        const expectedCommonCells = []
        expect(getHousesCommonCells(houseA, houseB)).toEqual(expectedCommonCells)
    })
})

describe('getBlockStartCell()', () => {
    test('returns most top-left cell of 1st block', () => {
        expect(getBlockStartCell(0)).toEqual({ row: 0, col: 0 })
    })

    test('returns most top-left cell of 8th block', () => {
        expect(getBlockStartCell(7)).toEqual({ row: 6, col: 3 })
    })
})

describe('getHouseAxesValue()', () => {
    test('returns column house Axis value', () => {
        const house = { type: HOUSE_TYPE.COL, num: 0 }
        expect(getHouseAxesValue(house)).toBe('1')
    })

    test('returns row house Axis value', () => {
        const house = { type: HOUSE_TYPE.ROW, num: 6 }
        expect(getHouseAxesValue(house)).toBe('G')
    })

    test('returns empty string for block house', () => {
        const house = { type: HOUSE_TYPE.BLOCK, num: 6 }
        expect(getHouseAxesValue(house)).toBe('')
    })
})

describe('getCellsSharingHousesWithCells()', () => {
    describe('returns cells which share any house with both of given cells', () => {
        test('when each cell have a column in other cell block', () => {
            const cellA = { row: 0, col: 1 }
            const cellB = { row: 3, col: 2 }
            const expectedResult = [
                { row: 3, col: 1 },
                { row: 4, col: 1 },
                { row: 5, col: 1 },
                { row: 0, col: 2 },
                { row: 1, col: 2 },
                { row: 2, col: 2 },
            ]
            expect(getCellsSharingHousesWithCells(cellA, cellB)).toEqual(expectedResult)
        })

        test('when each cell have a row on other cell block', () => {
            const cellA = { row: 3, col: 2 }
            const cellB = { row: 5, col: 6 }
            const expectedResult = [
                { row: 3, col: 6 },
                { row: 3, col: 7 },
                { row: 3, col: 8 },
                { row: 5, col: 0 },
                { row: 5, col: 1 },
                { row: 5, col: 2 },
            ]
            expect(getCellsSharingHousesWithCells(cellA, cellB)).toEqual(expectedResult)
        })

        test('when only two cells share house', () => {
            const cellA = { row: 0, col: 1 }
            const cellB = { row: 8, col: 8 }
            const expectedResult = [
                { row: 0, col: 8 },
                { row: 8, col: 1 },
            ]
            expect(getCellsSharingHousesWithCells(cellA, cellB)).toEqual(expectedResult)
        })

        test('when cells are in same block and same row', () => {
            const cellA = { row: 4, col: 3 }
            const cellB = { row: 4, col: 5 }
            const expectedResult = [
                { row: 4, col: 0 },
                { row: 4, col: 1 },
                { row: 4, col: 2 },
                { row: 4, col: 3 },
                { row: 4, col: 4 },
                { row: 4, col: 5 },
                { row: 4, col: 6 },
                { row: 4, col: 7 },
                { row: 4, col: 8 },
                { row: 3, col: 3 },
                { row: 3, col: 4 },
                { row: 3, col: 5 },
                { row: 5, col: 3 },
                { row: 5, col: 4 },
                { row: 5, col: 5 },
            ]
            expect(getCellsSharingHousesWithCells(cellA, cellB)).toEqual(expectedResult)
        })
    })
})

describe('getCellAllHousesCells()', () => {
    test('returns all the cells which are in all 3 houses of given cell, order of houses is [block, row, col]', () => {
        const cell = { row: 3, col: 2 }
        const expectedResult = [
            { row: 3, col: 0 },
            { row: 3, col: 1 },
            { row: 3, col: 2 },
            { row: 4, col: 0 },
            { row: 4, col: 1 },
            { row: 4, col: 2 },
            { row: 5, col: 0 },
            { row: 5, col: 1 },
            { row: 5, col: 2 },
            { row: 3, col: 3 },
            { row: 3, col: 4 },
            { row: 3, col: 5 },
            { row: 3, col: 6 },
            { row: 3, col: 7 },
            { row: 3, col: 8 },
            { row: 0, col: 2 },
            { row: 1, col: 2 },
            { row: 2, col: 2 },
            { row: 6, col: 2 },
            { row: 7, col: 2 },
            { row: 8, col: 2 },
        ]
        expect(getCellAllHousesCells(cell)).toEqual(expectedResult)
    })
})

describe('sortCells()', () => {
    test('does not mutate the original list of cells', () => {
        const cells = [{ row: 3, col: 2 }, { row: 3, col: 1 }, { row: 1, col: 1 }]
        const cellsDupRef = cells
        sortCells(cells)
        expect(cells === cellsDupRef).toBeTruthy()
        expect(cells).toStrictEqual([{ row: 3, col: 2 }, { row: 3, col: 1 }, { row: 1, col: 1 }])
    })

    test('returns sorted cells assuming top left corner as origin', () => {
        const cells = [{ row: 3, col: 2 }, { row: 3, col: 1 }, { row: 1, col: 1 }]
        const expectedResult = [
            { row: 1, col: 1 }, { row: 3, col: 1 }, { row: 3, col: 2 },
        ]

        expect(sortCells(cells)).toEqual(expectedResult)
    })
})

describe('getNoteHostCellsInHouse()', () => {
    test('returns the list of cells from a house in which a note is visible', () => {
        const house = { type: HOUSE_TYPE.ROW, num: 0 }
        const expectedResult = [{ row: 0, col: 1 }, { row: 0, col: 8 }]
        const puzzle = '304520080006090000050070300000689023000734000063152700010960000009040060608217005'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)
        expect(getNoteHostCellsInHouse(7, house, notes)).toEqual(expectedResult)
    })

    test('returns empty array if note is not present anywhere in house', () => {
        const house = { type: HOUSE_TYPE.BLOCK, num: 0 }
        const puzzle = '304520080006090000050070300000689023000734000063152700010960000009040060608217005'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)
        expect(getNoteHostCellsInHouse(3, house, notes)).toEqual([])
    })
})

describe('areAdjacentCells()', () => {
    test('returns true if cells are side by side sharing an edge between them', () => {
        expect(areAdjacentCells({ row: 0, col: 0 }, { row: 0, col: 1 })).toBeTruthy()
        expect(areAdjacentCells({ row: 4, col: 3 }, { row: 4, col: 4 })).toBeTruthy()
    })

    test('returns true if cells are up and down and share an edge between them', () => {
        expect(areAdjacentCells({ row: 0, col: 0 }, { row: 1, col: 0 })).toBeTruthy()
        expect(areAdjacentCells({ row: 4, col: 3 }, { row: 5, col: 3 })).toBeTruthy()
    })

    test('returns false for cells not sharing any edge between them', () => {
        expect(areAdjacentCells({ row: 0, col: 0 }, { row: 1, col: 1 })).toBeFalsy()
        expect(areAdjacentCells({ row: 4, col: 3 }, { row: 8, col: 8 })).toBeFalsy()
    })
})

describe('areCellsFromSameHouse()', () => {
    test('returns true when cells are in same row', () => {
        const cells = [{ row: 0, col: 0 }, { row: 0, col: 4 }, { row: 0, col: 7 }]
        expect(areCellsFromSameHouse(cells)).toBe(true)
    })

    test('returns true when cells are in same block', () => {
        const cells = [{ row: 3, col: 3 }, { row: 4, col: 4 }, { row: 4, col: 5 }]
        expect(areCellsFromSameHouse(cells)).toBe(true)
    })

    test('returns false when cells are not in same house', () => {
        const cells = [{ row: 3, col: 3 }, { row: 4, col: 4 }, { row: 4, col: 8 }]
        expect(areCellsFromSameHouse(cells)).toBe(false)
    })
})
