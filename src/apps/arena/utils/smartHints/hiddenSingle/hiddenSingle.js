import { getBlockAndBoxNum, getRowAndCol } from '../../../../../utils/util'
import { HIDDEN_SINGLE_TYPES } from '../constants'
import { isCellEmpty } from '../../util'

const isCandidateSolutionForBlockCell = (candidate, cell, mainNumbers, notesData) => {
    let possibleHostCellsCount = 0
    const { blockNum } = getBlockAndBoxNum(cell)
    for (let cellNo = 0; cellNo < 9; cellNo++) {
        const { row, col } = getRowAndCol(blockNum, cellNo)
        if (isCellEmpty({ row, col }, mainNumbers) && notesData[row][col][candidate - 1].show) possibleHostCellsCount++
    }
    return possibleHostCellsCount === 1
}

const isCandidateSolutionForColCell = (candidate, cell, mainNumbers, notesData) => {
    let possibleHostCellsCount = 0
    for (let row = 0; row < 9; row++) {
        if (isCellEmpty({ row, col: cell.col }, mainNumbers) && notesData[row][cell.col][candidate - 1].show)
            possibleHostCellsCount++
    }
    return possibleHostCellsCount === 1
}

const isCandidateSolutionForRowCell = (candidate, cell, mainNumbers, notesData) => {
    let possibleHostCellsCount = 0
    for (let col = 0; col < 9; col++) {
        if (isCellEmpty({ row: cell.row, col }, mainNumbers) && notesData[cell.row][col][candidate - 1].show)
            possibleHostCellsCount++
    }
    return possibleHostCellsCount === 1
}

const getCellHiddenSingle = (cell, mainNumbers, notesData) => {
    const { row, col } = cell
    let singleType = ''

    const possibleCandiates = []
    notesData[row][col].forEach(({ noteValue, show }) => {
        if (show) possibleCandiates.push(noteValue)
    })

    let singleCandidate = -1
    possibleCandiates.some(candidate => {
        singleCandidate = candidate
        if (isCandidateSolutionForBlockCell(candidate, cell, mainNumbers, notesData)) {
            singleType = HIDDEN_SINGLE_TYPES.BLOCK
            return true
        }
        // check in col (more natural as per my experiance. would like to switch it as well just as a experience)
        if (isCandidateSolutionForColCell(candidate, cell, mainNumbers, notesData)) {
            singleType = HIDDEN_SINGLE_TYPES.COL
            return true
        }
        if (isCandidateSolutionForRowCell(candidate, cell, mainNumbers, notesData)) {
            singleType = HIDDEN_SINGLE_TYPES.ROW
            return true
        }
        return false
    })

    return {
        present: singleType !== '',
        type: singleType,
        mainNumber: singleCandidate,
    }
}

export const getAllHiddenSingles = (mainNumbers, notesData) => {
    const result = []
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (mainNumbers[row][col].value) continue
            const { present, type, mainNumber } = getCellHiddenSingle({ row, col }, mainNumbers, notesData)
            if (present) result.push({ cell: { row, col }, mainNumber, type })
        }
    }
    return result
}
