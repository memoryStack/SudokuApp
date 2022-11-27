import { getStoreState } from '../../../../../../redux/dispatch.helpers'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../../store/selectors/smartHintHC.selectors'

import { getCellVisibleNotes, getCellVisibleNotesCount, isCellEmpty, isCellNoteVisible } from '../../../util'

import { getCandidatesListText } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'

import { TRY_OUT_RESULT_STATES } from '../constants'

import { getCellsAxesValuesListText } from '../../uiHighlightData.helpers'

export const getNakedGroupNoTryOutInputResult = groupCandidates => {
    const candidatesListText = getCandidatesListText(groupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR)
    return {
        msg:
            `try filling ${candidatesListText} in the cells where` +
            ` it is highlighted in red or green color to see why this hint works`,
        state: TRY_OUT_RESULT_STATES.START,
    }
}

export const getCellsFromCellsWithNote = cellsWithNotes => {
    return cellsWithNotes.map(({ cell }) => cell)
}

export const getNotesListTextFromCellsWithNotes = (cellsWithNotes, lastNoteConjugation) => {
    const notes = getNotesFromCellsWithNotes(cellsWithNotes)
    return getCandidatesListText(notes, lastNoteConjugation)
}

export const getNotesFromCellsWithNotes = cellsWithNotes => {
    return cellsWithNotes.map(({ note }) => note)
}

// TODO: think over the below type of DS special case
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

const getCellsWithNoCandidates = focusedCells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const tryOutNotesInfo = getTryOutNotes(getStoreState())
    return focusedCells.filter(cell => {
        return (
            isCellEmpty(cell, tryOutMainNumbers) && getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 0
        )
    })
}

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

const getMultipleCellsNakedSinglesCandidates = (groupCandidates, focusedCells) => {
    return groupCandidates.filter(candidate => {
        const candidateNakedSingleHostCells = getCandidateNakedSingleHostCells(candidate, focusedCells)
        return candidateNakedSingleHostCells.length > 1
    })
}

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

const getCandidateNakedSingleHostCells = (candidate, focusedCells) => {
    const tryOutNotesInfo = getTryOutNotes(getStoreState())

    return focusedCells.filter(cell => {
        return (
            isCellNoteVisible(candidate, tryOutNotesInfo[cell.row][cell.col]) &&
            getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 1
        )
    })
}
