import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _isEmpty from '@lodash/isEmpty'

import { getCellAxesValues } from '../../../util'

import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'

import { TRY_OUT_RESULT_STATES } from '../constants'
import {
    anyCellHasTryOutInput,
    filterCellsWithoutTryoutInput,
    filterFilledCellsInTryOut,
    filterNakedSingleCells,
    getCellsWithNoCandidates
} from '../helpers'

import { BoardInputs } from '../types'
import { getCandidatesListText, getAxisValuesFromTranslations } from '../../util'

import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { XYZWingRawHint } from '../../xyzWing/types'
import { SmartHintsTranslationsTexts } from '../../types'

const getWingsCellsCoordinates = (xyzWing: XYZWingRawHint) => {
    return [xyzWing.wings[0].cell, xyzWing.wings[1].cell]
}

export const xyzWingTryOutAnalyser = (
    { xyzWing }: { xyzWing: XYZWingRawHint },
    boardInputs: BoardInputs,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts
) => {

    const wingCellsCoordinates = getWingsCellsCoordinates(xyzWing)
    const pivotCellCoordinates = xyzWing.pivot.cell
    const wingAllCells = [pivotCellCoordinates, ...wingCellsCoordinates]
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)

    const removableNoteHostCellsFilled = anyCellHasTryOutInput(xyzWing.removableNoteHostCells, boardInputs)
    const pivotCellFilled = anyCellHasTryOutInput([xyzWing.pivot.cell], boardInputs)
    const anyWingsFilled = anyCellHasTryOutInput(wingCellsCoordinates, boardInputs)

    if (!(pivotCellFilled || removableNoteHostCellsFilled || anyWingsFilled)) {
        const msgPlaceholdersValues = {
            xyzCellsCandidates: getCandidatesListText(xyzWing.pivot.notes),
            removableCandidate: xyzWing.wingsAndPivotCommonNote,
            removableNoteHostCells: getCellsAxesValuesListText(xyzWing.removableNoteHostCells, smartHintsTranslationsTexts.common.conjugations.and, axisValues),
        }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.xyzWing.noInput, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (removableNoteHostCellsFilled) {
        if (!(pivotCellFilled || anyWingsFilled)) {
            const msgPlaceholdersValues = {
                nakedSinglesCells: getCellsAxesValuesListText(wingCellsCoordinates, smartHintsTranslationsTexts.common.conjugations.and, axisValues)
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.xyzWing.removableNoteCellFilled.noOtherCellFilled, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.START,
            }
        }

        const cellsWithoutCandidates = getCellsWithNoCandidates(wingAllCells, boardInputs)
        if (!_isEmpty(cellsWithoutCandidates)) {
            const filledRemovableNoteHostCell = filterFilledCellsInTryOut(xyzWing.removableNoteHostCells, boardInputs)
            const msgPlaceholdersValues = {
                cellsWithNoCandidates: getCellsAxesValuesListText(cellsWithoutCandidates, undefined, axisValues),
                removableCandidate: xyzWing.wingsAndPivotCommonNote,
                filledRemovableNoteHostCell: getCellAxesValues(filledRemovableNoteHostCell[0], axisValues)
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.xyzWing.removableNoteCellFilled.cellWithoutCandidates, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        const nsCells = filterNakedSingleCells(wingAllCells, boardInputs)
        if (!_isEmpty(nsCells)) {
            const msgPlaceholdersValues = {
                nakedSinglesCells: getCellsAxesValuesListText(nsCells, undefined, axisValues)
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.xyzWing.removableNoteCellFilled.cellsHaveNakedSingle, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.START,
            }
        }
    }

    const emptyWingCells = filterCellsWithoutTryoutInput(wingAllCells, boardInputs)
    if (_isEmpty(emptyWingCells)) {
        const msgPlaceholdersValues = {
            xyzCells: getCellsAxesValuesListText(wingAllCells, undefined, axisValues),
            removableCandidate: xyzWing.wingsAndPivotCommonNote
        }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.xyzWing.allCellsFilledProperly, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    const wingCellsFilledWithCommonNote = wingAllCells.filter((cell) => {
        return MainNumbersRecord.isCellFilledWithNumber(boardInputs.tryOutMainNumbers, xyzWing.wingsAndPivotCommonNote, cell)
    })
    if (!_isEmpty(wingCellsFilledWithCommonNote)) {
        const msgPlaceholdersValues = {
            emptyWingCells: getCellsAxesValuesListText(filterCellsWithoutTryoutInput(wingAllCells, boardInputs), undefined, axisValues),
            removableCandidate: xyzWing.wingsAndPivotCommonNote,
            wingCellsFilledWithRemovableCandidate: getCellsAxesValuesListText(wingCellsFilledWithCommonNote, undefined, axisValues),
            removableNoteHostCells: getCellsAxesValuesListText(xyzWing.removableNoteHostCells, undefined, axisValues)
        }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.xyzWing.commonNoteFilledInAnyWingCells, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    if (!_isEmpty(emptyWingCells)) {
        return {
            msg: smartHintsTranslationsTexts.tryOutAnalyser.xyzWing.partiallyFilled,
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    return {
        msg: smartHintsTranslationsTexts.tryOutAnalyser.unattainableState,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}
