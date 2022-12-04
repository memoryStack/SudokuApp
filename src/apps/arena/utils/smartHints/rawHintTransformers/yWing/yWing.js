import { dynamicInterpolation } from 'lodash/src/utils/dynamicInterpolation'
import _map from 'lodash/src/utils/map'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import { getCellAxesValues } from '../../../util'

import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, SMART_HINTS_CELLS_BG_COLOR } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { setCellDataInHintResult, getHintExplanationStepsFromHintChunks } from '../../util'
import { getEliminatableNotesCells } from '../../yWing/utils'

import { getCellsAxesValuesListText } from '../helpers'

const YWING_CELLS_TYPES = {
    PIVOT: 'PIVOT',
    WING: 'WING',
    ELIMINABLE_NOTE: 'ELIMINABLE_NOTE',
}

const COLORS = {
    [YWING_CELLS_TYPES.PIVOT]: { backgroundColor: 'green' },
    [YWING_CELLS_TYPES.WING]: { backgroundColor: 'orange' },
    [YWING_CELLS_TYPES.ELIMINABLE_NOTE]: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
}

const addPivotUIHighlightData = (pivotCell, cellsToFocusData) => {
    const pivotCellHighlightData = { bgColor: COLORS[YWING_CELLS_TYPES.PIVOT] }
    setCellDataInHintResult(pivotCell, pivotCellHighlightData, cellsToFocusData)
}

const addWingsUIHighlightData = (wingCells, cellsToFocusData) => {
    wingCells.forEach(wingCell => {
        const wingCellHighlightData = { bgColor: COLORS[YWING_CELLS_TYPES.WING] }
        setCellDataInHintResult(wingCell, wingCellHighlightData, cellsToFocusData)
    })
}

const addEliminableNoteCellUIHighlightData = (eliminableNote, eliminableNotesCells, cellsToFocusData) => {
    eliminableNotesCells.forEach(cell => {
        const cellHighlightData = { bgColor: COLORS[YWING_CELLS_TYPES.ELIMINABLE_NOTE] }
        cellHighlightData.notesToHighlightData = {
            [eliminableNote]: {
                fontColor: 'red',
            },
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
}

const getUICellsToFocusData = ({ commonNoteInWings, pivotCell, wingCells, eliminableNotesCells }) => {
    const cellsToFocusData = {}

    addPivotUIHighlightData(pivotCell, cellsToFocusData)
    addWingsUIHighlightData(wingCells, cellsToFocusData)
    addEliminableNoteCellUIHighlightData(commonNoteInWings, eliminableNotesCells, cellsToFocusData)

    return cellsToFocusData
}

const getHintExplainationChunks = ({ pivotNotes, commonNoteInWings, pivotCell, wingCells }) => {
    const msgTemplates = HINT_EXPLANATION_TEXTS[HINTS_IDS.Y_WING]

    const msgPlaceholdersValues = {
        firstPivotNote: pivotNotes[0],
        secondPivotNote: pivotNotes[1],
        commonNoteInWings,
        pivotCell: getCellAxesValues(pivotCell),
        wingCellsText: getCellsAxesValuesListText(wingCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND)
    }

    return msgTemplates.map((msgTemplate) => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
}

const getApplyHintData = (yWing, notesData) => {
    const eliminableNotesCells = getEliminatableNotesCells(yWing, notesData)
    return _map(eliminableNotesCells, (cell) => {
        return {
            cell,
            action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [yWing.wingsCommonNote] }
        }
    })
}

export const transformYWingRawHint = ({ rawHint: yWing, notesData }) => {
    const { pivot, wings } = yWing

    const wingCells = wings.map(wing => wing.cell)

    const cellsToFocusData = getUICellsToFocusData({
        commonNoteInWings: yWing.wingsCommonNote,
        pivotCell: pivot.cell,
        wingCells,
        eliminableNotesCells: getEliminatableNotesCells(yWing, notesData),
    })

    const hintChunks = getHintExplainationChunks({
        pivotNotes: pivot.notes,
        commonNoteInWings: yWing.wingsCommonNote,
        pivotCell: pivot.cell,
        wingCells,
    })

    return {
        cellsToFocusData,
        title: HINT_ID_VS_TITLES[HINTS_IDS.Y_WING],
        steps: getHintExplanationStepsFromHintChunks(hintChunks, false),
        applyHint: getApplyHintData(yWing, notesData),
    }
}
