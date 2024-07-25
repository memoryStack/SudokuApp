import _get from '@lodash/get'
import _filter from '@lodash/filter'
import _every from '@lodash/every'
import _isEqual from '@lodash/isEqual'
import _map from '@lodash/map'

import { CELLS_IN_A_HOUSE, NUMBERS_IN_A_HOUSE } from './board.constants'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import { isMainNumberPresentInAnyHouseOfCell } from './utils/common'

import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { NotesRecord } from './records/notesRecord'

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

type NoteToSpawn = {
    cell: Cell,
    note: NoteValue
}

type NotesToSpawn = Array<NoteToSpawn>

type Board = {
    getNewNotesToSpawn: (mainNumbers: MainNumbers, notes: Notes) => NotesToSpawn
}

const getNewNotesToSpawn = (mainNumbers: MainNumbers, notes: Notes): NotesToSpawn => {
    const result: NotesToSpawn = []

    BoardIterators.forBoardEachCell(cell => {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
            _filter(
                NotesRecord.getCellNotes(notes, cell),
                ({ noteValue, show }: Note) => !show && !isMainNumberPresentInAnyHouseOfCell(noteValue, cell, mainNumbers),
            ).forEach(({ noteValue }: Note) => {
                result.push({ cell, note: noteValue })
            })
        }
    })

    return result
}

export const Board: Board = {
    getNewNotesToSpawn
}
