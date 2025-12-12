import { toOrdinal } from '@lodash/toOrdinal'
import _map from '@lodash/map'
import _isEmpty from '@lodash/isEmpty'

import { isRowHouse } from '@domain/board/utils/housesAndCells'

import { BoardAxesValues, getCellAxesValues, getHouseAxesValue } from '../../util'

import { HOUSE_TYPE_VS_FULL_NAMES } from '../constants'

export const getCellsAxesValuesListText = (
    cells: Cell[], lastCellConjugation: string = '', boardAxesValues?: BoardAxesValues
) => {
    if (_isEmpty(cells)) return ''

    if (cells.length === 1) return getCellAxesValues(cells[0], boardAxesValues)

    if (!lastCellConjugation) return getCellsAxesList(cells, boardAxesValues).join(', ')

    const allCellsExceptLast = cells.slice(0, cells.length - 1)
    const cellsAxesList = getCellsAxesList(allCellsExceptLast, boardAxesValues)
    return `${cellsAxesList.join(', ')} ${lastCellConjugation} ${getCellAxesValues(cells[cells.length - 1], boardAxesValues)}`
}

export const getCellsAxesList = (cells: Cell[], boardAxesValues?: BoardAxesValues) =>
    _map(cells, (cell: Cell) => getCellAxesValues(cell, boardAxesValues))

export const getHouseNumText = (house: House) => {
    if (!isRowHouse(house.type)) return toOrdinal(house.num + 1)
    return getHouseAxesValue(house)
}

export const getHouseNumAndName = (house: House) => `${getHouseNumText(house)} ${HOUSE_TYPE_VS_FULL_NAMES[house.type].FULL_NAME}`

// TODO: make it work for blocks as well
export const getHouseOrdinalNum = (house: House) => {
    return isRowHouse(house.type) ? `${getHouseAxesValue(house)}th` : getHouseNumText(house)
}

// TODO: make it work for blocks as well
export const getHouseOrdinalNumAndName = (house: House) => {
    const houseNumText = isRowHouse(house.type) ? `${getHouseAxesValue(house)}th` : getHouseNumText(house)
    return `${houseNumText} ${HOUSE_TYPE_VS_FULL_NAMES[house.type].FULL_NAME}`
}

export const joinStringsListWithArrow = (list: string[]): string => list.join(` ${String.fromCodePoint(0x279d)} `)
