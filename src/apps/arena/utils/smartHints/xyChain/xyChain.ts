import _forEach from '@lodash/forEach'
import _isNil from '@lodash/isNil'

import { NotesRecord } from '../../../RecordUtilities/boardNotes'

import { BoardIterators } from '../../classes/boardIterators'

import { HOUSE_TYPE } from '../constants'
import { filterNakedGroupEligibleCellsInHouse } from '../nakedGroup/nakedGroup'
import { NOTES_COUNT_IN_ELIGIBLE_CELLS } from '../remotePairs/remotePairs.constants'
import { cellHasAllPossibleNotes } from '../validityTest/validity.helpers'

// COPY: as it is copy from remotepairs implementation
export const getAllValidCellsWithPairs = (mainNumbers: MainNumbers, notes: Notes, possibleNotes: Notes) => {
    const result: Cell[] = []

    BoardIterators.forEachHouseNum(num => {
        const validCells = filterNakedGroupEligibleCellsInHouse(
            { type: HOUSE_TYPE.ROW, num },
            NOTES_COUNT_IN_ELIGIBLE_CELLS,
            mainNumbers,
            notes,
        ).filter(cell => cellHasAllPossibleNotes(cell, notes, possibleNotes))
        result.push(...validCells)
    })
    return result
}

export const getNotesVSHostCellsMap = (cells: Cell[], notes: Notes) => {
    const result: { [note: NoteValue]: Cell[] } = {}

    _forEach(cells, (cell: Cell) => {
        const cellNotes = NotesRecord.getCellVisibleNotesList(notes, cell)
        _forEach(cellNotes, (cellNote: NoteValue) => {
            if (_isNil(result[cellNote])) result[cellNote] = []
            result[cellNote].push(cell)
        })
    })

    return result
}

// export const getRawXYChainHint = (mainNumbers: MainNumbers, notes: Notes, possibleNotes: Notes): XYChainRawHint => {
//     // const hint = getFirstNoteXChain(notes, possibleNotes)
//     // if (_isEmpty(hint)) {}
// }
