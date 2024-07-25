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
import { XYZ_WING } from '../stringLiterals'

import { BoardInputs } from '../types'
import { getCandidatesListText } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'

import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { XYZWingRawHint } from '../../xyzWing/types'

const getWingsCellsCoordinates = (xyzWing: XYZWingRawHint) => {
    return [xyzWing.wings[0].cell, xyzWing.wings[1].cell]
}

export const xyzWingTryOutAnalyser = (
    { xyzWing }: { xyzWing: XYZWingRawHint },
    boardInputs: BoardInputs
) => {

    const wingCellsCoordinates = getWingsCellsCoordinates(xyzWing)
    const pivotCellCoordinates = xyzWing.pivot.cell
    const wingAllCells = [pivotCellCoordinates, ...wingCellsCoordinates]

    const removableNoteHostCellsFilled = anyCellHasTryOutInput(xyzWing.removableNoteHostCells, boardInputs)
    const pivotCellFilled = anyCellHasTryOutInput([xyzWing.pivot.cell], boardInputs)
    const anyWingsFilled = anyCellHasTryOutInput(wingCellsCoordinates, boardInputs)

    if (!(pivotCellFilled || removableNoteHostCellsFilled || anyWingsFilled)) {
        const msgPlaceholdersValues = {
            xyzCellsCandidates: getCandidatesListText(xyzWing.pivot.notes),
            removableCandidate: xyzWing.wingsAndPivotCommonNote,
            removableNoteHostCells: getCellsAxesValuesListText(xyzWing.removableNoteHostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        }
        return {
            msg: dynamicInterpolation(XYZ_WING.NO_INPUT, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (removableNoteHostCellsFilled) {
        if (!(pivotCellFilled || anyWingsFilled)) {
            const msgPlaceholdersValues = {
                nakedSinglesCells: getCellsAxesValuesListText(wingCellsCoordinates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND)
            }
            return {
                msg: dynamicInterpolation(XYZ_WING.REMOVABLE_NOTE_CELL_FILLED.NO_OTHER_CELL_FILLED, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.START,
            }
        }

        const cellsWithoutCandidates = getCellsWithNoCandidates(wingAllCells, boardInputs)
        if (!_isEmpty(cellsWithoutCandidates)) {
            const filledRemovableNoteHostCell = filterFilledCellsInTryOut(xyzWing.removableNoteHostCells, boardInputs)
            const msgPlaceholdersValues = {
                cellsWithNoCandidates: getCellsAxesValuesListText(cellsWithoutCandidates),
                removableCandidate: xyzWing.wingsAndPivotCommonNote,
                filledRemovableNoteHostCell: getCellAxesValues(filledRemovableNoteHostCell[0])
            }
            return {
                msg: dynamicInterpolation(XYZ_WING.REMOVABLE_NOTE_CELL_FILLED.CELL_WITHOUT_CANDIDATES, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        const nsCells = filterNakedSingleCells(wingAllCells, boardInputs)
        if (!_isEmpty(nsCells)) {
            const msgPlaceholdersValues = {
                nakedSinglesCells: getCellsAxesValuesListText(nsCells)
            }
            return {
                msg: dynamicInterpolation(XYZ_WING.REMOVABLE_NOTE_CELL_FILLED.CELLS_HAVE_NAKED_SINGLE, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.START,
            }
        }
    }

    const emptyWingCells = filterCellsWithoutTryoutInput(wingAllCells, boardInputs)
    if (_isEmpty(emptyWingCells)) {
        const msgPlaceholdersValues = {
            xyzCells: getCellsAxesValuesListText(wingAllCells),
            removableCandidate: xyzWing.wingsAndPivotCommonNote
        }
        return {
            msg: dynamicInterpolation(XYZ_WING.ALL_CELLS_FILLED_PROPERLY, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    const wingCellsFilledWithCommonNote = wingAllCells.filter((cell) => {
        return MainNumbersRecord.isCellFilledWithNumber(boardInputs.tryOutMainNumbers, xyzWing.wingsAndPivotCommonNote, cell)
    })
    if (!_isEmpty(wingCellsFilledWithCommonNote)) {
        const msgPlaceholdersValues = {
            emptyWingCells: getCellsAxesValuesListText(filterCellsWithoutTryoutInput(wingAllCells, boardInputs)),
            removableCandidate: xyzWing.wingsAndPivotCommonNote,
            wingCellsFilledWithRemovableCandidate: getCellsAxesValuesListText(wingCellsFilledWithCommonNote),
            removableNoteHostCells: getCellsAxesValuesListText(xyzWing.removableNoteHostCells)
        }
        return {
            msg: dynamicInterpolation(XYZ_WING.COMMON_NOTE_FILLED_IN_ANY_WING_CELLS, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    if (!_isEmpty(emptyWingCells)) {
        return {
            msg: XYZ_WING.PARTIALLY_FILLED,
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    return {
        msg: 'Oops! Invalid State. Something is wrong from our side.',
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}
