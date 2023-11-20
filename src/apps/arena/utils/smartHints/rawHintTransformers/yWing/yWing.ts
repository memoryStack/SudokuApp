import _difference from '@lodash/difference'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _includes from '@lodash/includes'
import _map from '@lodash/map'
import _reduce from '@lodash/reduce'
import _sortBy from '@lodash/sortBy'

import { NotesRecord } from '../../../../RecordUtilities/boardNotes'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import { getCellAxesValues, getCellsCommonHousesInfo, sortCells } from '../../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'

import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import {
    CellHighlightData,
    CellsFocusData, CellsRestrictedNumberInputs, NotesRemovalHintAction, NotesToHighlightData, RemovableNotesInfo, SmartHintsColorSystem, TransformedRawHint,
} from '../../types'
import {
    setCellDataInHintResult, getHintExplanationStepsFromHintChunks, transformCellBGColor, getTryOutInputPanelNumbersVisibility, getCellsFromCellsToFocusedData, getCandidatesListText,
} from '../../util'
import { YWingRawHint, YWingCell } from '../../yWing/types'
import { getEliminatableNotesCells } from '../../yWing/utils'

import { getCellsAxesValuesListText, getHouseNumAndName } from '../helpers'
import { YWingTransformerArgs } from './types'

const addPivotUIHighlightData = (pivot: YWingCell, cellsToFocusData: CellsFocusData, smartHintsColorSystem: SmartHintsColorSystem) => {
    const pivotCellHighlightData = {
        bgColor: transformCellBGColor(smartHintColorSystemReader.yWingPivotCellBGColor(smartHintsColorSystem)),
        notesToHighlightData: _reduce(pivot.notes, (acc: NotesToHighlightData, note: NoteValue) => {
            acc[note] = { fontColor: smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem) }
            return acc
        }, {}),
    }
    setCellDataInHintResult(pivot.cell, pivotCellHighlightData, cellsToFocusData)
}

const addWingsUIHighlightData = (wings: YWingCell [], cellsToFocusData: CellsFocusData, smartHintsColorSystem: SmartHintsColorSystem) => {
    wings.forEach(wing => {
        const wingCellHighlightData: CellHighlightData = {
            bgColor: transformCellBGColor(smartHintColorSystemReader.yWingWingCellBGColor(smartHintsColorSystem)),
            notesToHighlightData: _reduce(wing.notes, (acc: NotesToHighlightData, note: NoteValue) => {
                acc[note] = { fontColor: smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem) }
                return acc
            }, {}),
        }
        setCellDataInHintResult(wing.cell, wingCellHighlightData, cellsToFocusData)
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
    commonNoteInWings, pivot, wings, eliminableNotesCells, smartHintsColorSystem,
}: {
    commonNoteInWings: NoteValue
    pivot: YWingCell
    wings: YWingCell[]
    eliminableNotesCells: Cell[]
    smartHintsColorSystem: SmartHintsColorSystem
}) => {
    const cellsToFocusData: CellsFocusData = {}
    addPivotUIHighlightData(pivot, cellsToFocusData, smartHintsColorSystem)
    addWingsUIHighlightData(wings, cellsToFocusData, smartHintsColorSystem)
    addEliminableNoteCellUIHighlightData(commonNoteInWings, eliminableNotesCells, cellsToFocusData, smartHintsColorSystem)
    return cellsToFocusData
}

const getPivotNotesWithWingsHostCellsMap = (pivotNotes: NoteValue[], wings: YWingCell[]) => {
    const result: {[key: NoteValue] : Cell} = {}
    pivotNotes.forEach(pivotNote => {
        result[pivotNote] = _includes(wings[0].notes, pivotNote) ? wings[0].cell : wings[1].cell
    })
    return result
}

