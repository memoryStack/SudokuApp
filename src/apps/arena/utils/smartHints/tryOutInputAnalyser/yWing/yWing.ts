import _sortNumbers from '@lodash/sortNumbers'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _isEmpty from '@lodash/isEmpty'
import _isNil from '@lodash/isNil'
import { getTryOutMainNumbers, getTryOutNotes } from 'src/apps/arena/store/selectors/smartHintHC.selectors'
import { getStoreState } from 'src/redux/dispatch.helpers'
import { MainNumbersRecord } from 'src/apps/arena/RecordUtilities/boardMainNumbers'
import { NotesRecord } from 'src/apps/arena/RecordUtilities/boardNotes'
import _keys from '@lodash/keys'
import _find from '@lodash/find'
import { TRY_OUT_RESULT_STATES } from '../constants'
import {
    anyCellFilledWithGivenCandidate, filterFilledCellsInTryOut, getCellsWithNoCandidates, noInputInTryOut,
} from '../helpers'

import { YWING } from '../stringLiterals'
import { getCandidatesListText } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE_VS_FULL_NAMES } from '../../constants'
import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'
import { getCellAxesValues, getCellsCommonHouses } from '../../../util'

export const yWingTryOutAnalyser = ({ yWing, eliminableNotesCells }) => {
    const { pivot, wings, wingsCommonNote } = yWing

    const wingCells = wings.map(wing => wing.cell)

    const inputPanelCandidates = _sortNumbers([wingsCommonNote, ...pivot.notes])

    if (noInputInTryOut([...wingCells, pivot.cell, ...eliminableNotesCells])) {
        const msgPlaceholderValues = {
            candidatesListText: getCandidatesListText(inputPanelCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        }
        return {
            msg: dynamicInterpolation(YWING.NO_INPUT, msgPlaceholderValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    // any cell become empty
    const focusedCells = [pivot.cell, ...eliminableNotesCells, ...wingCells]
    const cellsWithoutCandidate = getCellsWithNoCandidates(focusedCells)
    if (!_isEmpty(cellsWithoutCandidate)) {
        const msgPlaceholderValues = {
            emptyCellsAxesListText: getCellsAxesValuesListText(cellsWithoutCandidate, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
            emptyCellsHelpingVerb: cellsWithoutCandidate.length > 1 ? 'are' : 'is',
        }

        return {
            msg: dynamicInterpolation(YWING.CELLS_WITHOUT_CANDIDATE, msgPlaceholderValues),
            state: TRY_OUT_RESULT_STATES.ERROR,
        }
    }

    // any eliminable cell is filled with eliminable candidate
    const eliminableNotesCellFilledWithEliminableNote = anyCellFilledWithGivenCandidate(eliminableNotesCells, wingsCommonNote)
    if (eliminableNotesCellFilledWithEliminableNote) {
        const pivotWillBeEmpty = noInputInTryOut([pivot.cell, ...wingCells])

        if (pivotWillBeEmpty) {
            const msgPlaceholderValues = {
                wingCellsAxesList: getCellsAxesValuesListText(wingCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
                pivotCellAxes: getCellAxesValues(pivot.cell),
            }
            return {
                msg: dynamicInterpolation(YWING.PIVOT_WILL_BE_EMPTY, msgPlaceholderValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        const multipleNakedSingle = getMultipleNakedSingleInSameHouse(pivot.cell, wingCells)
        if (!_isNil(multipleNakedSingle)) {
            const { candidate, cells } = multipleNakedSingle
            const commonHouses = getCellsCommonHouses(cells)
            const commonHouseType = _find(_keys(commonHouses), houseType => commonHouses[houseType])

            const msgPlaceholderValues = {
                nakedSingleCellsAxesList: getCellsAxesValuesListText(cells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
                nakedSingleCandidate: candidate,
                nakedSingleCellsCommonHouse: HOUSE_TYPE_VS_FULL_NAMES[commonHouseType].FULL_NAME,
            }
            return {
                msg: dynamicInterpolation(YWING.MULTIPLE_NS_IN_HOUSE, msgPlaceholderValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }
    }

    // tryout complete
    if (filterFilledCellsInTryOut([pivot.cell, ...wingCells]).length === 3) {
        const yWingCells = [pivot.cell, ...wingCells]
        const msgPlaceholderValues = {
            yWingCellsAxesListText: getCellsAxesValuesListText(yWingCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
            eliminableNote: wingsCommonNote,
            eliminableCellsAxesListText: getCellsAxesValuesListText(eliminableNotesCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        }
        return {
            msg: dynamicInterpolation(YWING.TRYOUT_COMPLETE, msgPlaceholderValues),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    return {
        msg: dynamicInterpolation(YWING.TRYOUT_PARTIAL_VALID_PROGRESS, { candidatesListText: inputPanelCandidates }),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getMultipleNakedSingleInSameHouse = (pivotCell: Cell, wingCells: Cell[]) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState()) as MainNumbers
    const tryOutNotes = getTryOutNotes(getStoreState()) as Notes

    if (
        MainNumbersRecord.isCellFilled(tryOutMainNumbers, pivotCell)
        || NotesRecord.getCellVisibleNotesCount(tryOutNotes, pivotCell) !== 1
    ) return null

    const wingCellWithSameNSAsPivot = wingCells.find(wingCell => NotesRecord.areSameNotesInCells(tryOutNotes, [pivotCell, wingCell]))

    return {
        candidate: NotesRecord.getCellVisibleNotesList(tryOutNotes, pivotCell)[0],
        cells: [pivotCell, wingCellWithSameNSAsPivot],
    }
}
