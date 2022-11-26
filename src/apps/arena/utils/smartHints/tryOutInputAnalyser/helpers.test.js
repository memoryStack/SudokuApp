import {
    getCellsFromCellsWithNote,
    getNotesFromCellsWithNotes,
    getNakedSingleCellsWithNoteInAscOrder,
} from './nakedGroups/helpers'

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
