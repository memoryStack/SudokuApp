import _get from '@lodash/get'
import _filter from '@lodash/filter'
import _every from '@lodash/every'
import _isEqual from '@lodash/isEqual'
import _map from '@lodash/map'

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

export const NotesRecord = {
    getCellNotes,
    isNotePresentInCell,
    getCellVisibleNotesList,
    getCellVisibleNotesCount,
    areSameNotesInCells,
}
