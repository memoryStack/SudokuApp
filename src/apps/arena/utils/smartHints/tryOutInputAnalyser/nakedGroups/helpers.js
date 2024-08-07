import { dynamicInterpolation } from '@lodash/dynamicInterpolation'

import { NotesRecord } from '@domain/board/records/notesRecord'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { cellHasTryOutInput } from '../../../../smartHintHC/helpers'

import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'

import { getCandidatesListText } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { NAKED_GROUPS } from '../stringLiterals'
import { getCandidatesToBeFilled, getCellsWithNoCandidates, getCorrectFilledTryOutCandidates } from '../helpers'
import { isCellExists } from '../../../util'

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

export const getNakedGroupTryOutInputErrorResult = (groupCandidates, groupCells, focusedCells, boardInputs) => {
    const cellsWithNoCandidates = getCellsWithNoCandidates(focusedCells, boardInputs)

    if (cellsWithNoCandidates.length) {
        const { tryOutMainNumbers, actualMainNumbers } = boardInputs
        const cellsFilledByRemovableNotes = focusedCells.filter(cell => !isCellExists(cell, groupCells) && cellHasTryOutInput(cell, { tryOutMainNumbers, actualMainNumbers }))
            .map(cell => ({
                number: MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell),
                cell,
            }))

        return getEmptyCellsErrorResult(cellsWithNoCandidates, cellsFilledByRemovableNotes)
    }

    const multipleCellsNakedSingleCandidates = getMultipleCellsNakedSinglesCandidates(groupCandidates, focusedCells, boardInputs)
    if (multipleCellsNakedSingleCandidates.length) {
        return getMultipleCellsNakedSinglesErrorResult(multipleCellsNakedSingleCandidates, focusedCells, boardInputs)
    }

    return null
}

const getEmptyCellsErrorResult = (cellsWithNoCandidates, cellsFilledByRemovableNotes) => {
    const removableFilledNotesList = cellsFilledByRemovableNotes.map(({ number }) => number)
    const removableFilledNotesHostCellsList = cellsFilledByRemovableNotes.map(({ cell }) => cell)
    const msgPlaceholderValues = {
        emptyCellsListText: getCellsAxesValuesListText(cellsWithNoCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        removableFilledNotes: getCandidatesListText(removableFilledNotesList, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        removableFilledNotesHostCells: getCellsAxesValuesListText(removableFilledNotesHostCellsList, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        numbersPronoun: removableFilledNotesList.length > 1 ? 'these' : 'this',
        numbersTextSingularPlural: removableFilledNotesList.length > 1 ? 'numbers' : 'number',
        candidatesHV: removableFilledNotesList.length > 1 ? 'don\'t' : 'doesn\'t',
        cellsPronoun: removableFilledNotesList.length > 1 ? 'these' : 'this',
        cellsSingularPlural: removableFilledNotesList.length > 1 ? 'cells' : 'cell',
    }
    return {
        msg: dynamicInterpolation(NAKED_GROUPS.EMPTY_GROUP_CELL, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getMultipleCellsNakedSinglesCandidates = (groupCandidates, focusedCells, boardInputs) => groupCandidates.filter(candidate => {
    const candidateNakedSingleHostCells = getCandidateNakedSingleHostCells(candidate, focusedCells, boardInputs)
    return candidateNakedSingleHostCells.length > 1
})

const getMultipleCellsNakedSinglesErrorResult = (multipleCellsNakedSingleCandidates, focusedCells, boardInputs) => {
    const firstCandidate = multipleCellsNakedSingleCandidates[0]
    const firstCandidateHostCells = getCandidateNakedSingleHostCells(firstCandidate, focusedCells, boardInputs)
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

const getCandidateNakedSingleHostCells = (candidate, focusedCells, boardInputs) => {
    const { tryOutNotes } = boardInputs

    return focusedCells.filter(
        cell => NotesRecord.isNotePresentInCell(tryOutNotes, candidate, cell)
            && NotesRecord.getCellVisibleNotesCount(tryOutNotes, cell) === 1,
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
