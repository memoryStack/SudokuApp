import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _isEqual from '@lodash/isEqual'
import _sortNumbers from '@lodash/sortNumbers'

import { N_CHOOSE_K } from '@resources/constants'

import { NotesRecord } from '@domain/board/records/notesRecord'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import {
    getCellAxesValues,
    isCellExists,
    sortCells,
} from '../../../util'
import { TRY_OUT_RESULT_STATES } from '../constants'
import { noInputInTryOut, getCorrectFilledTryOutCandidates } from '../helpers'
import { getCandidatesListText, getAxisValuesFromTranslations } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { isNakedSinglePresent } from '../../nakedSingle/nakedSingle'
import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'

import {
    getNakedGroupNoTryOutInputResult,
    getCellsFromCellsWithNote,
    getNotesListTextFromCellsWithNotes,
    getNakedSingleCellsWithNoteInAscOrder,
    getNakedGroupTryOutInputErrorResult,
    getAllInputsFilledResult,
    getPartialCorrectlyFilledResult,
} from './helpers'

export const nakedTrippleTryOutAnalyser = ({ groupCandidates, focusedCells, groupCells }, boardInputs, smartHintsTranslationsTexts) => {
    if (noInputInTryOut(focusedCells, boardInputs)) {
        return getNakedGroupNoTryOutInputResult(groupCandidates, smartHintsTranslationsTexts)
    }

    const tryOutErrorResult = getNakedGroupTryOutInputErrorResult(groupCandidates, groupCells, focusedCells, boardInputs, smartHintsTranslationsTexts)
    if (tryOutErrorResult) {
        return tryOutErrorResult
    }

    if (allGroupCellsEmpty(groupCells, boardInputs)) {
        const nakedSinglePairCellError = getNakedSinglePairCellsErrorResultIfExist(groupCells, boardInputs, smartHintsTranslationsTexts)
        if (nakedSinglePairCellError) return nakedSinglePairCellError

        const nakedDoublePairCellError = getNakedDoublePairCellsErrorResultIfPresent(groupCells, boardInputs, smartHintsTranslationsTexts)
        if (nakedDoublePairCellError) return nakedDoublePairCellError
    }

    return getValidProgressResult(groupCandidates, groupCells, boardInputs, smartHintsTranslationsTexts)
}

const allGroupCellsEmpty = (groupCells, { tryOutMainNumbers }) => groupCells.every(cell => !MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))

// two cells have naked single in them because of that third one
// will have no candidate in them
const getNakedSinglePairCellsErrorResultIfExist = (groupCells, { tryOutNotes }, smartHintsTranslationsTexts) => {
    const invalidNakedSingleCellsCombination = getNakedSinglesInvalidCombination(groupCells, tryOutNotes)
    if (invalidNakedSingleCellsCombination) {
        const chosenCells = getChosenCells(invalidNakedSingleCellsCombination, groupCells)
        const notChosenCell = getNotChosenCell(chosenCells, groupCells)
        return getNakedSinglePairErrorResult(chosenCells, notChosenCell, tryOutNotes, smartHintsTranslationsTexts)
    }

    return null
}

const getNakedSinglesInvalidCombination = (groupCells, tryOutNotes) => N_CHOOSE_K[3][2].find(combination => {
    const chosenCells = getChosenCells(combination, groupCells)

    // bug in this func.
    // i again wish i had implemented this using TDD
    const allChosenCellsHaveNakedSingle = chosenCells.every(cell => isNakedSinglePresent(tryOutNotes, cell).present)

    if (allChosenCellsHaveNakedSingle) {
        const chosenCellNotes = chosenCells
            .map(cell => NotesRecord.getCellVisibleNotesList(tryOutNotes, cell)[0])

        const notChosenCell = getNotChosenCell(chosenCells, groupCells)
        const notChosenCellWillNotHaveCandidate = _isEqual(
            _sortNumbers(chosenCellNotes),
            NotesRecord.getCellVisibleNotesList(tryOutNotes, notChosenCell),
        )

        return notChosenCellWillNotHaveCandidate
    }

    return false
})

const getChosenCells = (combination, groupCells) => combination.map(idx => groupCells[idx])

const getNotChosenCell = (chosenCells, allCells) => allCells.find(cell => !isCellExists(cell, chosenCells))

const getNakedSinglePairErrorResult = (chosenCells, notChosenCell, tryOutNotesInfo, smartHintsTranslationsTexts) => {
    const chosenCellWithNote = getNakedSingleCellsWithNoteInAscOrder(chosenCells, tryOutNotesInfo)
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const msgPlaceholderValues = {
        futureEmptyCellText: getCellAxesValues(notChosenCell, axisValues),
        nakedSingleCandidatesWithAndJoin: getNotesListTextFromCellsWithNotes(
            chosenCellWithNote,
            smartHintsTranslationsTexts.common.conjugations.and,
        ),
        nakedSingleCandidatesWithOrJoin: getNotesListTextFromCellsWithNotes(
            chosenCellWithNote,
            smartHintsTranslationsTexts.common.conjugations.or,
        ),
        nakedSingleHostCellsAxesText: getCellsAxesValuesListText(
            getCellsFromCellsWithNote(chosenCellWithNote),
            smartHintsTranslationsTexts.common.conjugations.and,
            axisValues
        ),
    }

    return {
        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.nakedTripple.futureEmptyCell.nakedSinglePair, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.START,
    }
}

