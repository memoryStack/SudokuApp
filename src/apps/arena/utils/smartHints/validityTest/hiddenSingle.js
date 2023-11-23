import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { BoardIterators } from '../../classes/boardIterators'
import { getCellHouseForHouseType } from '../../util'

export const isValidHiddenSingle = (hiddenSingle, possibleNotes) => {
    let candidatePossibleNotesCount = 0

    const { type: hostHouseType, cell, candidate } = hiddenSingle
    BoardIterators.forHouseEachCell(getCellHouseForHouseType(hostHouseType, cell), houseCell => {
        if (NotesRecord.isNotePresentInCell(possibleNotes, candidate, houseCell)) candidatePossibleNotesCount++
    })

    return candidatePossibleNotesCount === 1
}
