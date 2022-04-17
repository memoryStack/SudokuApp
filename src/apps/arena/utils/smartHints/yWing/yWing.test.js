import { HOUSE_TYPE } from '../constants'
import {
    getAllValidYWingCells,
    getAllYWings,
    getCellVisibleNotesCount,
    isValidYWingCell,
    getCellVisibleNotes,
    isValidYWingCellsPair,
    getPairCellsCommonHouses,
    getSecondWingExpectedNotes,
    isCommonHouseCells,
} from './yWing'

jest.mock('../../../../../redux/dispatch.helpers')
jest.mock('../../../store/selectors/board.selectors')

const mockBoardSelectors = mockedNotes => {
    const { getPossibleNotes, getNotesInfo } = require('../../../store/selectors/board.selectors')
    const { getStoreState } = require('../../../../../redux/dispatch.helpers')
    // mocked notes will be same for user input and possibles notes as well
    getPossibleNotes.mockReturnValue(mockedNotes)
    getNotesInfo.mockReturnValue(mockedNotes)
    getStoreState.mockReturnValue({})
}

test('yWing', () => {
    const { mainNumbers, notesData } = require('./testData')

    mockBoardSelectors(notesData)

    const expectedYWings = [
        {
            pivot: { cell: { row: 1, col: 0 }, notes: [2, 7] },
            wings: [
                { cell: { row: 0, col: 2 }, notes: [5, 7] },
                { cell: { row: 1, col: 5 }, notes: [2, 5] },
            ],
            wingsCommonNote: 5,
        },
        {
            pivot: { cell: { row: 0, col: 2 }, notes: [5, 7] },
            wings: [
                { cell: { row: 1, col: 0 }, notes: [2, 7] },
                { cell: { row: 0, col: 5 }, notes: [2, 5] },
            ],
            wingsCommonNote: 2,
        },
        {
            pivot: { cell: { row: 1, col: 1 }, notes: [4, 5] },
            wings: [
                { cell: { row: 0, col: 2 }, notes: [5, 7] },
                { cell: { row: 1, col: 3 }, notes: [4, 7] },
            ],
            wingsCommonNote: 7,
        },
    ]
    expect(getAllYWings(mainNumbers, notesData)).toStrictEqual(expectedYWings)
})

test('all valid yWing cells', () => {
    const { mainNumbers, notesData } = require('./testData')

    mockBoardSelectors(notesData)

    const expectedValidYWingCells = [
        { cell: { row: 0, col: 2 }, notes: [5, 7] },
        { cell: { row: 0, col: 5 }, notes: [2, 5] },
        { cell: { row: 0, col: 8 }, notes: [1, 2] },
        { cell: { row: 1, col: 0 }, notes: [2, 7] },
        { cell: { row: 1, col: 1 }, notes: [4, 5] },
        { cell: { row: 1, col: 3 }, notes: [4, 7] },
        { cell: { row: 1, col: 5 }, notes: [2, 5] },
        { cell: { row: 2, col: 3 }, notes: [4, 7] },
        { cell: { row: 2, col: 6 }, notes: [2, 4] },
        { cell: { row: 7, col: 6 }, notes: [2, 4] },
        { cell: { row: 7, col: 7 }, notes: [1, 4] },
        { cell: { row: 7, col: 8 }, notes: [1, 2] },
        { cell: { row: 8, col: 0 }, notes: [1, 7] },
        { cell: { row: 8, col: 1 }, notes: [1, 5] },
        { cell: { row: 8, col: 2 }, notes: [5, 7] },
    ]

    expect(getAllValidYWingCells(mainNumbers, notesData)).toStrictEqual(expectedValidYWingCells)
})

