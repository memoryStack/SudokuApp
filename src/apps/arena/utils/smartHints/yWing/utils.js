import { getHouseCells } from '../../houseCells'
import { getCellHousesInfo, convertBoardCellNumToCell, convertBoardCellToNum, isCellNoteVisible } from '../../util'

const getHousesCellsNum = cell => {
    const result = {}
    getCellHousesInfo(cell).forEach(house => {
        getHouseCells(house).forEach(cell => {
            const cellNum = convertBoardCellToNum(cell)
            result[cellNum] = true
        })
    })
    return result
}

const getWingsCommonCells = (wingCellA, wingCellB) => {
    const wingACells = getHousesCellsNum(wingCellA)
    const wingBCells = getHousesCellsNum(wingCellB)

    const commonCellsInAllHouses = []

    for (const cellNum in wingACells) {
        if (wingBCells[cellNum]) commonCellsInAllHouses.push(cellNum)
    }

    return commonCellsInAllHouses.map(cellNum => {
        return convertBoardCellNumToCell(parseInt(cellNum, 10))
    })
}

export const getEliminatableNotesCells = (yWing, notesData) => {
    const { wings } = yWing
    const wingCells = wings.map(wing => wing.cell)

    const commonNoteInWings = yWing.wingsCommonNote
    const wingsCommonSeenCells = getWingsCommonCells(...wingCells)

    return wingsCommonSeenCells.filter(cell => {
        return isCellNoteVisible(commonNoteInWings, notesData[cell.row][cell.col])
    })
}
