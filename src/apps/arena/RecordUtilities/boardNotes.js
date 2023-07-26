import _get from '@lodash/get'
import _filter from '@lodash/filter'
import _every from '@lodash/every'
import _isEqual from '@lodash/isEqual'
import _map from '@lodash/map'
import { CELLS_IN_HOUSE, NUMBERS_IN_HOUSE } from '../constants'

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

const getCellVisibleNotesCount = (notes, cell = {}) => getCellVisibleNotesList(notes, cell).length

const areSameNotesInCells = (notes, cells) => {
    const cellsNotes = _map(cells, cell => getCellVisibleNotesList(notes[cell.row][cell.col]))
    return _every(cellsNotes, aCellNotes => _isEqual(aCellNotes, cellsNotes[0]))
}

const initNotes = () => {
    const result = []
    for (let row = 0; row < CELLS_IN_HOUSE; row++) {
        const rowNotes = []
        for (let col = 0; col < CELLS_IN_HOUSE; col++) {
            const boxNotes = []
            for (let note = 1; note <= NUMBERS_IN_HOUSE; note++) {
                // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0] represenstion. but let's ignore it for now
                boxNotes.push({ noteValue: note, show: 0 })
            }
            rowNotes.push(boxNotes)
        }
        result.push(rowNotes)
    }
    return result
}

export const NotesRecord = {
    getCellNotes,
    isNotePresentInCell,
    getCellVisibleNotesList,
    getCellVisibleNotesCount,
    areSameNotesInCells,
    initNotes,
}
