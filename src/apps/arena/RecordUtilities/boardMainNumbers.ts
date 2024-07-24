import _get from '@lodash/get'
import _isEmpty from '@lodash/isEmpty'
import _isNil from '@lodash/isNil'

import { CELLS_IN_A_HOUSE, HOUSES_COUNT_OF_A_TYPE } from '@domain/board/board.constants'

const getCellMainValue = (mainNumbers: MainNumbers, cell = {} as Cell): MainNumberValue => _get(mainNumbers, [cell.row, cell.col, 'value'])

const isCellFilled = (mainNumbers: MainNumbers, cell: Cell) => getCellMainValue(mainNumbers, cell) !== 0

const isCellFilledWithNumber = (mainNumbers: MainNumbers, number: MainNumberValue, cell: Cell) => number === getCellMainValue(mainNumbers, cell)

const getCellSolutionValue = (mainNumbers: MainNumbers, cell = {} as Cell): SolutionValue => _get(mainNumbers, [cell.row, cell.col, 'solutionValue'])

const isCellFilledCorrectly = (mainNumbers: MainNumbers, cell: Cell) => {
    if (_isEmpty(cell)) return false

    const filledValue = getCellMainValue(mainNumbers, cell)
    const solutionValue = getCellSolutionValue(mainNumbers, cell)
    if (solutionValue === 0 || filledValue === 0 || _isNil(solutionValue) || _isNil(filledValue)) return false
    return filledValue === solutionValue
}

const isClueCell = (mainNumbers: MainNumbers, cell = {} as Cell): boolean => _get(mainNumbers, [cell.row, cell.col, 'isClue'])

const initMainNumbers = () => {
    const result = []
    for (let i = 0; i < HOUSES_COUNT_OF_A_TYPE; i++) {
        const rowData = []
        for (let j = 0; j < CELLS_IN_A_HOUSE; j++) {
            rowData.push(getCellMainNumberDefaultValue())
        }
        result.push(rowData)
    }
    return result
}

const getCellMainNumberDefaultValue = (): MainNumber => ({ value: 0, solutionValue: 0, isClue: false })

export const MainNumbersRecord = {
    getCellMainValue,
    getCellSolutionValue,
    isCellFilledCorrectly,
    isCellFilledWithNumber,
    isCellFilled,
    isClueCell,
    initMainNumbers,
}
