import { getBlockAndBoxNum, getRowAndCol } from '../../../../utils/util'
import { duplicacyPresent } from '../util'
import { HIDDEN_SINGLE_TYPES } from './constants'

const getCurrentCellNotes = (mainNumbers, cell) => {
    const { row, col } = cell
    const possibleCandiates = []
    const numbersAlreadyInHouses = {}
    for (let row = 0; row < 9; row++) {
        const filledValue = mainNumbers[row][col].value
        if (filledValue) numbersAlreadyInHouses[filledValue] = true
    }
    for (let col = 0; col < 9; col++) {
        const filledValue = mainNumbers[row][col].value
        if (filledValue) numbersAlreadyInHouses[filledValue] = true
    }
    const { blockNum } = getBlockAndBoxNum(cell)
    for (let cellNo = 0; cellNo < 9; cellNo++) {
        const { row, col } = getRowAndCol(blockNum, cellNo)
        const filledValue = mainNumbers[row][col].value
        if (filledValue) numbersAlreadyInHouses[filledValue] = true
    }
    for (let num = 1; num <= 9; num++) {
        if (!numbersAlreadyInHouses[num]) possibleCandiates.push(num)
    }
    return possibleCandiates
}

export const getHiddenSingle = (cell, mainNumbers) => {
    const { row, col } = cell
    const possibleCandiates = getCurrentCellNotes(mainNumbers, cell)
    let singleType = ''

    for (let i = 0; i < possibleCandiates.length; i++) {
        const candidate = possibleCandiates[i]
        // first check in block
        let possibleOccurencesInHouse = 0
        const { blockNum } = getBlockAndBoxNum(cell)
        for (let cellNo = 0; cellNo < 9; cellNo++) {
            const { row, col } = getRowAndCol(blockNum, cellNo)
            const isEmptyCell = mainNumbers[row][col].value === 0
            if (isEmptyCell && !duplicacyPresent(candidate, mainNumbers, { row, col })) {
                possibleOccurencesInHouse++
            }
        }
        if (possibleOccurencesInHouse === 1) {
            singleType = HIDDEN_SINGLE_TYPES.BLOCK
            break
        }

        // check in col (more natural as per my experiance. would like to switch it as well just as a experience)
        possibleOccurencesInHouse = 0
        for (let row = 0; row < 9; row++) {
            const isEmptyCell = mainNumbers[row][col].value === 0
            if (isEmptyCell && !duplicacyPresent(candidate, mainNumbers, { row, col })) {
                possibleOccurencesInHouse++
            }
        }
        if (possibleOccurencesInHouse === 1) {
            singleType = HIDDEN_SINGLE_TYPES.COL
            break
        }

        // check in row
        possibleOccurencesInHouse = 0
        for (let col = 0; col < 9; col++) {
            const isEmptyCell = mainNumbers[row][col].value === 0
            if (isEmptyCell && !duplicacyPresent(candidate, mainNumbers, { row, col })) {
                possibleOccurencesInHouse++
            }
        }
        if (possibleOccurencesInHouse === 1) {
            singleType = HIDDEN_SINGLE_TYPES.ROW
            break
        }
    }

    return {
        present: singleType !== '',
        type: singleType,
    }
}
