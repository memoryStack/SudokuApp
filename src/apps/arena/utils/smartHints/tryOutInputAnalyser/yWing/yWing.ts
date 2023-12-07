import _sortNumbers from '@lodash/sortNumbers'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _isEmpty from '@lodash/isEmpty'
import _sortBy from '@lodash/sortBy'
import _difference from '@lodash/difference'

import { getCellAxesValues, sortCells } from '../../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'
import { YWingRawHint } from '../../yWing/types'

import { TRY_OUT_RESULT_STATES } from '../constants'
import {
    anyCellHasTryOutInput,
    filterCellsWithoutTryoutInput,
    filterFilledCellsInTryOut,
    getCellsWithNoCandidates,
    getCorrectFilledTryOutCandidates,
    isCellWithoutAnyCandidate,
    noInputInTryOut,
} from '../helpers'
import { YWING } from '../stringLiterals'
import { getCandidatesListText } from '../../util'
import { BoardInputs } from '../types'

export const yWingTryOutAnalyser = (
    { yWing, eliminableNotesCells }: { yWing: YWingRawHint, eliminableNotesCells: Cell[] },
    boardInputs: BoardInputs,
) => {
    const { pivot, wings, wingsCommonNote } = yWing

    const wingCells = wings.map(wing => wing.cell)

    const inputPanelCandidates = _sortNumbers([wingsCommonNote, ...pivot.notes])

    if (noInputInTryOut([...wingCells, pivot.cell, ...eliminableNotesCells], boardInputs)) {
        const msgPlaceholderValues = { commonNoteInWings: wingsCommonNote }
        return {
            msg: dynamicInterpolation(YWING.NO_INPUT, msgPlaceholderValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (anyCellHasTryOutInput(eliminableNotesCells, boardInputs)) {
        if (isCellWithoutAnyCandidate(pivot.cell, boardInputs)) {
            const msgPlaceholderValues = {
                pivotCell: getCellAxesValues(pivot.cell),
                commonNoteInWings: wingsCommonNote,
                eliminableNotesFilledCells: getCellsAxesValuesListText(filterFilledCellsInTryOut(eliminableNotesCells, boardInputs), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
            }
            return {
                msg: dynamicInterpolation(YWING.ELIMINABLE_NOTES_CELL_FILLED.PIVOT_CELL_WITHOUT_CANDIDATE, msgPlaceholderValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        const wingsWithoutAnyCandidate = getCellsWithNoCandidates(wingCells, boardInputs)
        if (!_isEmpty(wingsWithoutAnyCandidate)) {
            const msgPlaceholderValues = {
                emptyWingCell: getCellAxesValues(wingsWithoutAnyCandidate[0]),
                commonNoteInWings: wingsCommonNote,
                eliminableNotesFilledCells: getCellsAxesValuesListText(filterFilledCellsInTryOut(eliminableNotesCells, boardInputs), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
            }
            return {
                msg: dynamicInterpolation(YWING.ELIMINABLE_NOTES_CELL_FILLED.WING_CELL_WITHOUT_CANDIDATE, msgPlaceholderValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        const filledWingsCells = filterFilledCellsInTryOut(wingCells, boardInputs)
        if (_isEmpty(filledWingsCells)) {
            const msgPlaceholderValues = { wingsCells: getCellsAxesValuesListText(sortCells(wingCells), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND) }
            return {
                msg: dynamicInterpolation(YWING.ELIMINABLE_NOTES_CELL_FILLED.BOTH_WINGS_WITHOUT_INPUT, msgPlaceholderValues),
                state: TRY_OUT_RESULT_STATES.START,
            }
        }

        const wingsWithoutTryOutInput = filterCellsWithoutTryoutInput(wingCells, boardInputs)
        const msgPlaceholderValues = { emptyWingCell: getCellAxesValues(wingsWithoutTryOutInput[0]) }
        return {
            msg: dynamicInterpolation(YWING.ELIMINABLE_NOTES_CELL_FILLED.ONE_OF_WINGS_WITHOUT_INPUT, msgPlaceholderValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (isCellWithoutAnyCandidate(pivot.cell, boardInputs)) {
        const msgPlaceholderValues = {
            pivotCell: getCellAxesValues(pivot.cell),
            commonNoteInWings: wingsCommonNote,
        }
        return {
            msg: dynamicInterpolation(YWING.PIVOT_CELL_WITHOUT_CANDIDATE, msgPlaceholderValues),
            state: TRY_OUT_RESULT_STATES.ERROR,
        }
    }

    const emptyEliminableNotesHostCells = getCellsWithNoCandidates(eliminableNotesCells, boardInputs)
    if (!_isEmpty(emptyEliminableNotesHostCells)) {
        const msgPlaceholderValues = {
            eliminableNotesCellsWithoutCandidates: getCellsAxesValuesListText(sortCells(emptyEliminableNotesHostCells), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
            filledPivotAndWingsCells: getCellsAxesValuesListText(sortCells(filterFilledCellsInTryOut([pivot.cell, ...wingCells], boardInputs)), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        }
        return {
            msg: dynamicInterpolation(YWING.ELIMINABLE_NOTES_CELL_WITHOUT_CANDIDATE, msgPlaceholderValues),
            state: TRY_OUT_RESULT_STATES.ERROR,
        }
    }

    // valid progress cases
    if (filterFilledCellsInTryOut([pivot.cell, ...wingCells], boardInputs).length !== 3) {
        const yWingCells = [pivot.cell, ...wingCells]
        const { tryOutMainNumbers } = boardInputs
        const filledCandidates = getCorrectFilledTryOutCandidates(yWingCells, tryOutMainNumbers)
        const toBeFilledCandidates = _difference(inputPanelCandidates, filledCandidates)

        const msgPlaceholderValues = {
            filledCandidates: getCandidatesListText(_sortBy(filledCandidates), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
            filledCandidatesCountHV: filledCandidates.length > 1 ? 'are' : 'is',
            toBeFilledCandidates: getCandidatesListText(_sortBy(toBeFilledCandidates), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
            toBeFilledCandidatesPronoun: toBeFilledCandidates.length > 1 ? 'these' : 'it',
        }
        return {
            msg: dynamicInterpolation(YWING.VALID_FILL.PARTIAL, msgPlaceholderValues),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    const msgPlaceholderValues = {
        candidatesListText: getCandidatesListText(_sortBy(inputPanelCandidates), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        commonNoteInWings: wingsCommonNote,
        eliminableNotesHostCells: getCellsAxesValuesListText(sortCells(eliminableNotesCells), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }
    return {
        msg: dynamicInterpolation(YWING.VALID_FILL.FULL, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}
