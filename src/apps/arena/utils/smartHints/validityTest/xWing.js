import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { filterHouseCells, getCellHouseForHouseType, isCellExists } from '../../util'

export const isValidXWing = ({ legs, houseType }, possibleNotes) => {
    const candidatePossibleInOtherThanHostCells = legs.some(({ candidate, cells: hostCells }) => filterHouseCells(getCellHouseForHouseType(houseType, hostCells[0]), cell => !isCellExists(cell, hostCells))
        .some(cell => NotesRecord.isNotePresentInCell(possibleNotes, candidate, cell)))

    return !candidatePossibleInOtherThanHostCells
}
