import _get from '@lodash/get'
import _isNil from '@lodash/isNil'

import { CELLS_IN_HOUSE, HOUSES_COUNT } from '../constants'

const getCellMainValue = (mainNumbers, cell = {}) => _get(mainNumbers, [cell.row, cell.col, 'value'])

const isCellFilled = (mainNumbers, cell = {}) => getCellMainValue(mainNumbers, cell) !== 0

const isCellFilledWithNumber = (mainNumbers, number, cell = {}) => number === getCellMainValue(mainNumbers, cell)

const getCellSolutionValue = (mainNumbers, cell = {}) => _get(mainNumbers, [cell.row, cell.col, 'solutionValue'])

const isCellFilledCorrectly = (mainNumbers, cell = {}) => {
    const filledValue = getCellMainValue(mainNumbers, cell)
    const solutionValue = getCellSolutionValue(mainNumbers, cell)
    if (solutionValue === 0 || filledValue === 0 || _isNil(solutionValue) || _isNil(filledValue)) return false
    return filledValue === solutionValue
}

const isClueCell = (mainNumbers, cell = {}) => _get(mainNumbers, [cell.row, cell.col, 'isClue'])

const initMainNumbers = () => {
    const result = []
    for (let i = 0; i < HOUSES_COUNT; i++) {
        const rowData = []
        for (let j = 0; j < CELLS_IN_HOUSE; j++) {
            rowData.push(getCellMainNumberDefaultValue())
        }
        result.push(rowData)
    }
    return result
}

const getCellMainNumberDefaultValue = () => ({ value: 0, solutionValue: 0, isClue: false })

export const MainNumbersRecord = {
    getCellMainValue,
    getCellSolutionValue,
    isCellFilledCorrectly,
    isCellFilledWithNumber,
    isCellFilled,
    isClueCell,
    initMainNumbers,
}
