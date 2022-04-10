import { getHouseCells } from '../../houseCells'
import { getCellHouseInfo, isCellExists } from '../../util'

export const isValidHiddenGroup = ({ houseType, groupCandidates, hostCells }, _, possibleNotes) => {
    const { num: houseNum } = getCellHouseInfo(houseType, hostCells[0])
    const houseCells = getHouseCells(houseType, houseNum)
    const cellsWithoutHostCells = houseCells.filter(cell => {
        return !isCellExists(cell, hostCells)
    })

    const isAnyNotePresentInOtherCell = cellsWithoutHostCells.some(cell => {
        const cellNotes = possibleNotes[cell.row][cell.col]
        return cellNotes.some(({ show, noteValue }) => {
            return show && groupCandidates.indexOf(noteValue) !== -1
        })
    })

    return !isAnyNotePresentInOtherCell
}
