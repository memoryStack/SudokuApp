import _get from '@lodash/get'
import _filter from '@lodash/filter'
import _every from '@lodash/every'
import _isEqual from '@lodash/isEqual'
import _map from '@lodash/map'

import { CELLS_IN_HOUSE, NUMBERS_IN_HOUSE } from '../constants'
import { BoardIterators } from '../utils/classes/boardIterators'
import { isMainNumberPresentInAnyHouseOfCell } from '../utils/util'

import { MainNumbersRecord } from './boardMainNumbers'

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

const getCellAllPossibleNotes = (cell: Cell, mainNumbers: MainNumbers) => {
    const result: Note[] = []
    if (MainNumbersRecord.isCellFilled(mainNumbers, cell)) return result

    BoardIterators.forCellEachNote(note => {
        if (!isMainNumberPresentInAnyHouseOfCell(note, cell, mainNumbers)) {
            result.push({ noteValue: note, show: 1 })
        } else {
            result.push({ noteValue: note, show: 0 })
        }
    })

    return result
}

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
