import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _difference from '@lodash/difference'

import { BaseURRawHint, CellAndRemovableNotes, URTransformerArgs } from '../../types/uniqueRectangle'

import { TransformedRawHint, CellsFocusData, SmartHintsColorSystem } from '../../types'
import _map from '@lodash/map'
import { getCandidatesListText, getHintExplanationStepsFromHintChunks, setCellBGColor, setCellNotesColor } from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { areSameCells, getCellAxesValues } from '@domain/board/utils/housesAndCells'
import { NotesRecord } from '@domain/board/records/notesRecord'
import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS } from '../../stringLiterals'
import { UR_TYPES } from '../../uniqueRectangle/constants'

// move it in helpers
const getRemovableNotesVsHostCells = (ur: BaseURRawHint) => {
    const result: { [key: NoteValue]: Cell[] } = []
    _forEach(ur.cellAndRemovableNotes, (cellRemovableNotes: CellAndRemovableNotes) => {
        _forEach(cellRemovableNotes.notes, (note: NoteValue) => {
            if (!result[note]) result[note] = []
            result[note].push(cellRemovableNotes.cell)
        })
    })
    return result
}

const getCellsToFocusData = (
    ur: BaseURRawHint,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const cellsToFocusData: CellsFocusData = {}

    _forEach(ur.hostCells, (cell: Cell) => {
        setCellBGColor(cell, smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem), cellsToFocusData)
    })

    const removableNotesHostCell = ur.cellAndRemovableNotes[0].cell
    const safeCells = ur.hostCells.filter((cell) => {
        return !areSameCells(cell, removableNotesHostCell)
    })

    setCellNotesColor(removableNotesHostCell, ur.urNotes, smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem), cellsToFocusData)
    _forEach(safeCells, (cell: Cell) => {
        setCellNotesColor(cell, ur.urNotes, smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem), cellsToFocusData)
    })

    return cellsToFocusData
}

const getHintExplanationText = (ur: BaseURRawHint, notes: Notes) => {
    const removableNotesHostCell = ur.cellAndRemovableNotes[0].cell
    const cellNotes = NotesRecord.getCellVisibleNotesList(notes, removableNotesHostCell)
    const extraNotes = _difference(cellNotes, ur.urNotes)

    const extraNotesText = getCandidatesListText(extraNotes, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR)
    const firstURNote = ur.urNotes[0]
    const secondURNote = ur.urNotes[1]
    const cellWithExtraCandidates = getCellAxesValues(removableNotesHostCell)
    const firstHostCell = getCellAxesValues(ur.hostCells[0])
    const secondHostCell = getCellAxesValues(ur.hostCells[1])
    const thirdHostCell = getCellAxesValues(ur.hostCells[2])
    const fourthHostCell = getCellAxesValues(ur.hostCells[3])

    const msgTemplates = extraNotes.length === 1 ? HINT_EXPLANATION_TEXTS[HINTS_IDS.UNIQUE_RECTANGLE][UR_TYPES.TYPE_ONE].singleExtraCandidateMsg
        : HINT_EXPLANATION_TEXTS[HINTS_IDS.UNIQUE_RECTANGLE][UR_TYPES.TYPE_ONE].multipleExtraCandidateMsg

    const msgPlaceholdersValues = {
        extraNotesText,
        firstURNote,
        secondURNote,
        cellWithExtraCandidates,
        firstHostCell,
        secondHostCell,
        thirdHostCell,
        fourthHostCell,
    }

    const hintChunks = msgTemplates.map((msgTemplate: string) => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
    return getHintExplanationStepsFromHintChunks(hintChunks, false)
}

export const transformURTypeOne = ({
    rawHint: ur,
    notesData,
    smartHintsColorSystem
}: URTransformerArgs): TransformedRawHint => {
    return {
        title: 'Unique Rectangle-1',
        hasTryOut: false,
        steps: getHintExplanationText(ur, notesData),
        cellsToFocusData: getCellsToFocusData(ur, smartHintsColorSystem),
        focusedCells: ur.hostCells,
        // tryOutAnalyserData: {
        //     wWing,
        // },
        // removableNotes: getRemovableNotesVsHostCells(ur), // how it's used ??
        // inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(wWing.nakedPairNotes) as InputPanelVisibleNumbers,
        // clickableCells: _cloneDeep(focusedCells),
        // unclickableCellClickInTryOutMsg: 'you can only select the cells which are highlighted here.',
    }
}
