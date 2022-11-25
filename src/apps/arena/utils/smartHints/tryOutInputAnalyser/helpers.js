import _filter from 'lodash/src/utils/filter'
import _isEmpty from 'lodash/src/utils/isEmpty'

import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getMainNumbers } from '../../../store/selectors/board.selectors'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'
import {
    isCellEmpty,
    getCellVisibleNotesCount,
    isCellNoteVisible,
    getCellVisibleNotes,
} from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../constants'
import { getCellsAxesValuesListText } from '../uiHighlightData.helpers'
import { getCandidatesListText } from '../util'

import {
    TRY_OUT_RESULT_STATES,
    TRY_OUT_ERROR_TYPES_VS_ERROR_MSG,
} from './constants'

export const filterFilledCellsInTryOut = cells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())

    return _filter(cells, (cell) => {
        return isCellEmpty(cell, mainNumbers) && !isCellEmpty(cell, tryOutMainNumbers)
    })
}

export const noInputInTryOut = focusedCells => _isEmpty(filterFilledCellsInTryOut(focusedCells))

// TODO: it will be better if we move it to nakedGroup files only
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

// move it with above handler
const getCellsWithNoCandidates = focusedCells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const tryOutNotesInfo = getTryOutNotes(getStoreState())
    return focusedCells.filter(cell => {
        return (
            isCellEmpty(cell, tryOutMainNumbers) && getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 0
        )
    })
}

// move it with above handler
const getEmptyCellsErrorResult = cellsWithNoCandidates => {
    const emptyCellsListText = getCellsAxesValuesListText(
        cellsWithNoCandidates,
        HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
    )
    return {
        msg:
            `${emptyCellsListText} have no candidate left. in the final` +
            ` solution no cell can be empty so, the current arrangement of numbers is invalid`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

// move it with above handler
const getMultipleCellsNakedSinglesCandidates = (groupCandidates, focusedCells) => {
    return groupCandidates.filter(candidate => {
        const candidateNakedSingleHostCells = getCandidateNakedSingleHostCells(candidate, focusedCells)
        return candidateNakedSingleHostCells.length > 1
    })
}

// move it with above handler
const getMultipleCellsNakedSinglesErrorResult = (multipleCellsNakedSingleCandidates, focusedCells) => {
    const firstCandidate = multipleCellsNakedSingleCandidates[0]
    const firstCandidateHostCells = getCandidateNakedSingleHostCells(firstCandidate, focusedCells)
    const emptyCellsListText = getCellsAxesValuesListText(
        firstCandidateHostCells,
        HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
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

// move it with above handler
const getCandidateNakedSingleHostCells = (candidate, focusedCells) => {
    const tryOutNotesInfo = getTryOutNotes(getStoreState())

    return focusedCells.filter(cell => {
        return (
            isCellNoteVisible(candidate, tryOutNotesInfo[cell.row][cell.col]) &&
            getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 1
        )
    })
}

// move it to naked group handler file only
const getNakedGroupNoTryOutInputResult = groupCandidates => {
    const candidatesListText = getCandidatesListText(groupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR)
    return {
        msg:
            `try filling ${candidatesListText} in the cells where` +
            ` it is highlighted in red or green color to see why this hint works`,
        state: TRY_OUT_RESULT_STATES.START,
    }
}


// NOTE: run it only when we are sure that there is no cell
// which is filled wrongly in the try-out step
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

// move it to naked groups helpers
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

// move it to naked groups helpers
export const getNotesListTextFromCellsWithNotes = (cellsWithNotes, lastNoteConjugation) => {
    const notes = getNotesFromCellsWithNotes(cellsWithNotes)
    return getCandidatesListText(notes, lastNoteConjugation)
}

// move it to naked groups helpers
export const getNotesFromCellsWithNotes = cellsWithNotes => {
    return cellsWithNotes.map(({ note }) => note)
}

// move it to naked groups helpers
export const getCellsFromCellsWithNote = cellsWithNotes => {
    return cellsWithNotes.map(({ cell }) => cell)
}
