import { filterHouseCells, getCellHouseForHouseType, isCellExists } from '../../util'

export const isValidXWing = ({ legs, houseType }, possibleNotes) => {
    const candidatePossibleInOtherThanHostCells = legs.some(({ candidate, cells: hostCells }) => filterHouseCells(getCellHouseForHouseType(houseType, hostCells[0]), cell => !isCellExists(cell, hostCells)).some(({ row, col }) => possibleNotes[row][col][candidate - 1].show))

    return !candidatePossibleInOtherThanHostCells
}
