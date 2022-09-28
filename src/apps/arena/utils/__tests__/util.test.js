import _isArray from 'lodash/src/utils/isArray'
import _isEmpty from 'lodash/src/utils/isEmpty'

import {
    addLeadingZeroIfEligible,
    shouldSaveGameState,
    areSameCells,
    areSameBlockCells,
    areSameRowCells,
    areSameColCells,
    getPairCellsCommonHouses,
    getCellVisibleNotes,
    getCellVisibleNotesCount,
    getCellsCommonHouses,
    areSameCellsSets,
    getHousePossibleNotes,
    forCellEachNote,
    forBoardEachCell,
    areCommonHouseCells,
    isCellCorrectlyFilled,
    sameHouseAsSelected,
    getRowAndCol,
    getBlockAndBoxNum,
    initMainNumbers,
} from '../util'
import { GAME_STATE } from '../../../../resources/constants'
import { HOUSE_TYPE } from '../smartHints/constants'
import { consoleLog } from '../../../../utils/util'

describe('time component value formatter', () => {
    test('addLeadingZeroIfEligible test 1', () => {
        expect(addLeadingZeroIfEligible(0)).toBe('00')
    })

    test('addLeadingZeroIfEligible test 2', () => {
        expect(addLeadingZeroIfEligible(11)).toBe('11')
    })

    test('addLeadingZeroIfEligible test 3', () => {
        expect(addLeadingZeroIfEligible(1)).toBe('01')
    })
})

