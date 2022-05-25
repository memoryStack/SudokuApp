import { filterHouseCells, getCellHouseInfo, isCellExists } from '../../util'

export const isValidHiddenGroup = ({ houseType, groupCandidates, hostCells }, possibleNotes) => {
    const { num: houseNum } = getCellHouseInfo(houseType, hostCells[0])
    const isAnyNotePresentInOtherCell = filterHouseCells({ type: houseType, num: houseNum }, cell => {
        return !isCellExists(cell, hostCells)
    }).some(cell => {
        return possibleNotes[cell.row][cell.col].some(({ show, noteValue }) => {
            return show && groupCandidates.includes(noteValue)
        })
    })

    return !isAnyNotePresentInOtherCell
}
