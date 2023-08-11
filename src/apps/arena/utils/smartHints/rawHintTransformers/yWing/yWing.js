import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _map from '@lodash/map'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import { getCellAxesValues } from '../../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'

import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { setCellDataInHintResult, getHintExplanationStepsFromHintChunks, transformCellBGColor } from '../../util'
import { getEliminatableNotesCells } from '../../yWing/utils'

import { getCellsAxesValuesListText } from '../helpers'

const addPivotUIHighlightData = (pivotCell, cellsToFocusData, smartHintsColorSystem) => {
    const pivotCellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.yWingPivotCellBGColor(smartHintsColorSystem)) }
    setCellDataInHintResult(pivotCell, pivotCellHighlightData, cellsToFocusData)
}

const addWingsUIHighlightData = (wingCells, cellsToFocusData, smartHintsColorSystem) => {
    wingCells.forEach(wingCell => {
        const wingCellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.yWingWingCellBGColor(smartHintsColorSystem)) }
        setCellDataInHintResult(wingCell, wingCellHighlightData, cellsToFocusData)
    })
}

const addEliminableNoteCellUIHighlightData = (eliminableNote, eliminableNotesCells, cellsToFocusData, smartHintsColorSystem) => {
    eliminableNotesCells.forEach(cell => {
        const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        cellHighlightData.notesToHighlightData = {
            [eliminableNote]: {
                fontColor: smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem),
            },
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
}

const getUICellsToFocusData = ({
    commonNoteInWings, pivotCell, wingCells, eliminableNotesCells, smartHintsColorSystem,
}) => {
    const cellsToFocusData = {}
    addPivotUIHighlightData(pivotCell, cellsToFocusData, smartHintsColorSystem)
    addWingsUIHighlightData(wingCells, cellsToFocusData, smartHintsColorSystem)
    addEliminableNoteCellUIHighlightData(commonNoteInWings, eliminableNotesCells, cellsToFocusData, smartHintsColorSystem)
    return cellsToFocusData
}

const getHintExplainationChunks = ({
    pivotNotes, commonNoteInWings, pivotCell, wingCells,
}) => {
    const msgTemplates = HINT_EXPLANATION_TEXTS[HINTS_IDS.Y_WING]

    const msgPlaceholdersValues = {
        firstPivotNote: pivotNotes[0],
        secondPivotNote: pivotNotes[1],
        commonNoteInWings,
        pivotCell: getCellAxesValues(pivotCell),
        wingCellsText: getCellsAxesValuesListText(wingCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }

    return msgTemplates.map(msgTemplate => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
}

const getApplyHintData = (yWing, notesData) => {
    const eliminableNotesCells = getEliminatableNotesCells(yWing, notesData)
    return _map(eliminableNotesCells, cell => ({
        cell,
        action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [yWing.wingsCommonNote] },
    }))
}

export const transformYWingRawHint = ({ rawHint: yWing, notesData, smartHintsColorSystem }) => {
    const { pivot, wings } = yWing

    const wingCells = wings.map(wing => wing.cell)

    const cellsToFocusData = getUICellsToFocusData({
        commonNoteInWings: yWing.wingsCommonNote,
        pivotCell: pivot.cell,
        wingCells,
        eliminableNotesCells: getEliminatableNotesCells(yWing, notesData),
        smartHintsColorSystem,
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
