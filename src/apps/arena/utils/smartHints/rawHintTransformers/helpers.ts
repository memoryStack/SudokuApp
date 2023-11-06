import { toOrdinal } from '@lodash/toOrdinal'
import _map from '@lodash/map'
import _isEmpty from '@lodash/isEmpty'

import { getCellAxesValues, getHouseAxesValue } from '../../util'
import { Houses } from '../../classes/houses'

import { HOUSE_TYPE_VS_FULL_NAMES } from '../constants'

export const getCellsAxesValuesListText = (cells: Cell[], lastCellConjugation: string = '') => {
    if (_isEmpty(cells)) return ''

    if (cells.length === 1) return getCellAxesValues(cells[0])

    if (!lastCellConjugation) return getCellsAxesList(cells).join(', ')

    const allCellsExceptLast = cells.slice(0, cells.length - 1)
    const cellsAxesList = getCellsAxesList(allCellsExceptLast)
    return `${cellsAxesList.join(', ')} ${lastCellConjugation} ${getCellAxesValues(cells[cells.length - 1])}`
}

export const getCellsAxesList = (cells: Cell[]) => _map(cells, (cell: Cell) => getCellAxesValues(cell))

export const getHouseNumText = (house: House) => {
    if (!Houses.isRowHouse(house.type)) return toOrdinal(house.num + 1)
    return getHouseAxesValue(house)
}

export const getHouseNumAndName = (house: House) => `${getHouseNumText(house)} ${HOUSE_TYPE_VS_FULL_NAMES[house.type].FULL_NAME}`
