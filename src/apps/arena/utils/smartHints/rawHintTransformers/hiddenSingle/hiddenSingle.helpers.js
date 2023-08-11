import _find from '@lodash/find'

import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'
import { BLOCKS_COUNT_IN_ROW, GRID_TRAVERSALS, HOUSES_COUNT } from '../../../../constants'
import { getHouseCells } from '../../../houseCells'
import { getCellHouseForHouseType, getHousesCommonCells } from '../../../util'
import { HIDDEN_SINGLE_TYPES, HOUSE_TYPE } from '../../constants'
import { transformCellBGColor } from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'

export const getHostHouse = (hostCell, singleType) => {
    if (singleType === HIDDEN_SINGLE_TYPES.ROW) return getCellHouseForHouseType(HOUSE_TYPE.ROW, hostCell)
    if (singleType === HIDDEN_SINGLE_TYPES.COL) return getCellHouseForHouseType(HOUSE_TYPE.COL, hostCell)
    return getCellHouseForHouseType(HOUSE_TYPE.BLOCK, hostCell)
}

export const getInhabitableCellData = smartHintsColorSystem => ({
    bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)),
    inhabitable: true,
})

export const getNextNeighbourBlock = (currentBlockNumIdx, direction) => {
    if (direction === GRID_TRAVERSALS.ROW) return getNextBlockInRow(currentBlockNumIdx)
    if (direction === GRID_TRAVERSALS.COL) return getNextBlockInCol(currentBlockNumIdx)
    return -1
}

const getNextBlockInRow = currentBlockNumIdx => {
    let result = currentBlockNumIdx + 1
    if (result % BLOCKS_COUNT_IN_ROW === 0) result -= BLOCKS_COUNT_IN_ROW
    return result
}

const getNextBlockInCol = currentBlockNumIdx => (currentBlockNumIdx + BLOCKS_COUNT_IN_ROW) % HOUSES_COUNT

export const getNextBlockSearchDirection = hiddenSingleType => (hiddenSingleType === HIDDEN_SINGLE_TYPES.ROW ? GRID_TRAVERSALS.ROW : GRID_TRAVERSALS.COL)

// TODO: write test cases for it
export const getCellFilledWithNumberInHouse = (number, house, mainNumbers) => _find(getHouseCells(house), cell => MainNumbersRecord.isCellFilledWithNumber(mainNumbers, number, cell))

export const shouldHighlightWinnerCandidateInstanceInBlock = (hostHouse, blockHouse, mainNumbers) => getHousesCommonCells(blockHouse, hostHouse)
    .some(cell => !MainNumbersRecord.isCellFilled(mainNumbers, cell))
