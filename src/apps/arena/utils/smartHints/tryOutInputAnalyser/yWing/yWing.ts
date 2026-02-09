import _sortNumbers from '@lodash/sortNumbers'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _isEmpty from '@lodash/isEmpty'
import _sortBy from '@lodash/sortBy'
import _difference from '@lodash/difference'

import { getCellAxesValues, sortCells } from '../../../util'
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
import { getCandidatesListText, getAxisValuesFromTranslations } from '../../util'
import { BoardInputs } from '../types'
import { SmartHintsTranslationsTexts } from '../../types'
import { formatMessage } from '@utils/util'

export const yWingTryOutAnalyser = (
    { yWing, eliminableNotesCells }: { yWing: YWingRawHint, eliminableNotesCells: Cell[] },
    boardInputs: BoardInputs,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts,
) => {
    const { pivot, wings, wingsCommonNote } = yWing

    const wingCells = wings.map(wing => wing.cell)

    const inputPanelCandidates = _sortNumbers([wingsCommonNote, ...pivot.notes])
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)

    if (noInputInTryOut([...wingCells, pivot.cell, ...eliminableNotesCells], boardInputs)) {
        const msgPlaceholderValues = { commonNoteInWings: wingsCommonNote }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.yWing.noInput, msgPlaceholderValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (anyCellHasTryOutInput(eliminableNotesCells, boardInputs)) {
        if (isCellWithoutAnyCandidate(pivot.cell, boardInputs)) {
            const msgPlaceholderValues = {
                pivotCell: getCellAxesValues(pivot.cell, axisValues),
                commonNoteInWings: wingsCommonNote,
                eliminableNotesFilledCells: getCellsAxesValuesListText(filterFilledCellsInTryOut(eliminableNotesCells, boardInputs), smartHintsTranslationsTexts.common.conjugations.and, axisValues),
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.yWing.eliminableNotesCellFilled.pivotCellWithoutCandidate, msgPlaceholderValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        const wingsWithoutAnyCandidate = getCellsWithNoCandidates(wingCells, boardInputs)
        if (!_isEmpty(wingsWithoutAnyCandidate)) {
            const msgPlaceholderValues = {
                emptyWingCell: getCellAxesValues(wingsWithoutAnyCandidate[0], axisValues),
                commonNoteInWings: wingsCommonNote,
                eliminableNotesFilledCells: getCellsAxesValuesListText(filterFilledCellsInTryOut(eliminableNotesCells, boardInputs), smartHintsTranslationsTexts.common.conjugations.and, axisValues),
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.yWing.eliminableNotesCellFilled.wingCellWithoutCandidate, msgPlaceholderValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        const filledWingsCells = filterFilledCellsInTryOut(wingCells, boardInputs)
        if (_isEmpty(filledWingsCells)) {
            const msgPlaceholderValues = { wingsCells: getCellsAxesValuesListText(sortCells(wingCells), smartHintsTranslationsTexts.common.conjugations.and, axisValues) }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.yWing.eliminableNotesCellFilled.bothWingsWithoutInput, msgPlaceholderValues),
                state: TRY_OUT_RESULT_STATES.START,
            }
        }

        const wingsWithoutTryOutInput = filterCellsWithoutTryoutInput(wingCells, boardInputs)
        const msgPlaceholderValues = { emptyWingCell: getCellAxesValues(wingsWithoutTryOutInput[0], axisValues) }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.yWing.eliminableNotesCellFilled.oneOfWingsWithoutInput, msgPlaceholderValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (isCellWithoutAnyCandidate(pivot.cell, boardInputs)) {
        const msgPlaceholderValues = {
            pivotCell: getCellAxesValues(pivot.cell, axisValues),
            commonNoteInWings: wingsCommonNote,
        }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.yWing.pivotCellWithoutCandidate, msgPlaceholderValues),
            state: TRY_OUT_RESULT_STATES.ERROR,
        }
    }

    const emptyEliminableNotesHostCells = getCellsWithNoCandidates(eliminableNotesCells, boardInputs)
    if (!_isEmpty(emptyEliminableNotesHostCells)) {
        const msgPlaceholderValues = {
            eliminableNotesCellsWithoutCandidates: getCellsAxesValuesListText(sortCells(emptyEliminableNotesHostCells), smartHintsTranslationsTexts.common.conjugations.and, axisValues),
            filledPivotAndWingsCells: getCellsAxesValuesListText(sortCells(filterFilledCellsInTryOut([pivot.cell, ...wingCells], boardInputs)), smartHintsTranslationsTexts.common.conjugations.and, axisValues),
        }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.yWing.eliminableNotesCellWithoutCandidate, msgPlaceholderValues),
            state: TRY_OUT_RESULT_STATES.ERROR,
        }
    }

    // valid progress cases
    if (filterFilledCellsInTryOut([pivot.cell, ...wingCells], boardInputs).length !== 3) {
        const yWingCells = [pivot.cell, ...wingCells]
        const { tryOutMainNumbers } = boardInputs
        const filledCandidates = getCorrectFilledTryOutCandidates(yWingCells, tryOutMainNumbers)
        const toBeFilledCandidates = _difference(inputPanelCandidates, filledCandidates)
        const filledIsPlural = filledCandidates.length > 1
        const toBeFilledIsPlural = toBeFilledCandidates.length > 1

        const msgPlaceholderValues = {
            filledCandidates: getCandidatesListText(_sortBy(filledCandidates), smartHintsTranslationsTexts.common.conjugations.and),
            toBeFilledCandidates: getCandidatesListText(_sortBy(toBeFilledCandidates), smartHintsTranslationsTexts.common.conjugations.and),
            pronounsNounCount_one: toBeFilledCandidates.length,
            filledCandidatesCount: filledCandidates.length,
            helpingVerbNounCount_one: filledCandidates.length,
        }
        return {
            msg: formatMessage(
                dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.yWing.validFill.partial, msgPlaceholderValues),
                msgPlaceholderValues,
            ),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    const msgPlaceholderValues = {
        candidatesListText: getCandidatesListText(_sortBy(inputPanelCandidates), smartHintsTranslationsTexts.common.conjugations.and),
        commonNoteInWings: wingsCommonNote,
        eliminableNotesHostCells: getCellsAxesValuesListText(sortCells(eliminableNotesCells), smartHintsTranslationsTexts.common.conjugations.and, axisValues),
    }
    return {
        msg: formatMessage(smartHintsTranslationsTexts.tryOutAnalyser.yWing.validFill.full, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}
