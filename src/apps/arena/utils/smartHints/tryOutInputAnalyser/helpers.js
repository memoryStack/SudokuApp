import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getMainNumbers } from '../../../store/selectors/board.selectors'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'
import { isCellEmpty, getCellVisibleNotesCount, isCellNoteVisible } from '../../util'
import { TRY_OUT_ERROR_TYPES } from './constants'

export const noInputInTryOut = (focusedCells) => {
    const actualMainNumbers = getMainNumbers(getStoreState())
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())

    const result = []
    focusedCells.forEach((cell) => {
        const isCellFilledInTryOut = isCellEmpty(cell, actualMainNumbers) && !isCellEmpty(cell, tryOutMainNumbers)
        if (isCellFilledInTryOut) {
            result.push({
                cell,
                number: tryOutMainNumbers[cell.row][cell.col].value
            })
        }
    })

    return result.length === 0
}

export const getTryOutErrorType = (groupCandidates, focusedCells) => {
    if (cellWithNoCandidates(focusedCells)) {
        return TRY_OUT_ERROR_TYPES.EMPTY_CELL_IN_SOLUTION
    }

    if (multipleNakedSinglesBySomeCandidate(groupCandidates, focusedCells)) {
        return TRY_OUT_ERROR_TYPES.MULTIPLE_CELLS_NAKED_SINGLE
    }

    return ''
}

const cellWithNoCandidates = (focusedCells) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const tryOutNotesInfo = getTryOutNotes(getStoreState())
    return focusedCells.some((cell) => {
        return isCellEmpty(cell, tryOutMainNumbers) && (getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 0)
    })
}

const multipleNakedSinglesBySomeCandidate = (groupCandidates, focusedCells) => {
    const tryOutNotesInfo = getTryOutNotes(getStoreState())

    const candidatesNakedSingleInMultipleCells = groupCandidates.filter((candidate) => {
        const candidateNakedSingleHostCells = focusedCells.filter((cell) => {
            return isCellNoteVisible(candidate, tryOutNotesInfo[cell.row][cell.col])
                && (getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 1)
        })
        return candidateNakedSingleHostCells.length > 1
    })

    return !!(candidatesNakedSingleInMultipleCells.length)
}