test('valid yWing cell', () => {
    const testOne = {
        cellUserInputNotes: [
            { noteValue: 1, show: 0 },
            { noteValue: 2, show: 0 },
            { noteValue: 3, show: 1 },
            { noteValue: 4, show: 0 },
            { noteValue: 5, show: 0 },
            { noteValue: 6, show: 1 },
            { noteValue: 7, show: 0 },
            { noteValue: 8, show: 0 },
            { noteValue: 9, show: 0 },
        ],
        cellAllPossibleNotes: [
            { noteValue: 1, show: 0 },
            { noteValue: 2, show: 0 },
            { noteValue: 3, show: 1 },
            { noteValue: 4, show: 0 },
            { noteValue: 5, show: 0 },
            { noteValue: 6, show: 1 },
            { noteValue: 7, show: 0 },
            { noteValue: 8, show: 0 },
            { noteValue: 9, show: 0 },
        ],
    }

    const testTwo = {
        cellUserInputNotes: [
            { noteValue: 1, show: 0 },
            { noteValue: 2, show: 0 },
            { noteValue: 3, show: 0 },
            { noteValue: 4, show: 0 },
            { noteValue: 5, show: 0 },
            { noteValue: 6, show: 1 },
            { noteValue: 7, show: 1 },
            { noteValue: 8, show: 1 },
            { noteValue: 9, show: 0 },
        ],
        cellAllPossibleNotes: [
            { noteValue: 1, show: 0 },
            { noteValue: 2, show: 0 },
            { noteValue: 3, show: 1 },
            { noteValue: 4, show: 0 },
            { noteValue: 5, show: 0 },
            { noteValue: 6, show: 1 },
            { noteValue: 7, show: 0 },
            { noteValue: 8, show: 0 },
            { noteValue: 9, show: 0 },
        ],
    }

    expect(isValidYWingCell(testOne.cellUserInputNotes, testOne.cellAllPossibleNotes)).toBe(true)
    expect(isValidYWingCell(testTwo.cellUserInputNotes, testTwo.cellAllPossibleNotes)).toBe(false)
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

test('valid YWingCellPair', () => {
    const testOne = {
        firstCell: { cell: { row: 0, col: 5 }, notes: [2, 5] },
        secondCell: { cell: { row: 1, col: 5 }, notes: [2, 6] },
    }
    expect(isValidYWingCellsPair(testOne.firstCell, testOne.secondCell)).toBe(true)

    const testTwo = {
        firstCell: { cell: { row: 0, col: 5 }, notes: [2, 5] },
        secondCell: { cell: { row: 1, col: 5 }, notes: [2, 5] },
    }
    expect(isValidYWingCellsPair(testTwo.firstCell, testTwo.secondCell)).toBe(false)
})

// TODO: move this to utils
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

test('expected notes in second wing', () => {
    const testOne = {
        pivotNotes: [2, 5],
        firstWingNotes: [1, 5],
    }
    const testOneExpectedResult = [1, 2]
    expect(getSecondWingExpectedNotes(testOne.pivotNotes, testOne.firstWingNotes)).toStrictEqual(testOneExpectedResult)

    const testTwo = {
        pivotNotes: [2, 8],
        firstWingNotes: [5, 8],
    }
    const testTwoExpectedResult = [2, 5]
    expect(getSecondWingExpectedNotes(testTwo.pivotNotes, testTwo.firstWingNotes)).toStrictEqual(testTwoExpectedResult)

    const testThree = {
        pivotNotes: [1, 2],
        firstWingNotes: [2, 4],
    }
    const testThreeExpectedResult = [1, 4]
    expect(getSecondWingExpectedNotes(testThree.pivotNotes, testThree.firstWingNotes)).toStrictEqual(
        testThreeExpectedResult,
    )
})

test('any common house in cells pairs', () => {
    const testOne = {
        cellA: { row: 2, col: 5 },
        cellB: { row: 1, col: 5 },
    }
    expect(isCommonHouseCells(testOne.cellA, testOne.cellB)).toBe(true)

    const testTwo = {
        cellA: { row: 0, col: 0 },
        cellB: { row: 1, col: 5 },
    }
    expect(isCommonHouseCells(testTwo.cellA, testTwo.cellB)).toBe(false)
})
