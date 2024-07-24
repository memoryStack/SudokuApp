import _find from '@lodash/find'

import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'
import { BLOCKS_COUNT_IN_ROW, GRID_TRAVERSALS, HOUSES_COUNT } from '../../../../constants'
import { getHouseCells } from '@domain/board/utils/housesAndCells'
import { getCellHouseForHouseType, getHousesCommonCells } from '../../../util'
import { HIDDEN_SINGLE_TYPES, HOUSE_TYPE } from '../../constants'
import { transformCellBGColor } from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { SmartHintsColorSystem } from '../../types'

export const getHostHouse = (hostCell: Cell, singleType: HIDDEN_SINGLE_TYPES) => {
    if (singleType === HIDDEN_SINGLE_TYPES.ROW) return getCellHouseForHouseType(HOUSE_TYPE.ROW, hostCell)
    if (singleType === HIDDEN_SINGLE_TYPES.COL) return getCellHouseForHouseType(HOUSE_TYPE.COL, hostCell)
    return getCellHouseForHouseType(HOUSE_TYPE.BLOCK, hostCell)
}

export const getInhabitableCellData = (smartHintsColorSystem: SmartHintsColorSystem) => ({
    inhabitable: true,
    bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)),
    crossIconColor: smartHintColorSystemReader.inhabitableCellCrossColor(smartHintsColorSystem),
})

export const getNextNeighbourBlock = (currentBlockNumIdx: number, direction: GRID_TRAVERSALS) => {
    if (direction === GRID_TRAVERSALS.ROW) return getNextBlockInRow(currentBlockNumIdx)
    if (direction === GRID_TRAVERSALS.COL) return getNextBlockInCol(currentBlockNumIdx)
    return -1
}

const getNextBlockInRow = (currentBlockNumIdx: number) => {
    let result = currentBlockNumIdx + 1
    if (result % BLOCKS_COUNT_IN_ROW === 0) result -= BLOCKS_COUNT_IN_ROW
    return result
}

const getNextBlockInCol = (currentBlockNumIdx: number) => (currentBlockNumIdx + BLOCKS_COUNT_IN_ROW) % HOUSES_COUNT

export const getNextBlockSearchDirection = (hiddenSingleType: HIDDEN_SINGLE_TYPES) => (hiddenSingleType === HIDDEN_SINGLE_TYPES.ROW ? GRID_TRAVERSALS.ROW : GRID_TRAVERSALS.COL)

// TODO: write test cases for it
export const getCellFilledWithNumberInHouse = (number: MainNumberValue, house: House, mainNumbers: MainNumbers) => {
    const houseCells = getHouseCells(house)
    return _find(houseCells, (cell: Cell) => MainNumbersRecord.isCellFilledWithNumber(mainNumbers, number, cell))
}

export const shouldHighlightWinnerCandidateInstanceInBlock = (hostHouse: House, blockHouse: House, mainNumbers: MainNumbers) => getHousesCommonCells(blockHouse, hostHouse)
    .some(cell => !MainNumbersRecord.isCellFilled(mainNumbers, cell))
