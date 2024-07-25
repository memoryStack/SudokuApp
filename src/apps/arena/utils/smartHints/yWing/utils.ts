import _filter from '@lodash/filter'
import { NotesRecord } from '@domain/board/records/notesRecord'
import { convertBoardCellToNum, convertBoardCellNumToCell } from '@domain/board/utils/cellsTransformers'

import { getHouseCells } from '@domain/board/utils/housesAndCells'
import { getCellHousesInfo } from '../../util'
import { YWingRawHint } from './types'

// TODO: improve naming for "getHousesCellsNum" and "getWingsCommonCells"
const getHousesCellsNum = (cell: Cell) => {
    const result: { [cellNum: number | string]: boolean } = {}
    getCellHousesInfo(cell).forEach(house => {
        getHouseCells(house).forEach(houseCell => {
            const cellNum = convertBoardCellToNum(houseCell)
            result[cellNum] = true
        })
    })
    return result
}

const getWingsCommonCells = (wingCellA: Cell, wingCellB: Cell): Cell[] => {
    const wingACells = getHousesCellsNum(wingCellA)
    const wingBCells = getHousesCellsNum(wingCellB)
    const commonCellsInAllHouses = _filter(Object.keys(wingACells), (wingACellNum: string) => !!wingBCells[wingACellNum])
    return commonCellsInAllHouses.map((cellNum: string) => convertBoardCellNumToCell(parseInt(cellNum, 10)))
}

export const getEliminatableNotesCells = (yWing: YWingRawHint, notesData: Notes) => {
    const { wings } = yWing
    const wingCells = wings.map(wing => wing.cell) as [Cell, Cell]

    const commonNoteInWings = yWing.wingsCommonNote
    const wingsCommonSeenCells = getWingsCommonCells(...wingCells)

    return wingsCommonSeenCells.filter(cell => NotesRecord.isNotePresentInCell(notesData, commonNoteInWings, cell))
}
