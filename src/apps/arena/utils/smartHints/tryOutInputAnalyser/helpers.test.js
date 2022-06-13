import {
    getNakedSingleCellsWithNoteInAscOrder,
    getNotesFromCellsWithNotes,
    getCellsFromCellsWithNote,
    getCellsAxesList,
} from './helpers'
import { areNakedDoubleHostCells } from './nakedTripple'

describe('getNakedSingleCellsWithNoteInAscOrder()', () => {
    test('returns an array of objects with cell and note as keys and in sorted order wrt note value', () => {
        const { boardNotes } = require('./testData')
        const cells = [
            { row: 1, col: 7 },
            { row: 3, col: 8 },
        ]
        const expectedResult = [
            { cell: { row: 3, col: 8 }, note: 1 },
            { cell: { row: 1, col: 7 }, note: 9 },
        ]
        expect(getNakedSingleCellsWithNoteInAscOrder(cells, boardNotes)).toStrictEqual(expectedResult)
    })
})

describe('getNotesFromCellsWithNote()', () => {
    test('returns list of notes from each entry in same order', () => {
        const cellsWithNotes = [
            { cell: { row: 3, col: 8 }, note: 1 },
            { cell: { row: 1, col: 7 }, note: 9 },
        ]
        const expectedResult = [1, 9]
        expect(getNotesFromCellsWithNotes(cellsWithNotes)).toStrictEqual(expectedResult)
    })
})

describe('getCellsFromCellsWithNote()', () => {
    test('returns list of cells from each entry in same order', () => {
        const cellsWithNotes = [
            { cell: { row: 3, col: 8 }, note: 1 },
            { cell: { row: 1, col: 7 }, note: 9 },
        ]
        const expectedResult = [
            { row: 3, col: 8 },
            { row: 1, col: 7 },
        ]
        expect(getCellsFromCellsWithNote(cellsWithNotes)).toStrictEqual(expectedResult)
    })
})

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

describe('areNakedDoubleHostCells()', () => {
    test('returns true when two cells have two same possible candidates only in them, [5, 6] and [5, 6] in this case', () => {
        const { boardNotes } = require('./testData')
        const cells = [
            { row: 5, col: 6 },
            { row: 5, col: 7 },
        ]
        expect(areNakedDoubleHostCells(cells, boardNotes)).toBe(true)
    })

    test('returns true when two cells have two same possible candidates only in them, [5, 9] and [5, 9] in this case', () => {
        const { boardNotes } = require('./testData')
        const cells = [
            { row: 2, col: 8 },
            { row: 8, col: 8 },
        ]
        expect(areNakedDoubleHostCells(cells, boardNotes)).toBe(true)
    })

    test('returns false when two cells have two possible candidates only in them but are different set of candidates, [5, 6] and [5, 9] in this case', () => {
        const { boardNotes } = require('./testData')
        const cells = [
            { row: 8, col: 6 },
            { row: 8, col: 8 },
        ]
        expect(areNakedDoubleHostCells(cells, boardNotes)).toBe(false)
    })

    test('returns false always when atleast one of the two cells have more than two possible candidates in it, [5, 9] and [5, 8, 9] in this case', () => {
        const { boardNotes } = require('./testData')
        const cells = [
            { row: 0, col: 7 },
            { row: 2, col: 8 },
        ]
        expect(areNakedDoubleHostCells(cells, boardNotes)).toBe(false)
    })
})
