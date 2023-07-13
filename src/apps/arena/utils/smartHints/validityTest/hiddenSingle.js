import { forHouseEachCell, getCellHouseForHouseType } from '../../util'

export const isValidHiddenSingle = ({ type: hostHouseType, cell, candidate }, possibleNotes) => {
    let candidatePossibleNotesCount = 0

    forHouseEachCell(getCellHouseForHouseType(hostHouseType, cell), ({ row, col }) => {
        if (possibleNotes[row][col][candidate - 1].show) candidatePossibleNotesCount++
    })

    return candidatePossibleNotesCount === 1
}
