import _get from '@lodash/get'
import _filter from '@lodash/filter'
import _every from '@lodash/every'
import _isEqual from '@lodash/isEqual'
import _map from '@lodash/map'

/*
    // what do we do with notes ??
    1. get notes data of a cell
    2. check if some note is present or not in a cell
    3 get list of all the notes present in a cell
*/

const getCellNotes = (notes, cell = {}) => _get(notes, [cell.row, cell.col])

const isNotePresentInCell = (notes, note, cell = {}) => {
    const cellNotes = getCellNotes(notes, cell)
    return !!_get(cellNotes, [note - 1, 'show'])
}

const getCellVisibleNotesList = (notes, cell = {}) => {
    const cellNotes = getCellNotes(notes, cell)
    return _filter(cellNotes, ({ show }) => show).map(({ noteValue }) => noteValue)
}

export const getCellVisibleNotesCount = (notes, cell = {}) => getCellVisibleNotesList(notes, cell).length

export const areSameNotesInCells = (notes, cells) => {
    const cellsNotes = _map(cells, cell => getCellVisibleNotesList(notes[cell.row][cell.col]))
    return _every(cellsNotes, aCellNotes => _isEqual(aCellNotes, cellsNotes[0]))
}

export const NotesRecord = {
    getCellNotes,
    isNotePresentInCell,
    getCellVisibleNotesList,
    getCellVisibleNotesCount,
}
