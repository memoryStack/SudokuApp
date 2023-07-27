import { NotesRecord } from 'src/apps/arena/RecordUtilities/boardNotes'
import { forHouseEachCell, getCellHouseForHouseType } from '../../util'

export const isValidHiddenSingle = ({ type: hostHouseType, cell, candidate }, possibleNotes) => {
    let candidatePossibleNotesCount = 0

    forHouseEachCell(getCellHouseForHouseType(hostHouseType, cell), cell => {
        if (NotesRecord.isNotePresentInCell(possibleNotes, candidate, cell)) candidatePossibleNotesCount++
    })

    return candidatePossibleNotesCount === 1
}
