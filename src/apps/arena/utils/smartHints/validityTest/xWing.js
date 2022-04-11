import { getHouseCells } from '../../houseCells'
import { getCellHouseInfo, isCellExists } from '../../util'

export const isValidXWing = ({ cells, candidate, type: houseType }, _, possibleNotes) => {
    const candidatePossibleInInvalidCellInAnyHouse = cells.some(houseXWingCells => {
        const { num: houseNum } = getCellHouseInfo(houseType, houseXWingCells[0])
        const houseCells = getHouseCells(houseType, houseNum)
        const cellsWithoutXWingCells = houseCells.filter(cell => {
            return !isCellExists(cell, houseXWingCells)
        })
        return cellsWithoutXWingCells.some(({ row, col }) => {
            return possibleNotes[row][col][candidate - 1].show
        })
    })

    return !candidatePossibleInInvalidCellInAnyHouse
}