// two cells have naked double in them because of that third one
// will have no candidate in it
const getNakedDoublePairCellsErrorResultIfPresent = (groupCells, { tryOutNotes }, smartHintsTranslationsTexts) => {
    const invalidNakedDoubleCellsCombination = getNakedDoublesInvalidCombination(groupCells, tryOutNotes)
    if (!invalidNakedDoubleCellsCombination) return null

    const chosenCells = getChosenCells(invalidNakedDoubleCellsCombination, groupCells)
    const notChosenCell = getNotChosenCell(chosenCells, groupCells)
    return getNakedDoublePairErrorResult(chosenCells, notChosenCell, tryOutNotes, smartHintsTranslationsTexts)
}

const getNakedDoublesInvalidCombination = (groupCells, tryOutNotesInfo) => N_CHOOSE_K[3][2].find(combination => {
    const chosenCells = getChosenCells(combination, groupCells)

    if (NotesRecord.areSameNotesInCells(tryOutNotesInfo, chosenCells)) {
        const notChosenCell = getNotChosenCell(chosenCells, groupCells)

        const notChosenCellNotes = NotesRecord.getCellVisibleNotesList(tryOutNotesInfo, notChosenCell)
        const aChosenCellNotes = NotesRecord.getCellVisibleNotesList(tryOutNotesInfo, chosenCells[0])
        const notChosenCellWillHaveCandidate = notChosenCellNotes.some(notChosenCellNote => !aChosenCellNotes.includes(notChosenCellNote))
        return !notChosenCellWillHaveCandidate
    }
    return false
})

const getNakedDoublePairErrorResult = (chosenCells, notChosenCell, tryOutNotesInfo, smartHintsTranslationsTexts) => {
    const aChosenCellNotes = NotesRecord.getCellVisibleNotesList(tryOutNotesInfo, chosenCells[0])
    const notChosenCellNotes = NotesRecord.getCellVisibleNotesList(tryOutNotesInfo, notChosenCell)

    const isThirdCellHasNakedSingle = notChosenCellNotes.length === 1

    let chosenCellsPotentialMultipleNakedSingleCandidate
    if (isThirdCellHasNakedSingle) {
        chosenCellsPotentialMultipleNakedSingleCandidate = notChosenCellNotes[0] === aChosenCellNotes[0] ? aChosenCellNotes[1] : aChosenCellNotes[0]
    }

    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const chosenCellsAxesText = getCellsAxesValuesListText(chosenCells, smartHintsTranslationsTexts.common.conjugations.and, axisValues)
    const notChosenCellCandidatesListText = getCandidatesListText(
        notChosenCellNotes,
        smartHintsTranslationsTexts.common.conjugations.and,
    )

    let msgPlaceholderValues; let
        resultMsg
    if (isThirdCellHasNakedSingle) {
        msgPlaceholderValues = {
            nakedSingleCandidate: notChosenCellNotes[0],
            nakedSingleHostCell: getCellAxesValues(notChosenCell, axisValues),
            nakedPairCellAxesText: chosenCellsAxesText,
            chosenCellsPotentialMultipleNakedSingleCandidate,
        }
        resultMsg = smartHintsTranslationsTexts.tryOutAnalyser.nakedTripple.futureEmptyCell.nakedDoublePair.nakedSingleInThirdCell
    } else {
        msgPlaceholderValues = {
            nakedDoubleCandidatesList: getCandidatesListText(aChosenCellNotes, smartHintsTranslationsTexts.common.conjugations.or),
            nakedDoubleHostCellAxesText: getCellsAxesValuesListText(sortCells([...chosenCells, notChosenCell]), smartHintsTranslationsTexts.common.conjugations.and, axisValues),
            futureEmptyCellText: getCellAxesValues(notChosenCell, axisValues),
            futureEmptyCellCandidatesListText: notChosenCellCandidatesListText,
        }
        resultMsg = smartHintsTranslationsTexts.tryOutAnalyser.nakedTripple.futureEmptyCell.nakedDoublePair.nakedDoubleInThirdCell
    }

    return {
        msg: dynamicInterpolation(resultMsg, msgPlaceholderValues),

        state: TRY_OUT_RESULT_STATES.START,
    }
}

const getValidProgressResult = (groupCandidates, groupCells, { tryOutMainNumbers }, smartHintsTranslationsTexts) => {
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        return getAllInputsFilledResult(groupCandidates, groupCells, tryOutMainNumbers, smartHintsTranslationsTexts)
    }
    return getPartialCorrectlyFilledResult(groupCandidates, groupCells, tryOutMainNumbers, smartHintsTranslationsTexts)
}
