import _get from '@lodash/get'
import _filter from '@lodash/filter'
import _every from '@lodash/every'
import _isEqual from '@lodash/isEqual'
import _map from '@lodash/map'

import { CELLS_IN_A_HOUSE, NUMBERS_IN_A_HOUSE } from '../board.constants'
import { BoardIterators } from '../utils/boardIterators'
import { getCellAllPossibleNotes } from '../utils/common'

const getCellNotes = (notes: Notes, cell = {} as Cell): Note[] => _get(notes, [cell.row, cell.col])

const isNotePresentInCell = (notes: Notes, note: NoteValue, cell = {} as Cell) => {
    const cellNotes = getCellNotes(notes, cell)
    return !!_get(cellNotes, [note - 1, 'show'])
}

const getCellVisibleNotesList = (notes: Notes, cell = {} as Cell): NoteValue[] => {
    const cellNotes = getCellNotes(notes, cell)
    return _filter(cellNotes, ({ show }: Note) => show)
        .map(({ noteValue }: Note) => noteValue)
}

const getCellVisibleNotesCount = (notes: Notes, cell = {} as Cell) => getCellVisibleNotesList(notes, cell).length

const areSameNotesInCells = (notes: Notes, cells: Cell[]) => {
    const cellsNotes: Note[][] = _map(cells, (cell: Cell) => getCellVisibleNotesList(notes, cell))
    return _every(cellsNotes, (aCellNotes: Note[]) => _isEqual(aCellNotes, cellsNotes[0]))
}

const initNotes = () => {
    const result: Notes = []
    for (let row = 0; row < CELLS_IN_A_HOUSE; row++) {
        const rowNotes = []
        for (let col = 0; col < CELLS_IN_A_HOUSE; col++) {
            const boxNotes = []
            for (let note = 1; note <= NUMBERS_IN_A_HOUSE; note++) {
                // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0] represenstion. but let's ignore it for now
                boxNotes.push({ noteValue: note, show: 0 })
            }
            rowNotes.push(boxNotes)
        }
        result.push(rowNotes)
    }
    return result
}

// TODO: think about moving it to board.ts to remove circular dependency
// or move it to "common" utils
const initPossibleNotes = (mainNumbers: MainNumbers) => {
    const notes = initNotes()
    BoardIterators.forBoardEachCell((cell: Cell) => {
        const cellNotes = getCellAllPossibleNotes(cell, mainNumbers)
        notes[cell.row][cell.col] = cellNotes
    })
    return notes
}

export const NotesRecord = {
    getCellNotes,
    isNotePresentInCell,
    getCellVisibleNotesList,
    getCellVisibleNotesCount,
    areSameNotesInCells,
    initNotes,
    initPossibleNotes,
}
