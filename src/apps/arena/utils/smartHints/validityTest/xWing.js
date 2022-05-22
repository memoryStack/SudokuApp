import { filterHouseCells, getCellHouseInfo, isCellExists } from '../../util'

export const isValidXWing = ({ legs, houseType }, _, possibleNotes) => {
    const candidatePossibleInOtherThanHostCells = legs.some(({ candidate, cells: hostCells }) => {
        return filterHouseCells(getCellHouseInfo(houseType, hostCells[0]), (cell) => {
            return !isCellExists(cell, hostCells)
        }).some(({ row, col }) => {
            return possibleNotes[row][col][candidate - 1].show
        })
    })

    return !candidatePossibleInOtherThanHostCells
}
