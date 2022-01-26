import { getBlockAndBoxNum, getRowAndCol } from '../../../../../utils/util'
import { duplicacyPresent } from '../../util'
import { HIDDEN_SINGLE_TYPES } from '../constants'

// TODO: refactor the below func
const getHiddenSingle = (cell, mainNumbers, cellNotes) => {
    const { row, col } = cell
    let singleType = ''

    const possibleCandiates = []
    cellNotes.forEach(({ noteValue, show }) => {
        if (show) possibleCandiates.push(noteValue)
    })

    let singleCandidate = -1
    for (let i = 0; i < possibleCandiates.length; i++) {
        const candidate = possibleCandiates[i]
        singleCandidate = candidate
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
        mainNumber: singleCandidate,
    }
}

export const getAllHiddenSingles = (mainNumbers, notesData) => {
    const result = []
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (mainNumbers[row][col].value) continue
            const { present, type, mainNumber } = getHiddenSingle({ row, col }, mainNumbers, notesData[row][col])
            if (present) result.push({ cell: { row, col }, mainNumber, type })
        }
    }
    return result
}
