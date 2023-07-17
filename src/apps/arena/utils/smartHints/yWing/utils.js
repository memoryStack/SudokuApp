import _filter from '@lodash/filter'

import { getHouseCells } from '../../houseCells'
import {
    getCellHousesInfo, convertBoardCellNumToCell, convertBoardCellToNum, isCellNoteVisible,
} from '../../util'

const getHousesCellsNum = cell => {
    const result = {}
    getCellHousesInfo(cell).forEach(house => {
        getHouseCells(house).forEach(houseCell => {
            const cellNum = convertBoardCellToNum(houseCell)
            result[cellNum] = true
        })
    })
    return result
}

const getWingsCommonCells = (wingCellA, wingCellB) => {
    const wingACells = getHousesCellsNum(wingCellA)
    const wingBCells = getHousesCellsNum(wingCellB)
    const commonCellsInAllHouses = _filter(Object.keys(wingACells), windACellNum => !!wingBCells[windACellNum])
    return commonCellsInAllHouses.map(cellNum => convertBoardCellNumToCell(parseInt(cellNum, 10)))
}

export const getEliminatableNotesCells = (yWing, notesData) => {
    const { wings } = yWing
    const wingCells = wings.map(wing => wing.cell)

    const commonNoteInWings = yWing.wingsCommonNote
    const wingsCommonSeenCells = getWingsCommonCells(...wingCells)

    return wingsCommonSeenCells.filter(cell => isCellNoteVisible(commonNoteInWings, notesData[cell.row][cell.col]))
}