describe('should cache game data', () => {
    test('shouldSaveGameState test 1', () => {
        expect(shouldSaveGameState(GAME_STATE.OVER.SOLVED, GAME_STATE.ACTIVE)).toBe(true)
    })

    test('shouldSaveGameState test 2', () => {
        expect(shouldSaveGameState(GAME_STATE.OVER.UNSOLVED, GAME_STATE.ACTIVE)).toBe(true)
    })

    test('shouldSaveGameState test 3', () => {
        expect(shouldSaveGameState(GAME_STATE.ACTIVE, GAME_STATE.INACTIVE)).toBe(false)
    })

    test('shouldSaveGameState test 4', () => {
        expect(shouldSaveGameState(GAME_STATE.INACTIVE, GAME_STATE.ACTIVE)).toBe(true)
    })

    test('shouldSaveGameState test 2', () => {
        expect(shouldSaveGameState(GAME_STATE.DISPLAY_HINT, GAME_STATE.ACTIVE)).toBe(true)
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

describe('two arrays same values', () => {
    test('test 1', () => {
        const arrayA = [1, 2]
        const arrayB = [1]
        expect(arrayA.sameArrays(arrayB)).toBe(false)
    })

    test('test 2', () => {
        const arrayA = [1, 2]
        const arrayB = [1, 3]
        expect(arrayA.sameArrays(arrayB)).toBe(false)
    })

    test('test 2', () => {
        const arrayA = [1, 2]
        const arrayB = [1, 2]
        expect(arrayA.sameArrays(arrayB)).toBe(true)
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

test('get cell visible notes ', () => {
    const cellNotesTestOne = [
        { noteValue: 1, show: 0 },
        { noteValue: 2, show: 0 },
        { noteValue: 3, show: 1 },
        { noteValue: 4, show: 0 },
        { noteValue: 5, show: 0 },
        { noteValue: 6, show: 1 },
        { noteValue: 7, show: 0 },
        { noteValue: 8, show: 0 },
        { noteValue: 9, show: 0 },
    ]

    expect(getCellVisibleNotes(cellNotesTestOne)).toStrictEqual([3, 6])

    const cellNotesTestTwo = [
        { noteValue: 1, show: 0 },
        { noteValue: 2, show: 0 },
        { noteValue: 3, show: 0 },
        { noteValue: 4, show: 0 },
        { noteValue: 5, show: 0 },
        { noteValue: 6, show: 0 },
        { noteValue: 7, show: 0 },
        { noteValue: 8, show: 0 },
        { noteValue: 9, show: 0 },
    ]

    expect(getCellVisibleNotes(cellNotesTestTwo)).toStrictEqual([])
})

test('cell visible notes count ', () => {
    const cellNotesTestOne = [
        { noteValue: 1, show: 0 },
        { noteValue: 2, show: 0 },
        { noteValue: 3, show: 1 },
        { noteValue: 4, show: 0 },
        { noteValue: 5, show: 0 },
        { noteValue: 6, show: 1 },
        { noteValue: 7, show: 0 },
        { noteValue: 8, show: 0 },
        { noteValue: 9, show: 0 },
    ]

    expect(getCellVisibleNotesCount(cellNotesTestOne)).toBe(2)

    const cellNotesTestTwo = [
        { noteValue: 1, show: 0 },
        { noteValue: 2, show: 0 },
        { noteValue: 3, show: 0 },
        { noteValue: 4, show: 0 },
        { noteValue: 5, show: 0 },
        { noteValue: 6, show: 0 },
        { noteValue: 7, show: 0 },
        { noteValue: 8, show: 0 },
        { noteValue: 9, show: 0 },
    ]

    expect(getCellVisibleNotesCount(cellNotesTestTwo)).toBe(0)
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

describe('all possible notes in house', () => {
    test('test 1', () => {
        const { mainNumbers } = require('../smartHints/xWing/testData/perfectXWing')
        const house = { type: HOUSE_TYPE.ROW, num: 0 }
        const expectedPossibleNotes = [1, 2, 3, 4, 8]
        expect(getHousePossibleNotes(house, mainNumbers)).toStrictEqual(expectedPossibleNotes)
    })

    test('test 2', () => {
        const { mainNumbers } = require('../smartHints/xWing/testData/perfectXWing')
        const house = { type: HOUSE_TYPE.COL, num: 5 }
        const expectedPossibleNotes = [1, 3, 4, 6, 9]
        expect(getHousePossibleNotes(house, mainNumbers)).toStrictEqual(expectedPossibleNotes)
    })

    test('test 3', () => {
        const { mainNumbers } = require('../smartHints/xWing/testData/perfectXWing')
        const house = { type: HOUSE_TYPE.BLOCK, num: 8 }
        const expectedPossibleNotes = [1, 6, 7, 8, 9]
        expect(getHousePossibleNotes(house, mainNumbers)).toStrictEqual(expectedPossibleNotes)
    })
})

describe('forCellEachNote()', () => {
    test('calls the callback 9 times, once for each note', () => {
        const mockCallback = jest.fn()
        forCellEachNote(mockCallback)
        expect(mockCallback.mock.calls.length).toBe(9)
    })
})

describe('forBoardEachCell()', () => {
    test('calls the callback 81 times, oncefor each cell', () => {
        const mockCallback = jest.fn()
        forBoardEachCell(mockCallback)
        expect(mockCallback.mock.calls.length).toBe(81)
    })
})

describe('isCellCorrectlyFilled()', () => {
    test('returns false when input value is different than solution value of cell', () => {
        const cellData = { value: 0, solutionValue: 5, isClue: false }
        expect(isCellCorrectlyFilled(cellData)).toBeFalsy()
    })

    test('returns true when input value is same as solution value', () => {
        const cellData = { value: 5, solutionValue: 5, isClue: false }
        expect(isCellCorrectlyFilled(cellData)).toBeTruthy()
    })

    test('returns false for bad data', () => {
        expect(isCellCorrectlyFilled({ solutionValue: 5, isClue: false })).toBeFalsy()
        expect(isCellCorrectlyFilled({ value: 0, solutionValue: 0, isClue: false })).toBeFalsy()
        expect(isCellCorrectlyFilled()).toBeFalsy()
    })
})

describe('sameHouseAsSelected()', () => {
    test('returns true when cell belongs to same block as selected cell', () => {
        expect(sameHouseAsSelected({ row: 0, col: 0 }, { row: 1, col: 1 })).toBe(true)
    })

    test('returns true when cell belongs to same row as selected cell', () => {
        expect(sameHouseAsSelected({ row: 0, col: 0 }, { row: 0, col: 8 })).toBe(true)
    })

    test('returns true when cell belongs to same col as selected cell', () => {
        expect(sameHouseAsSelected({ row: 2, col: 4 }, { row: 6, col: 4 })).toBe(true)
    })

    test(`returns false when cell doesn't have any common house as selected cell`, () => {
        expect(sameHouseAsSelected({ row: 0, col: 0 }, { row: 6, col: 4 })).toBe(false)
        expect(sameHouseAsSelected({ row: 0, col: 0 }, { row: 3, col: 3 })).toBe(false)
        expect(sameHouseAsSelected({ row: 2, col: 2 }, { row: 3, col: 3 })).toBe(false)
    })
})

describe('getRowAndCol()', () => {
    test('returns cell row and col upon passing block number and box number in the block', () => {
        expect(getRowAndCol(0, 7)).toStrictEqual({ row: 2, col: 1 })
        expect(getRowAndCol(4, 1)).toStrictEqual({ row: 3, col: 4 })
        expect(getRowAndCol(8, 8)).toStrictEqual({ row: 8, col: 8 })
    })
})

describe('getBlockAndBoxNum()', () => {
    test('returns cell block and box number upon passing cell row and col numbers', () => {
        expect(getBlockAndBoxNum({ row: 2, col: 7 })).toStrictEqual({ blockNum: 2, boxNum: 7 })
        expect(getBlockAndBoxNum({ row: 4, col: 4 })).toStrictEqual({ blockNum: 4, boxNum: 4 })
        expect(getBlockAndBoxNum({ row: 4, col: 6 })).toStrictEqual({ blockNum: 5, boxNum: 3 })
    })
})

describe('initMainNumbers()', () => {
    test('returns an array which contains 9 other arrays in init', () => {
        const mainNumbers = initMainNumbers()
        expect(_isArray(mainNumbers)).toBeTruthy()
    })

    test('returned value is a grid of 9*9', () => {
        const mainNumbers = initMainNumbers()
        expect(mainNumbers.length).toBe(9)
        mainNumbers.forEach(rowMainNumbers => {
            expect(_isArray(rowMainNumbers)).toBeTruthy()
            expect(rowMainNumbers.length).toBe(9)
        })
    })

    test('initializes default main number values for each 9*9 cells in board', () => {
        const mainNumbers = initMainNumbers()
        forBoardEachCell(({ row, col }) => {
            expect(_isEmpty(mainNumbers[row][col])).toBeFalsy()
        })
    })
})