const getHintExplainationChunks = ({
    pivotNotes, commonNoteInWings, pivotCell, wings, eliminableNotesCells,
}: {
    pivotNotes: NoteValue[]
    commonNoteInWings: NoteValue
    pivotCell: Cell
    wings: YWingCell[]
    eliminableNotesCells: Cell[]
}): string[] => {
    const msgTemplates = HINT_EXPLANATION_TEXTS[HINTS_IDS.Y_WING] as string[]

    const wingCells = wings.map(wing => wing.cell)

    const pivotAndFirstWingCellCommonHouse = getCellsCommonHousesInfo([pivotCell, wingCells[0]])[0]
    const pivotAndSecondWingCellCommonHouse = getCellsCommonHousesInfo([pivotCell, wingCells[1]])[0]

    const pivotNotesWingsHostCells = getPivotNotesWithWingsHostCellsMap(pivotNotes, wings)

    const msgPlaceholdersValues = {
        firstPivotNote: pivotNotes[0],
        secondPivotNote: pivotNotes[1],
        commonNoteInWings,
        pivotCell: getCellAxesValues(pivotCell),
        wingCellsText: getCellsAxesValuesListText(wingCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        eliminableNotesCells: getCellsAxesValuesListText(eliminableNotesCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        firstWingCell: getCellAxesValues(wingCells[0]),
        secondWingCell: getCellAxesValues(wingCells[1]),
        firstWingAndPivotCommonHouse: getHouseNumAndName(pivotAndFirstWingCellCommonHouse),
        secondWingAndPivotCommonHouse: getHouseNumAndName(pivotAndSecondWingCellCommonHouse),

        pivotCellNotes: getCandidatesListText(_sortBy(pivotNotes), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        pivotCellFirstNoteWingHostCell: getCellAxesValues(pivotNotesWingsHostCells[pivotNotes[0]]),
        pivotCellSecondNoteWingHostCell: getCellAxesValues(pivotNotesWingsHostCells[pivotNotes[1]]),

        removableNotesHostCells: getCellsAxesValuesListText(sortCells(eliminableNotesCells), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
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

const getCellsRestrictedNumberInputs = (commonNoteInWings: NoteValue, eliminableNotesCells: Cell[], notes: Notes) => {
    const result: CellsRestrictedNumberInputs = {}

    _forEach(eliminableNotesCells, (cell: Cell) => {
        const cellNotes = NotesRecord.getCellVisibleNotesList(notes, cell)
        const cellKey = getCellAxesValues(cell)
        result[cellKey] = _difference(cellNotes, [commonNoteInWings])
    })

    return result
}

export const transformYWingRawHint = ({ rawHint: yWing, notesData, smartHintsColorSystem }: YWingTransformerArgs): TransformedRawHint => {
    const { pivot, wings } = yWing

    const wingCells = wings.map(wing => wing.cell)

    const commonNoteInWings = yWing.wingsCommonNote

    const eliminableNotesCells = getEliminatableNotesCells(yWing, notesData)
    const cellsToFocusData = getUICellsToFocusData({
        commonNoteInWings,
        pivot,
        wings,
        eliminableNotesCells,
        smartHintsColorSystem,
    })

    const hintChunks = getHintExplainationChunks({
        pivotNotes: pivot.notes,
        commonNoteInWings,
        pivotCell: pivot.cell,
        wings,
        eliminableNotesCells,
    })

    return {
        type: HINTS_IDS.Y_WING,
        title: HINT_ID_VS_TITLES[HINTS_IDS.Y_WING],
        cellsToFocusData,
        focusedCells: getCellsFromCellsToFocusedData(cellsToFocusData),
        steps: getHintExplanationStepsFromHintChunks(hintChunks),
        applyHint: getApplyHintData(yWing, notesData),
        hasTryOut: true,
        clickableCells: [pivot.cell, ...wingCells, ...eliminableNotesCells],
        unclickableCellClickInTryOutMsg: 'you can only select cells which are highlighted here',
        tryOutAnalyserData: {
            yWing,
            eliminableNotesCells,
        },
        removableNotes: { [commonNoteInWings]: eliminableNotesCells } as RemovableNotesInfo,
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility([commonNoteInWings, ...pivot.notes]) as InputPanelVisibleNumbers,

        cellsRestrictedNumberInputs: getCellsRestrictedNumberInputs(commonNoteInWings, eliminableNotesCells, notesData),
        restrictedNumberInputMsg: `please enter only ${commonNoteInWings} here. we are not commenting anything about other numbers in this cell`,
    }
}
