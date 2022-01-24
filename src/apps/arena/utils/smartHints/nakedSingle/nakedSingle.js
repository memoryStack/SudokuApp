import { getBlockAndBoxNum, getRowAndCol } from '../../../../../utils/util'
import { NAKED_SINGLE_TYPES } from '../constants'

const isNakedSinglePresent = cellNotes => {
    let possibleCandidatesCount = 0
    let mainNumber = -1
    cellNotes.forEach(({ show, noteValue }) => {
        if (show) {
            possibleCandidatesCount++
            mainNumber = noteValue
        }
    })

    return {
        present: possibleCandidatesCount === 1,
        mainNumber: possibleCandidatesCount === 1 ? mainNumber : -1,
    }
}

export const getAllNakedSingles = (mainNumbers, notesInfo) => {
    const nakedSingles = []
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (mainNumbers[row][col].value) continue
            // TODO: change "mainNumber" field name. it doesn't feel right.
            const { present: nakedSinglePresent, mainNumber } = isNakedSinglePresent(notesInfo[row][col])
            if (nakedSinglePresent)
                nakedSingles.push({ cell: { row, col }, mainNumber, type: getSingleType({ row, col }, mainNumbers) })
        }
    }
    return nakedSingles
}

const getSingleType = ({ row, col }, mainNumbers) => {
    let candidatesFilled = 0
    for (let col = 0; col < 9; col++) {
        if (mainNumbers[row][col].value) candidatesFilled++
    }
    if (candidatesFilled === 8) return NAKED_SINGLE_TYPES.ROW

    candidatesFilled = 0
    for (let row = 0; row < 9; row++) {
        if (mainNumbers[row][col].value) candidatesFilled++
    }
    if (candidatesFilled === 8) return NAKED_SINGLE_TYPES.COL

    candidatesFilled = 0
    const { blockNum } = getBlockAndBoxNum({ row, col })
    for (let boxNum = 0; boxNum < 9; boxNum++) {
        const { row, col } = getRowAndCol(blockNum, boxNum)
        if (mainNumbers[row][col].value) candidatesFilled++
    }
    if (candidatesFilled === 8) return NAKED_SINGLE_TYPES.BLOCK
    return NAKED_SINGLE_TYPES.MIX
}
