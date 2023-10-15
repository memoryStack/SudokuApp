import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _map from '@lodash/map'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import { getCellAxesValues } from '../../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'

import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import {
    CellHighlightData,
    CellsFocusData, NotesRemovalHintAction, SmartHintsColorSystem, TransformedRawHint,
} from '../../types'
import { setCellDataInHintResult, getHintExplanationStepsFromHintChunks, transformCellBGColor } from '../../util'
import { YWingRawHint } from '../../yWing/types'
import { getEliminatableNotesCells } from '../../yWing/utils'

import { getCellsAxesValuesListText } from '../helpers'
import { YWingTransformerArgs } from './types'

const addPivotUIHighlightData = (pivotCell: Cell, cellsToFocusData: CellsFocusData, smartHintsColorSystem: SmartHintsColorSystem) => {
    const pivotCellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.yWingPivotCellBGColor(smartHintsColorSystem)) }
    setCellDataInHintResult(pivotCell, pivotCellHighlightData, cellsToFocusData)
}

const addWingsUIHighlightData = (wingCells: Cell[], cellsToFocusData: CellsFocusData, smartHintsColorSystem: SmartHintsColorSystem) => {
    wingCells.forEach(wingCell => {
        const wingCellHighlightData: CellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.yWingWingCellBGColor(smartHintsColorSystem)) }
        setCellDataInHintResult(wingCell, wingCellHighlightData, cellsToFocusData)
    })
}

const addEliminableNoteCellUIHighlightData = (
    eliminableNote: NoteValue,
    eliminableNotesCells: Cell[],
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    eliminableNotesCells.forEach(cell => {
        const cellHighlightData: CellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
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
}: {
    commonNoteInWings: NoteValue
    pivotCell: Cell
    wingCells: Cell[]
    eliminableNotesCells: Cell[]
    smartHintsColorSystem: SmartHintsColorSystem
}) => {
    const cellsToFocusData: CellsFocusData = {}
    addPivotUIHighlightData(pivotCell, cellsToFocusData, smartHintsColorSystem)
    addWingsUIHighlightData(wingCells, cellsToFocusData, smartHintsColorSystem)
    addEliminableNoteCellUIHighlightData(commonNoteInWings, eliminableNotesCells, cellsToFocusData, smartHintsColorSystem)
    return cellsToFocusData
}

const getHintExplainationChunks = ({
    pivotNotes, commonNoteInWings, pivotCell, wingCells,
}: {
    pivotNotes: NoteValue[]
    commonNoteInWings: NoteValue
    pivotCell: Cell
    wingCells: Cell[]
}): string[] => {
    const msgTemplates = HINT_EXPLANATION_TEXTS[HINTS_IDS.Y_WING] as string[]

    const msgPlaceholdersValues = {
        firstPivotNote: pivotNotes[0],
        secondPivotNote: pivotNotes[1],
        commonNoteInWings,
        pivotCell: getCellAxesValues(pivotCell),
        wingCellsText: getCellsAxesValuesListText(wingCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }

    return msgTemplates.map(msgTemplate => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
}

const getApplyHintData = (yWing: YWingRawHint, notesData: Notes): NotesRemovalHintAction[] => {
    const eliminableNotesCells = getEliminatableNotesCells(yWing, notesData)
    return _map(eliminableNotesCells, (cell: Cell) => ({
        cell,
        action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [yWing.wingsCommonNote] },
    }))
}

export const transformYWingRawHint = ({ rawHint: yWing, notesData, smartHintsColorSystem }: YWingTransformerArgs): TransformedRawHint => {
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
