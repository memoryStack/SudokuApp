import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getMainNumbers } from '../../../store/selectors/board.selectors'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'
import {
    isCellEmpty,
    getCellVisibleNotesCount,
    isCellNoteVisible,
    getCellVisibleNotes,
    getCellAxesValues,
} from '../../util'
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

// this will be removed in future most likely
// but let's not remove it right away
export const getTryOutErrorType = (groupCandidates, focusedCells) => {
    const cellsWithNoCandidates = getCellsWithNoCandidates(focusedCells)
    if (cellsWithNoCandidates) {
        return TRY_OUT_ERROR_TYPES.EMPTY_CELL_IN_SOLUTION
    }

    if (getMultipleCellsNakedSinglesCandidates(groupCandidates, focusedCells).length) {
        return TRY_OUT_ERROR_TYPES.MULTIPLE_CELLS_NAKED_SINGLE
    }

    return ''
}

export const getNakedGroupTryOutInputErrorResult = (groupCandidates, focusedCells) => {
    const cellsWithNoCandidates = getCellsWithNoCandidates(focusedCells)
    if (cellsWithNoCandidates.length) {
        return getEmptyCellsErrorResult(cellsWithNoCandidates)
    }

    const multipleCellsNakedSingleCandidates = getMultipleCellsNakedSinglesCandidates(groupCandidates, focusedCells)
    if (multipleCellsNakedSingleCandidates.length) {
        return getMultipleCellsNakedSinglesErrorResult(multipleCellsNakedSingleCandidates, focusedCells)
    }

    return null
}

const getEmptyCellsErrorResult = cellsWithNoCandidates => {
    const emptyCellsListText = getCellsAxesValuesListText(
        cellsWithNoCandidates,
        HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.AND,
    )
    return {
        msg:
            `${emptyCellsListText} have no candidate left. in the final` +
            ` solution no cell can be empty so, the current arrangement of numbers is invalid`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getMultipleCellsNakedSinglesErrorResult = (multipleCellsNakedSingleCandidates, focusedCells) => {
    const firstCandidate = multipleCellsNakedSingleCandidates[0]
    const firstCandidateHostCells = getCandidateNakedSingleHostCells(firstCandidate, focusedCells)
    const emptyCellsListText = getCellsAxesValuesListText(
        firstCandidateHostCells,
        HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.AND,
    )
    const pluralRestOfCells = firstCandidateHostCells.length > 2

    return {
        msg:
            `${firstCandidate} is Naked Single for ${emptyCellsListText}. if we try to fill it in one of these cells` +
            ` then other cell${pluralRestOfCells ? 's' : ''} will have to be empty.` +
            ` so the current arrangement of numbers is wrong`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

export const getCellsWithNoCandidates = focusedCells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const tryOutNotesInfo = getTryOutNotes(getStoreState())
    return focusedCells.filter(cell => {
        return (
            isCellEmpty(cell, tryOutMainNumbers) && getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 0
        )
    })
}

export const getMultipleCellsNakedSinglesCandidates = (groupCandidates, focusedCells) => {
    return groupCandidates.filter(candidate => {
        const candidateNakedSingleHostCells = getCandidateNakedSingleHostCells(candidate, focusedCells)
        return candidateNakedSingleHostCells.length > 1
    })
}

export const getCandidateNakedSingleHostCells = (candidate, focusedCells) => {
    const tryOutNotesInfo = getTryOutNotes(getStoreState())

    return focusedCells.filter(cell => {
        return (
            isCellNoteVisible(candidate, tryOutNotesInfo[cell.row][cell.col]) &&
            getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 1
        )
    })
}

export const getNakedGroupNoTryOutInputResult = groupCandidates => {
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
    return cells
        .map(cell => {
            return {
                note: getCellVisibleNotes(boardNotes[cell.row][cell.col])[0],
                cell,
            }
        })
        .sort(({ note: noteA }, { note: noteB }) => {
            return noteA - noteB
        })
}

export const getNotesListTextFromCellsWithNotes = (cellsWithNotes, lastNoteConjugation) => {
    const notes = getNotesFromCellsWithNotes(cellsWithNotes)
    return getCandidatesListText(notes, lastNoteConjugation)
}

export const getNotesFromCellsWithNotes = cellsWithNotes => {
    return cellsWithNotes.map(({ note }) => note)
}

export const getCellsFromCellsWithNote = cellsWithNotes => {
    return cellsWithNotes.map(({ cell }) => cell)
}

export const getCellsAxesValuesListText = (cells, lastCellConjugation) => {
    if (cells.length === 1) return getCellAxesValues(cells[0])

    if (!lastCellConjugation) {
        return getCellsAxesList(cells).join(', ')
    }

    const allCellsExceptLast = cells.slice(0, cells.length - 1)
    const cellsAxesList = getCellsAxesList(allCellsExceptLast)
    return cellsAxesList.join(', ') + ` ${lastCellConjugation} ${getCellAxesValues(cells[cells.length - 1])}`
}

export const getCellsAxesList = cells => {
    return cells.map(cell => {
        return getCellAxesValues(cell)
    })
}
