import { dynamicInterpolation } from '@lodash/dynamicInterpolation'

import { MainNumbersRecord } from 'src/apps/arena/RecordUtilities/boardMainNumbers'
import { getStoreState } from '../../../../../../redux/dispatch.helpers'

import { NotesRecord } from '../../../../RecordUtilities/boardNotes'
import { getTryOutNotes } from '../../../../store/selectors/smartHintHC.selectors'

import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'

import { getCandidatesListText } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { NAKED_GROUPS } from '../stringLiterals'
import { getCandidatesToBeFilled, getCellsWithNoCandidates, getCorrectFilledTryOutCandidates } from '../helpers'

export const getNakedGroupNoTryOutInputResult = groupCandidates => {
    const msgPlaceholderValues = {
        candidatesListText: getCandidatesListText(groupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }
    return {
        msg: dynamicInterpolation(NAKED_GROUPS.NO_INPUT, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.START,
    }
}

export const getCellsFromCellsWithNote = cellsWithNotes => cellsWithNotes.map(({ cell }) => cell)

export const getNotesListTextFromCellsWithNotes = (cellsWithNotes, lastNoteConjugation) => {
    const notes = getNotesFromCellsWithNotes(cellsWithNotes)
    return getCandidatesListText(notes, lastNoteConjugation)
}

export const getNotesFromCellsWithNotes = cellsWithNotes => cellsWithNotes.map(({ note }) => note)

// TODO: think over the below type of DS special case
/* below some funcs will work on CellWithNotes DS specially for try-out ananlysers */
// TODO: should i handle it using the class based implementation ??
export const getNakedSingleCellsWithNoteInAscOrder = (cells, boardNotes) => cells
    .map(cell => ({
        note: NotesRecord.getCellVisibleNotesList(boardNotes, cell)[0],
        cell,
    }))
    .sort(({ note: noteA }, { note: noteB }) => noteA - noteB)

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
    const msgPlaceholderValues = {
        emptyCellsListText: getCellsAxesValuesListText(cellsWithNoCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }
    return {
        msg: dynamicInterpolation(NAKED_GROUPS.EMPTY_GROUP_CELL, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getMultipleCellsNakedSinglesCandidates = (groupCandidates, focusedCells) => groupCandidates.filter(candidate => {
    const candidateNakedSingleHostCells = getCandidateNakedSingleHostCells(candidate, focusedCells)
    return candidateNakedSingleHostCells.length > 1
})

const getMultipleCellsNakedSinglesErrorResult = (multipleCellsNakedSingleCandidates, focusedCells) => {
    const firstCandidate = multipleCellsNakedSingleCandidates[0]
    const firstCandidateHostCells = getCandidateNakedSingleHostCells(firstCandidate, focusedCells)
    const msgPlaceholderValues = {
        candidate: firstCandidate,
        emptyCellsListText: getCellsAxesValuesListText(
            firstCandidateHostCells,
            HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
        ),
        nakedSingleHostCellNounText: firstCandidateHostCells.length > 2 ? 'cells' : 'cell',
    }

    return {
        msg: dynamicInterpolation(NAKED_GROUPS.MULTIPLE_CELLS_NAKED_SINGLE, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.START,
    }
}

const getCandidateNakedSingleHostCells = (candidate, focusedCells) => {
    const tryOutNotesInfo = getTryOutNotes(getStoreState())

    return focusedCells.filter(
        cell => NotesRecord.isNotePresentInCell(tryOutNotesInfo, candidate, cell)
            && NotesRecord.getCellVisibleNotesCount(tryOutNotesInfo, cell) === 1,
    )
}

export const getAllInputsFilledResult = (groupCandidates, groupCells, tryOutMainNumbers) => {
    const filledCandidatesHostCells = getCorrectlyFilledCandidatesHostCells(groupCandidates, groupCells, tryOutMainNumbers)

    const msgPlaceholderValues = {
        candidatesHostCells: getCellsAxesValuesListText(filledCandidatesHostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        candidatesListText: getCandidatesListText(groupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }

    return {
        msg: dynamicInterpolation(NAKED_GROUPS.VALID_FILL.FULL, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

export const getPartialCorrectlyFilledResult = (groupCandidates, groupCells, tryOutMainNumbers) => {
    const filledCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    const candidatesToBeFilled = getCandidatesToBeFilled(filledCandidates, groupCandidates)
    const filledCandidatesHostCells = getCorrectlyFilledCandidatesHostCells(filledCandidates, groupCells, tryOutMainNumbers)

    const msgPlaceholderValues = {
        toBeFilledCandidates: getCandidatesListText(candidatesToBeFilled, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        filledCandidates: getCandidatesListText(filledCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        filledCandidatesHostCells: getCellsAxesValuesListText(filledCandidatesHostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        filledCandidatesCountHV: filledCandidates.length === 1 ? 'is' : 'are',
        toBeFilledCandidatesPronoun: candidatesToBeFilled.length > 1 ? 'these' : 'it',
    }

    return {
        msg: dynamicInterpolation(NAKED_GROUPS.VALID_FILL.PARTIAL, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getCorrectlyFilledCandidatesHostCells = (filledCandidates, groupCells, tryOutMainNumbers) => filledCandidates.map(filledCandidate => groupCells.find(groupCell => MainNumbersRecord.isCellFilledWithNumber(tryOutMainNumbers, filledCandidate, groupCell)))
