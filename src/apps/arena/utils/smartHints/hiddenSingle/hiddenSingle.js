import { getBlockAndBoxNum, getRowAndCol } from '../../../../../utils/util'
import { HIDDEN_SINGLE_TYPES } from '../constants'
import { isCellEmpty } from '../../util'

const getCellHiddenSingle = (cell, mainNumbers, notesData) => {
    const { row, col } = cell
    let singleType = ''

    const possibleCandiates = []
    notesData[row][col].forEach(({ noteValue, show }) => {
        if (show) possibleCandiates.push(noteValue)
    })

    let singleCandidate = -1

    // TODO: replace below loop with this one
    // possibleCandiates.some((candidate) => {
    // })

    for (let i = 0; i < possibleCandiates.length; i++) {
        const candidate = possibleCandiates[i]
        singleCandidate = candidate

        // first check in block
        let possibleOccurencesInHouse = 0
        const { blockNum } = getBlockAndBoxNum(cell)
        for (let cellNo = 0; cellNo < 9; cellNo++) {
            const { row, col } = getRowAndCol(blockNum, cellNo)
            if (isCellEmpty({ row, col }, mainNumbers) && notesData[row][col][candidate - 1].show)
                possibleOccurencesInHouse++
        }
        if (possibleOccurencesInHouse === 1) {
            singleType = HIDDEN_SINGLE_TYPES.BLOCK
            break
        }

        // check in col (more natural as per my experiance. would like to switch it as well just as a experience)
        possibleOccurencesInHouse = 0
        for (let row = 0; row < 9; row++) {
            if (isCellEmpty({ row, col }, mainNumbers) && notesData[row][col][candidate - 1].show)
                possibleOccurencesInHouse++
        }
        if (possibleOccurencesInHouse === 1) {
            singleType = HIDDEN_SINGLE_TYPES.COL
            break
        }

        // check in row
        possibleOccurencesInHouse = 0
        for (let col = 0; col < 9; col++) {
            if (isCellEmpty({ row, col }, mainNumbers) && notesData[row][col][candidate - 1].show)
                possibleOccurencesInHouse++
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
            const { present, type, mainNumber } = getCellHiddenSingle({ row, col }, mainNumbers, notesData)
            if (present) result.push({ cell: { row, col }, mainNumber, type })
        }
    }
    return result
}
