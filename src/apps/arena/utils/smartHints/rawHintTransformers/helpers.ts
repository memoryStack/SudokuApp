import _map from '@lodash/map'
import _isEmpty from '@lodash/isEmpty'

import { getCellAxesValues } from '../../util'

export const getCellsAxesValuesListText = (cells: Cell[], lastCellConjugation: string) => {
    if (_isEmpty(cells)) return ''

    if (cells.length === 1) return getCellAxesValues(cells[0])

    if (!lastCellConjugation) return getCellsAxesList(cells).join(', ')

    const allCellsExceptLast = cells.slice(0, cells.length - 1)
    const cellsAxesList = getCellsAxesList(allCellsExceptLast)
    return `${cellsAxesList.join(', ')} ${lastCellConjugation} ${getCellAxesValues(cells[cells.length - 1])}`
}

export const getCellsAxesList = (cells: Cell[]) => _map(cells, (cell: Cell) => getCellAxesValues(cell))
