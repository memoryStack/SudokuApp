import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'

import { HINTS_IDS } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'

import { getCellsAxesValuesListText, getHouseNumAndName } from '../helpers'
import {
    getCandidatesListText,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    highlightNoteInCellsWithGivenColor,
} from '../../util'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import smartHintColorSystemReader from '../../colorSystem.reader'
import {
    CellsFocusData, CellsRestrictedNumberInputs, NotesRemovalHintAction, SmartHintsColorSystem, TransformedRawHint,
} from '../../types'

import { XYZWingTransformerArgs } from './types'
import { XYZWingRawHint } from '../../xyzWing/types'
import { NotesRecord } from 'src/apps/arena/RecordUtilities/boardNotes'
import { convertBoardCellToNum } from '../../../cellTransformers'
import _difference from '@lodash/difference'
import { getCellAxesValues } from '../../../util'

const WING_CELLS_NOTES_COLORS = {
    OTHER_NOTES: 'green',
    REMOVABLE_NOTE: '#4B61D1'
}

const getXYZWingCells = (xyzWing: XYZWingRawHint) => {
    return [
        xyzWing.pivot.cell,
        xyzWing.wings[0].cell,
        xyzWing.wings[1].cell
    ]
}

const getHintExplanationText = (xyzWing: XYZWingRawHint, notes: Notes) => {
    const msgTemplates = HINT_EXPLANATION_TEXTS.XYZ_WING

    const msgPlaceholdersValues = {
        xyzWingCells: getCellsAxesValuesListText(getXYZWingCells(xyzWing)),
        xyzWingCandidates: getCandidatesListText(xyzWing.pivot.notes),
        wingsAndPivotCommonNote: xyzWing.wingsAndPivotCommonNote,
        removableNoteHostCells: getCellsAxesValuesListText(xyzWing.removableNoteHostCells)
    }

    const hintChunks = msgTemplates.map((msgTemplate: string) => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
    return getHintExplanationStepsFromHintChunks(hintChunks)
}

const getCellsToFocusData = (
    xyzWing: XYZWingRawHint,
    notes: Notes,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const cellsToFocusData: CellsFocusData = {}

    highlightNoteInCellsWithGivenColor(
        xyzWing.wingsAndPivotCommonNote,
        xyzWing.removableNoteHostCells,
        smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem),
        smartHintsColorSystem,
        cellsToFocusData
    )

    const xyzWingAllCells = [xyzWing.pivot, ...xyzWing.wings]

    xyzWingAllCells.forEach((wingCell) => {
        wingCell.notes.forEach((cellNote) => {
            const noteColor = cellNote === xyzWing.wingsAndPivotCommonNote ? WING_CELLS_NOTES_COLORS.REMOVABLE_NOTE : WING_CELLS_NOTES_COLORS.OTHER_NOTES
            highlightNoteInCellsWithGivenColor(
                cellNote,
                [wingCell.cell],
                noteColor,
                smartHintsColorSystem,
                cellsToFocusData
            )
        })
    })

    return cellsToFocusData
}

const getApplyHintData = (xyzWing: XYZWingRawHint) => {
    const result: NotesRemovalHintAction[] = []

    _forEach(xyzWing.removableNoteHostCells, (cell: Cell) => {
        result.push({
            cell,
            action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [xyzWing.wingsAndPivotCommonNote] },
        })
    })

    return result
}

const getAllFocusedCellsCoordinates = (xyzWing: XYZWingRawHint) => {
    return [
        ...getXYZWingCells(xyzWing),
        ...xyzWing.removableNoteHostCells
    ]
}

const getTryOutCellsRestrictedNumberInputs = (xyzWing: XYZWingRawHint, notes: Notes) => {
    const result: CellsRestrictedNumberInputs = {}

    xyzWing.removableNoteHostCells.forEach((removableNoteHostCell) => {
        const cellNotes = NotesRecord.getCellVisibleNotesList(notes, removableNoteHostCell)
        const cellKey = getCellAxesValues(removableNoteHostCell)
        result[cellKey] = _difference(cellNotes, [xyzWing.wingsAndPivotCommonNote])
    })

    return result
}

export const transformXYZWingRawHint = ({
    rawHint: xyzWing,
    notesData,
    smartHintsColorSystem,
}: XYZWingTransformerArgs): TransformedRawHint => {
    return {
        type: HINTS_IDS.XYZ_WING,
        hasTryOut: true,
        title: HINT_ID_VS_TITLES[HINTS_IDS.XYZ_WING],
        steps: getHintExplanationText(xyzWing, notesData),
        cellsToFocusData: getCellsToFocusData(xyzWing, notesData, smartHintsColorSystem),
        focusedCells: getAllFocusedCellsCoordinates(xyzWing),
        applyHint: getApplyHintData(xyzWing),
        tryOutAnalyserData: {
            xyzWing,
        },
        removableNotes: { [xyzWing.wingsAndPivotCommonNote]: xyzWing.removableNoteHostCells },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(xyzWing.pivot.notes) as InputPanelVisibleNumbers,
        clickableCells: getAllFocusedCellsCoordinates(xyzWing),
        cellsRestrictedNumberInputs: getTryOutCellsRestrictedNumberInputs(xyzWing, notesData),
        unclickableCellClickInTryOutMsg: 'you can only select the cells which are highlighted here.',
        restrictedNumberInputMsg: `you can only fill ${xyzWing.wingsAndPivotCommonNote} because we are not commenting about any other number in this cell`
    }
}
