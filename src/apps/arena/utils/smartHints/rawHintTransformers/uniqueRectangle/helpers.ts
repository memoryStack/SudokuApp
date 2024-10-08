import _forEach from '@lodash/forEach'
import _filter from '@lodash/filter'
import _difference from '@lodash/difference'

import { NotesRecord } from '@domain/board/records/notesRecord'
import { BoardIterators } from '@domain/board/utils/boardIterators'

import { CellsFocusData, SmartHintsColorSystem } from '../../types'
import { BaseURRawHint, CellAndRemovableNotes, } from '../../types/uniqueRectangle'
import { setCellNotesColor } from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { getCellsDifference } from '../../../util'

// USELESS UTIL
export const highlightURNotesAndRemovableNotes = (
    ur: BaseURRawHint,
    smartHintsColorSystem: SmartHintsColorSystem,
    cellsToFocusData: CellsFocusData
) => {
    _forEach(ur.hostCells, (cell: Cell) => {
        setCellNotesColor(cell, ur.urNotes, smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem), cellsToFocusData)
    })
    _forEach(ur.cellAndRemovableNotes, ({ cell, notes }: CellAndRemovableNotes) => {
        setCellNotesColor(cell, notes, smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem), cellsToFocusData)
    })
}

export const getURHostCellsWithExtraCandidates = (ur: BaseURRawHint, notes: Notes): Cell[] => {
    return _filter(ur.hostCells, (hostCell: Cell) => {
        return NotesRecord.getCellVisibleNotesCount(notes, hostCell) !== 2
    })
}

export const getExtraNotesInURCell = (ur: BaseURRawHint, cell: Cell, notes: Notes) => {
    const extraNotes: NoteValue[] = _difference(NotesRecord.getCellVisibleNotesList(notes, cell), ur.urNotes)
    return extraNotes
}

export const getExtraNotesInURCells = (ur: BaseURRawHint, notes: Notes) => {
    let result: NoteValue[] = []
    const cellsWithExtraNotes = getURHostCellsWithExtraCandidates(ur, notes)

    const notesPresent: { [key: NoteValue]: boolean } = {}
    cellsWithExtraNotes.forEach((cell: Cell) => {
        const extraNotes = getExtraNotesInURCell(ur, cell, notes)
        extraNotes.forEach((extraNote: NoteValue) => {
            notesPresent[extraNote] = true
        })
    })
    BoardIterators.forCellEachNote((noteValue) => {
        if (notesPresent[noteValue]) result.push(noteValue)
    })

    return result
}

export const getURHostCellsHavingURNotesOnly = (ur: BaseURRawHint, notes: Notes) => {
    const cellsWithExtraCandidates = getURHostCellsWithExtraCandidates(ur, notes)
    return getCellsDifference(ur.hostCells, cellsWithExtraCandidates)
}
