import { getBlockAndBoxNum, getRowAndCol } from '../../../../utils/util'
import { duplicacyPresent } from '../util'
import { NAKED_SINGLE_TYPES } from './constants'

const isNakedSinglePresent = (cellNotes) => {
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
        mainNumber: possibleCandidatesCount === 1 ? mainNumber : -1
    }
}

export const getAllNakedSingles = (notesInfo) => {
    const nakedSingles = []
    for (let row=0;row<9;row++) {
        for (let col=0;col<9;col++) {
            const { present: nakedSinglePresent, mainNumber } = isNakedSinglePresent(notesInfo[row][col])
            // TODO: fix the sin added here
            if (nakedSinglePresent)
                nakedSingles.push({ cell: {row, col}, mainNumber, type: NAKED_SINGLE_TYPES.MIX })
        }
    }
    return nakedSingles
}

// merge the naked single type logic here with the above func to calculate the
// naked single type for proper highlighting
const getNakedSingle = (cell, mainNumbers) => {
    const { row, col } = cell
    let singleType = ''
    let candidatesFilled = 0
    for (let col = 0; col < 9; col++) {
        // check for row
        if (mainNumbers[row][col].value) candidatesFilled++
    }
    if (candidatesFilled === 8) {
        singleType = NAKED_SINGLE_TYPES.ROW
    } else {
        candidatesFilled = 0
    }

    if (candidatesFilled === 0) {
        // check for column
        for (let row = 0; row < 9; row++) {
            if (mainNumbers[row][col].value) candidatesFilled++
        }
        if (candidatesFilled === 8) singleType = NAKED_SINGLE_TYPES.COL
        else candidatesFilled = 0
    }

    if (candidatesFilled === 0) {
        // check for block
        const { blockNum } = getBlockAndBoxNum({ row, col })
        for (let boxNum = 0; boxNum < 9; boxNum++) {
            const { row, col } = getRowAndCol(blockNum, boxNum)
            if (mainNumbers[row][col].value) candidatesFilled++
        }
        if (candidatesFilled === 8) singleType = NAKED_SINGLE_TYPES.BLOCK
        else candidatesFilled = 0
    }

    if (candidatesFilled === 0) {
        // check for mix
        for (let num = 1; num <= 9; num++) {
            // TODO: make a map here to make it faster. that way we can find the same
            // thing in 36 iterations instead of 81 iterations
            if (duplicacyPresent(num, mainNumbers, { row, col })) candidatesFilled++
        }
        if (candidatesFilled === 8) singleType = NAKED_SINGLE_TYPES.MIX
        else candidatesFilled = 0
    }

    return {
        present: singleType !== '', // a boolean
        type: singleType, // row, col, block or mix of all the houses
    }
}
