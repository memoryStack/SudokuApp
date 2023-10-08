/* eslint-disable global-require */
import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'

import {
    getAllValidYWingCells,
    getYWingRawHints,
    isValidYWingCell,
    isValidYWingCellsPair,
    getSecondWingExpectedNotes,
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

describe('getYWingRawHints()', () => {
    test('returns row data for all yWings in puzzle', () => {
        const puzzle = '800360900009010863063089005924673158386951724571824396432196587698537000000248639'
        const { mainNumbers, notes } = getPuzzleDataFromPuzzleString(puzzle)
        mockBoardSelectors(notes)

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
        const maxHintsThreshold = Number.POSITIVE_INFINITY
        expect(getYWingRawHints(mainNumbers, notes, maxHintsThreshold)).toStrictEqual(expectedYWings)
    })
})

describe('getAllValidYWingCells()', () => {
    test('returns all valid yWing cells in board based on the notes present in them', () => {
        const puzzle = '800360900009010863063089005924673158386951724571824396432196587698537000000248639'
        const { mainNumbers, notes } = getPuzzleDataFromPuzzleString(puzzle)

        mockBoardSelectors(notes)

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

        expect(getAllValidYWingCells(mainNumbers, notes)).toStrictEqual(expectedValidYWingCells)
    })
})

// TODO: contract has been changed for below function, change that for test cases as well
describe.skip('isValidYWingCell()', () => {
    test('returns true when cell has correct set of notes for being YWing cell', () => {
        const cellUserInputNotes = [
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
        const cellAllPossibleNotes = [
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

        expect(isValidYWingCell(cellUserInputNotes, cellAllPossibleNotes)).toBe(true)
    })

    test('returns false when cell has wrong set of notes for being YWing cell', () => {
        const cellUserInputNotes = [
            { noteValue: 1, show: 0 },
            { noteValue: 2, show: 0 },
            { noteValue: 3, show: 0 },
            { noteValue: 4, show: 0 },
            { noteValue: 5, show: 0 },
            { noteValue: 6, show: 1 },
            { noteValue: 7, show: 1 },
            { noteValue: 8, show: 1 },
            { noteValue: 9, show: 0 },
        ]
        const cellAllPossibleNotes = [
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

        expect(isValidYWingCell(cellUserInputNotes, cellAllPossibleNotes)).toBe(false)
    })
})

describe('isValidYWingCellsPair()', () => {
    test('returns true when these two cells are 2 out of 3 valid yWing cells', () => {
        const cellA = { cell: { row: 0, col: 5 }, notes: [2, 5] }
        const cellB = { cell: { row: 1, col: 5 }, notes: [2, 6] }
        expect(isValidYWingCellsPair(cellA, cellB)).toBeTruthy()
    })

    test('returns false when these two cells together can never make a valid yWing', () => {
        const cellA = { cell: { row: 0, col: 5 }, notes: [2, 5] }
        const cellB = { cell: { row: 1, col: 5 }, notes: [2, 5] }
        expect(isValidYWingCellsPair(cellA, cellB)).toBeFalsy()
    })
})

describe('isValidYWingCellsPair()', () => {
    test('returns expected notes for second wing once pivot and first wing are decided', () => {
        const pivotNotes = [2, 5]
        const firstWingNotes = [1, 5]
        const expectedResult = [1, 2]
        expect(getSecondWingExpectedNotes(pivotNotes, firstWingNotes)).toStrictEqual(expectedResult)
    })

    test('returns expected notes for second wing once pivot and first wing are decided', () => {
        const pivotNotes = [2, 8]
        const firstWingNotes = [5, 8]
        const expectedResult = [2, 5]
        expect(getSecondWingExpectedNotes(pivotNotes, firstWingNotes)).toStrictEqual(expectedResult)
    })

    test('returns expected notes for second wing once pivot and first wing are decided', () => {
        const pivotNotes = [1, 2]
        const firstWingNotes = [2, 4]
        const expectedResult = [1, 4]
        expect(getSecondWingExpectedNotes(pivotNotes, firstWingNotes)).toStrictEqual(expectedResult)
    })
})
