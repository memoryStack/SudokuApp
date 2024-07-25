import { getPuzzleDataFromPuzzleString } from '@domain/board/testingUtils/puzzleDataGenerator'

import { getCellsFromCellsWithNote, getNotesFromCellsWithNotes, getNakedSingleCellsWithNoteInAscOrder } from './helpers'

describe('getNakedSingleCellsWithNoteInAscOrder()', () => {
    test('returns an array of objects with cell and note as keys and in sorted order wrt note value', () => {
        const puzzle = '400000107305800406080406320043050070000000940801003002004530708500070204018004030'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const cells = [
            { row: 1, col: 7 },
            { row: 3, col: 8 },
        ]
        const expectedResult = [
            { cell: { row: 3, col: 8 }, note: 1 },
            { cell: { row: 1, col: 7 }, note: 9 },
        ]
        expect(getNakedSingleCellsWithNoteInAscOrder(cells, notes)).toStrictEqual(expectedResult)
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
