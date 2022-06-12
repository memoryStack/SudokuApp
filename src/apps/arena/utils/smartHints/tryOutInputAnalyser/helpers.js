import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getMainNumbers } from '../../../store/selectors/board.selectors'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'
import { isCellEmpty, getCellVisibleNotesCount, isCellNoteVisible, getCellVisibleNotes } from '../../util'
import { HINT_TEXT_CANDIDATES_JOIN_CONJUGATION } from '../constants'
import { getCandidatesListText } from '../util'
import { TRY_OUT_ERROR_TYPES, TRY_OUT_RESULT_STATES, TRY_OUT_ERROR_TYPES_VS_ERROR_MSG } from './constants'

export const noInputInTryOut = focusedCells => {
    const actualMainNumbers = getMainNumbers(getStoreState())
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())

    const result = []
    focusedCells.forEach(cell => {
        const isCellFilledInTryOut = isCellEmpty(cell, actualMainNumbers) && !isCellEmpty(cell, tryOutMainNumbers)
        if (isCellFilledInTryOut) {
            result.push({
                cell,
                number: tryOutMainNumbers[cell.row][cell.col].value,
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

const cellWithNoCandidates = focusedCells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const tryOutNotesInfo = getTryOutNotes(getStoreState())
    return focusedCells.some(cell => {
        return (
            isCellEmpty(cell, tryOutMainNumbers) && getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 0
        )
    })
}

const multipleNakedSinglesBySomeCandidate = (groupCandidates, focusedCells) => {
    const tryOutNotesInfo = getTryOutNotes(getStoreState())

    const candidatesNakedSingleInMultipleCells = groupCandidates.filter(candidate => {
        const candidateNakedSingleHostCells = focusedCells.filter(cell => {
            return (
                isCellNoteVisible(candidate, tryOutNotesInfo[cell.row][cell.col]) &&
                getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 1
            )
        })
        return candidateNakedSingleHostCells.length > 1
    })

    return !!candidatesNakedSingleInMultipleCells.length
}

export const getNakedGroupNoTryOutInputResult = (groupCandidates) => {
    const candidatesListText = getCandidatesListText(groupCandidates, HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.OR)
    return {
        msg:
            `try filling ${candidatesListText} in the cells where` +
            ` it is highlighted in red or green color to see why this hint works`,
        state: TRY_OUT_RESULT_STATES.START,
    }
}

export const getTryOutErrorResult = errorType => {
    return {
        msg: TRY_OUT_ERROR_TYPES_VS_ERROR_MSG[errorType],
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

export const getCorrectFilledTryOutCandidates = (groupCells, tryOutMainNumbers) => {
    const result = []
    groupCells.forEach(cell => {
        if (!isCellEmpty(cell, tryOutMainNumbers)) {
            result.push(tryOutMainNumbers[cell.row][cell.col].value)
        }
    })
    return result
}

export const getCandidatesToBeFilled = (correctlyFilledGroupCandidates, groupCandidates) => {
    return groupCandidates
        .map(candidate => {
            return parseInt(candidate, 10)
        })
        .filter(groupCandidate => {
            return !correctlyFilledGroupCandidates.includes(groupCandidate)
        })
}

/* below some funcs will work on CellWithNotes DS specially for try-out ananlysers */
// TODO: should i handle it using the class based implementation ??
export const getNakedSingleCellsWithNoteInAscOrder = (cells, boardNotes) => {
    return cells.map((cell) => {
        return {
            note: getCellVisibleNotes(boardNotes[cell.row][cell.col])[0],
            cell,
        }
    }).sort(({ note: noteA }, { note: noteB }) => {
        return noteA - noteB
    })
}

export const getNotesListTextFromCellsWithNotes = (cellsWithNotes, lastNoteConjugation) => {
    const notes = getNotesFromCellsWithNotes(cellsWithNotes)
    return getCandidatesListText(notes, lastNoteConjugation)
}

export const getNotesFromCellsWithNotes = (cellsWithNotes) => {
    return cellsWithNotes.map(({ note }) => note)
}

