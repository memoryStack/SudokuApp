import { forHouseEachCell, getCellHouseInfo } from '../../util'

export const isValidHiddenSingle = ({ type: hostHouseType, cell, candidate }, _, possibleNotes) => {
    let candidatePossibleNotesCount = 0

    forHouseEachCell(getCellHouseInfo(hostHouseType, cell), ({ row, col }) => {
        if (possibleNotes[row][col][candidate - 1].show) candidatePossibleNotesCount++
    })

    return candidatePossibleNotesCount === 1
}
