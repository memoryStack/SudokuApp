import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { filterHouseCells, getCellHouseForHouseType, isCellExists } from '../../util'

export const isValidHiddenGroup = ({ houseType, groupCandidates, hostCells }, possibleNotes) => {
    const { num: houseNum } = getCellHouseForHouseType(houseType, hostCells[0])
    const isAnyNotePresentInOtherCell = filterHouseCells({ type: houseType, num: houseNum }, cell => !isCellExists(cell, hostCells))
        .some(cell => NotesRecord.getCellNotes(possibleNotes, cell).some(({ show, noteValue }) => show && groupCandidates.includes(noteValue)))

    return !isAnyNotePresentInOtherCell
}
