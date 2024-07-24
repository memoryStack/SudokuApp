import _get from '@lodash/get'
import _isEmpty from '@lodash/isEmpty'
import _isNil from '@lodash/isNil'

const getCellMainValue = (mainNumbers: MainNumbers, cell = {} as Cell): MainNumberValue =>
    _get(mainNumbers, [cell.row, cell.col, 'value'])

const isCellFilled = (mainNumbers: MainNumbers, cell: Cell) => getCellMainValue(mainNumbers, cell) !== 0

const isCellFilledWithNumber = (mainNumbers: MainNumbers, number: MainNumberValue, cell: Cell) =>
    number === getCellMainValue(mainNumbers, cell)

const getCellSolutionValue = (mainNumbers: MainNumbers, cell = {} as Cell): SolutionValue =>
    _get(mainNumbers, [cell.row, cell.col, 'solutionValue'])

const isCellFilledCorrectly = (mainNumbers: MainNumbers, cell: Cell) => {
    if (_isEmpty(cell)) return false

    const filledValue = getCellMainValue(mainNumbers, cell)
    const solutionValue = getCellSolutionValue(mainNumbers, cell)
    if (solutionValue === 0 || filledValue === 0 || _isNil(solutionValue) || _isNil(filledValue)) return false
    return filledValue === solutionValue
}

const isClueCell = (mainNumbers: MainNumbers, cell = {} as Cell): boolean =>
    _get(mainNumbers, [cell.row, cell.col, 'isClue'])

export const MainNumbersRecord = {
    getCellMainValue,
    getCellSolutionValue,
    isCellFilledCorrectly,
    isCellFilledWithNumber,
    isCellFilled,
    isClueCell,
}
