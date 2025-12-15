import { dynamicInterpolation } from '@lodash/dynamicInterpolation'

import { NotesRecord } from '@domain/board/records/notesRecord'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { cellHasTryOutInput } from '../../../../smartHintHC/helpers'

import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'

import { getCandidatesListText, getAxisValuesFromTranslations } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { getCandidatesToBeFilled, getCellsWithNoCandidates, getCorrectFilledTryOutCandidates } from '../helpers'
import { isCellExists } from '../../../util'
import { SmartHintsTranslationsTexts } from '../../types'

export const getNakedGroupNoTryOutInputResult = (groupCandidates, smartHintsTranslationsTexts) => {
    const msgPlaceholderValues = {
        candidatesListText: getCandidatesListText(groupCandidates, smartHintsTranslationsTexts.common.conjugations.and),
    }
    return {
        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.nakedGroups.noInput, msgPlaceholderValues),
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

export const getNakedGroupTryOutInputErrorResult = (groupCandidates, groupCells, focusedCells, boardInputs, smartHintsTranslationsTexts) => {
    const cellsWithNoCandidates = getCellsWithNoCandidates(focusedCells, boardInputs)

    if (cellsWithNoCandidates.length) {
        const { tryOutMainNumbers, actualMainNumbers } = boardInputs
        const cellsFilledByRemovableNotes = focusedCells.filter(cell => !isCellExists(cell, groupCells) && cellHasTryOutInput(cell, { tryOutMainNumbers, actualMainNumbers }))
            .map(cell => ({
                number: MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell),
                cell,
            }))

        return getEmptyCellsErrorResult(cellsWithNoCandidates, cellsFilledByRemovableNotes, smartHintsTranslationsTexts)
    }

    const multipleCellsNakedSingleCandidates = getMultipleCellsNakedSinglesCandidates(groupCandidates, focusedCells, boardInputs)
    if (multipleCellsNakedSingleCandidates.length) {
        return getMultipleCellsNakedSinglesErrorResult(multipleCellsNakedSingleCandidates, focusedCells, boardInputs, smartHintsTranslationsTexts)
    }

    return null
}

const getEmptyCellsErrorResult = (cellsWithNoCandidates, cellsFilledByRemovableNotes, smartHintsTranslationsTexts) => {
    const removableFilledNotesList = cellsFilledByRemovableNotes.map(({ number }) => number)
    const removableFilledNotesHostCellsList = cellsFilledByRemovableNotes.map(({ cell }) => cell)
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const isPlural = removableFilledNotesList.length > 1
    const msgPlaceholderValues = {
        emptyCellsListText: getCellsAxesValuesListText(cellsWithNoCandidates, smartHintsTranslationsTexts.common.conjugations.and, axisValues),
        removableFilledNotes: getCandidatesListText(removableFilledNotesList, smartHintsTranslationsTexts.common.conjugations.and),
        removableFilledNotesHostCells: getCellsAxesValuesListText(removableFilledNotesHostCellsList, smartHintsTranslationsTexts.common.conjugations.and, axisValues),
        numbersPronoun: smartHintsTranslationsTexts.common.this[isPlural ? 'plural' : 'singular'],
        numbersTextSingularPlural: smartHintsTranslationsTexts.common.number[isPlural ? 'plural' : 'singular'],
        candidatesHV: smartHintsTranslationsTexts.common.doNotVerb[isPlural ? 'plural' : 'singular'],
        cellsPronoun: smartHintsTranslationsTexts.common.this[isPlural ? 'plural' : 'singular'],
        cellsSingularPlural: smartHintsTranslationsTexts.common.houseTypes.cell[isPlural ? 'plural' : 'singular'],
    }
    return {
        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.nakedGroups.emptyGroupCell, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getMultipleCellsNakedSinglesCandidates = (groupCandidates, focusedCells, boardInputs) => groupCandidates.filter(candidate => {
    const candidateNakedSingleHostCells = getCandidateNakedSingleHostCells(candidate, focusedCells, boardInputs)
    return candidateNakedSingleHostCells.length > 1
})

const getMultipleCellsNakedSinglesErrorResult = (multipleCellsNakedSingleCandidates, focusedCells, boardInputs, smartHintsTranslationsTexts) => {
    const firstCandidate = multipleCellsNakedSingleCandidates[0]
    const firstCandidateHostCells = getCandidateNakedSingleHostCells(firstCandidate, focusedCells, boardInputs)
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const isPlural = firstCandidateHostCells.length > 2
    const msgPlaceholderValues = {
        candidate: firstCandidate,
        emptyCellsListText: getCellsAxesValuesListText(
            firstCandidateHostCells,
            smartHintsTranslationsTexts.common.conjugations.and,
            axisValues
        ),
        nakedSingleHostCellNounText: smartHintsTranslationsTexts.common.houseTypes.cell[isPlural ? 'plural' : 'singular'],
    }

    return {
        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.nakedGroups.multipleCellsNakedSingle, msgPlaceholderValues),
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

export const getAllInputsFilledResult = (groupCandidates, groupCells, tryOutMainNumbers, smartHintsTranslationsTexts) => {
    const filledCandidatesHostCells = getCorrectlyFilledCandidatesHostCells(groupCandidates, groupCells, tryOutMainNumbers)
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)

    const msgPlaceholderValues = {
        candidatesHostCells: getCellsAxesValuesListText(filledCandidatesHostCells, smartHintsTranslationsTexts.common.conjugations.and, axisValues),
        candidatesListText: getCandidatesListText(groupCandidates, smartHintsTranslationsTexts.common.conjugations.and),
    }

    return {
        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.nakedGroups.validFill.full, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

export const getPartialCorrectlyFilledResult = (groupCandidates, groupCells, tryOutMainNumbers, smartHintsTranslationsTexts) => {
    const filledCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    const candidatesToBeFilled = getCandidatesToBeFilled(filledCandidates, groupCandidates)
    const filledCandidatesHostCells = getCorrectlyFilledCandidatesHostCells(filledCandidates, groupCells, tryOutMainNumbers)
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const filledIsPlural = filledCandidates.length > 1
    const toBeFilledIsPlural = candidatesToBeFilled.length > 1

    const msgPlaceholderValues = {
        toBeFilledCandidates: getCandidatesListText(candidatesToBeFilled, smartHintsTranslationsTexts.common.conjugations.and),
        filledCandidates: getCandidatesListText(filledCandidates, smartHintsTranslationsTexts.common.conjugations.and),
        filledCandidatesHostCells: getCellsAxesValuesListText(filledCandidatesHostCells, smartHintsTranslationsTexts.common.conjugations.and, axisValues),
        filledCandidatesCountHV: smartHintsTranslationsTexts.common.helpingVerb[filledIsPlural ? 'plural' : 'singular'],
        toBeFilledCandidatesPronoun: smartHintsTranslationsTexts.common.pronouns[toBeFilledIsPlural ? 'plural' : 'singular'],
    }

    return {
        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.nakedGroups.validFill.partial, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getCorrectlyFilledCandidatesHostCells = (filledCandidates, groupCells, tryOutMainNumbers) => filledCandidates.map(filledCandidate => groupCells.find(groupCell => MainNumbersRecord.isCellFilledWithNumber(tryOutMainNumbers, filledCandidate, groupCell)))
