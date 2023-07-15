import { getCellAxesValues } from '../../util'

export const getCellsAxesValuesListText = (cells, lastCellConjugation) => {
    if (cells.length === 1) return getCellAxesValues(cells[0])

    if (!lastCellConjugation) {
        return getCellsAxesList(cells).join(', ')
    }

    const allCellsExceptLast = cells.slice(0, cells.length - 1)
    const cellsAxesList = getCellsAxesList(allCellsExceptLast)
    return `${cellsAxesList.join(', ')} ${lastCellConjugation} ${getCellAxesValues(cells[cells.length - 1])}`
}

export const getCellsAxesList = cells => cells.map(cell => getCellAxesValues(cell))
