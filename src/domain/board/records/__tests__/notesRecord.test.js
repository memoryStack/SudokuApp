import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'

import { NotesRecord } from '../notesRecord'

describe('NotesRecord', () => {
    test('returns notes data for a particular cell from all notes record', () => {
        const cell = { row: 0, col: 0 }
        const notes = [
            [
                [
                    {
                        noteValue: 1,
                        show: 0,
                    },
                    {
                        noteValue: 2,
                        show: 0,
                    },
                    {
                        noteValue: 3,
                        show: 0,
                    },
                    {
                        noteValue: 4,
                        show: 0,
                    },
                    {
                        noteValue: 5,
                        show: 0,
                    },
                    {
                        noteValue: 6,
                        show: 0,
                    },
                    {
                        noteValue: 7,
                        show: 0,
                    },
                    {
                        noteValue: 8,
                        show: 0,
                    },
                    {
                        noteValue: 9,
                        show: 0,
                    },
                ],
            ],
        ]
        expect(NotesRecord.getCellNotes(notes, cell)).toEqual([
            {
                noteValue: 1,
                show: 0,
            },
            {
                noteValue: 2,
                show: 0,
            },
            {
                noteValue: 3,
                show: 0,
            },
            {
                noteValue: 4,
                show: 0,
            },
            {
                noteValue: 5,
                show: 0,
            },
            {
                noteValue: 6,
                show: 0,
            },
            {
                noteValue: 7,
                show: 0,
            },
            {
                noteValue: 8,
                show: 0,
            },
            {
                noteValue: 9,
                show: 0,
            },
        ])
    })

    test('tells if a note is present or not in cell', () => {
        const cell = { row: 0, col: 0 }
        const notes = [
            [
                [
                    {
                        noteValue: 1,
                        show: 0,
                    },
                    {
                        noteValue: 2,
                        show: 1,
                    },
                    {
                        noteValue: 3,
                        show: 0,
                    },
                    {
                        noteValue: 4,
                        show: 0,
                    },
                    {
                        noteValue: 5,
                        show: 0,
                    },
                    {
                        noteValue: 6,
                        show: 0,
                    },
                    {
                        noteValue: 7,
                        show: 0,
                    },
                    {
                        noteValue: 8,
                        show: 0,
                    },
                    {
                        noteValue: 9,
                        show: 0,
                    },
                ],
            ],
        ]

        expect(NotesRecord.isNotePresentInCell(notes, 1, cell)).toBe(false)
        expect(NotesRecord.isNotePresentInCell(notes, 2, cell)).toBe(true)
    })

    test('returns a list of visible notes in a cell', () => {
        const cell = { row: 0, col: 0 }
        const notes = [
            [
                [
                    {
                        noteValue: 1,
                        show: 0,
                    },
                    {
                        noteValue: 2,
                        show: 1,
                    },
                    {
                        noteValue: 3,
                        show: 0,
                    },
                    {
                        noteValue: 4,
                        show: 0,
                    },
                    {
                        noteValue: 5,
                        show: 0,
                    },
                    {
                        noteValue: 6,
                        show: 0,
                    },
                    {
                        noteValue: 7,
                        show: 0,
                    },
                    {
                        noteValue: 8,
                        show: 0,
                    },
                    {
                        noteValue: 9,
                        show: 1,
                    },
                ],
            ],
        ]

        expect(NotesRecord.getCellVisibleNotesList(notes, cell)).toEqual([2, 9])
    })

    test('returns visible notes count in a cell', () => {
        const cell = { row: 0, col: 0 }
        const notes = [
            [
                [
                    {
                        noteValue: 1,
                        show: 0,
                    },
                    {
                        noteValue: 2,
                        show: 1,
                    },
                    {
                        noteValue: 3,
                        show: 0,
                    },
                    {
                        noteValue: 4,
                        show: 0,
                    },
                    {
                        noteValue: 5,
                        show: 0,
                    },
                    {
                        noteValue: 6,
                        show: 0,
                    },
                    {
                        noteValue: 7,
                        show: 0,
                    },
                    {
                        noteValue: 8,
                        show: 0,
                    },
                    {
                        noteValue: 9,
                        show: 1,
                    },
                ],
            ],
        ]

        expect(NotesRecord.getCellVisibleNotesCount(notes, cell)).toBe(2)
    })
})

describe('NotesRecord.areSameNotesInCells()', () => {
    // TODO: take care of this file import
    // it's long way from home

    const puzzle = '400000107305800406080406320043050070000000940801003002004530708500070204018004030'
    const { notes } = getPuzzleDataFromPuzzleString(puzzle)

    test('returns true when two cells have two same possible candidates only in them, [5, 6] and [5, 6] in this case', () => {
        const cells = [
            { row: 5, col: 6 },
            { row: 5, col: 7 },
        ]
        expect(NotesRecord.areSameNotesInCells(notes, cells)).toBe(true)
    })

    test('returns true when two cells have two same possible candidates only in them, [5, 9] and [5, 9] in this case', () => {
        const cells = [
            { row: 2, col: 8 },
            { row: 8, col: 8 },
        ]
        expect(NotesRecord.areSameNotesInCells(notes, cells)).toBe(true)
    })

    test('returns false when two cells have two possible candidates only in them but are different set of candidates, [5, 6] and [5, 9] in this case', () => {
        const cells = [
            { row: 8, col: 6 },
            { row: 8, col: 8 },
        ]
        expect(NotesRecord.areSameNotesInCells(notes, cells)).toBe(false)
    })

    test('returns false always when atleast one of the two cells have more than two possible candidates in it, [5, 9] and [5, 8, 9] in this case', () => {
        const cells = [
            { row: 0, col: 7 },
            { row: 2, col: 8 },
        ]
        expect(NotesRecord.areSameNotesInCells(notes, cells)).toBe(false)
    })
})

