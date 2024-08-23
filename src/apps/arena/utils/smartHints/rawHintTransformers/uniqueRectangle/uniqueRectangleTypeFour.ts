import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'

import { CellAndRemovableNotes, URTransformerArgs, UniqueRectangleTypeFourRawHint } from '../../types/uniqueRectangle'

import { TransformedRawHint, CellsFocusData, SmartHintsColorSystem } from '../../types'
import _map from '@lodash/map'
import { getHintExplanationStepsFromHintChunks, setCellBGColor, setCellNotesColor } from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { getCellAxesValues } from '@domain/board/utils/housesAndCells'
import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS } from '../../stringLiterals'
import { UR_TYPES } from '../../uniqueRectangle/constants'
import { getCellsAxesValuesListText, getHouseNumAndName } from '../helpers'
import { getURHostCellsWithExtraCandidates, getExtraNotesInURCells, getURHostCellsHavingURNotesOnly } from './helpers'

const getCellsToFocus = (ur: UniqueRectangleTypeFourRawHint) => ur.hostCells

const getCellsToFocusData = (
    ur: UniqueRectangleTypeFourRawHint,
    notes: Notes,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const cellsToFocusData: CellsFocusData = {}

    _forEach(getCellsToFocus(ur), (cell: Cell) => {
        setCellBGColor(cell, smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem), cellsToFocusData)
    })

    const cellsWithExtraCandidates = getURHostCellsWithExtraCandidates(ur, notes)
    _forEach(cellsWithExtraCandidates, (cell: Cell) => {
        setCellNotesColor(cell, [ur.urNoteOmission.note], smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem), cellsToFocusData)
    })

    const cellsHavingOnlyURNotes = getURHostCellsHavingURNotesOnly(ur, notes)
    _forEach(cellsHavingOnlyURNotes, (cell: Cell) => {
        setCellNotesColor(cell, ur.urNotes, smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem), cellsToFocusData)
    })

    _forEach(ur.cellAndRemovableNotes, ({ cell, notes }: CellAndRemovableNotes) => {
        setCellNotesColor(cell, notes, smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem), cellsToFocusData)
    })

    return cellsToFocusData
}

const getHintExplanationText = (ur: UniqueRectangleTypeFourRawHint, notes: Notes) => {
    const cellsWithExtraCandidates = getURHostCellsWithExtraCandidates(ur, notes)
    const msgPlaceholdersValues = {
        extraNote: getExtraNotesInURCells(ur, notes)[0],
        omissonNote: ur.urNoteOmission.note,
        removableNote: ur.removableURNote,
        cellsWithExtraCandidatesOrConcat: getCellsAxesValuesListText(cellsWithExtraCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR),
        cellsWithExtraCandidatesAndConcat: getCellsAxesValuesListText(cellsWithExtraCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        cellsHavingOnlyURNotes: getCellsAxesValuesListText(getURHostCellsHavingURNotesOnly(ur, notes), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        omissionHostHouse: getHouseNumAndName(ur.urNoteOmission.house),
        firstURNote: ur.urNotes[0],
        secondURNote: ur.urNotes[1],
        firstHostCell: getCellAxesValues(ur.hostCells[0]),
        secondHostCell: getCellAxesValues(ur.hostCells[1]),
        thirdHostCell: getCellAxesValues(ur.hostCells[2]),
        fourthHostCell: getCellAxesValues(ur.hostCells[3])
    }

    const msgTemplates = HINT_EXPLANATION_TEXTS[HINTS_IDS.UNIQUE_RECTANGLE][UR_TYPES.TYPE_FOUR]
    const hintChunks = msgTemplates.map((msgTemplate: string) => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
    return getHintExplanationStepsFromHintChunks(hintChunks, false)
}

export const transformURTypeFour = ({
    rawHint: ur,
    notesData,
    smartHintsColorSystem
}: URTransformerArgs): TransformedRawHint => {
    return {
        type: 'UNIQUE_RECTANGLE',
        hasTryOut: true,
        title: 'Unique Rectangle-4', // this is not reflected

        cellsToFocusData: getCellsToFocusData(ur as UniqueRectangleTypeFourRawHint, notesData, smartHintsColorSystem),
        focusedCells: getCellsToFocus(ur as UniqueRectangleTypeFourRawHint),
        steps: getHintExplanationText(ur as UniqueRectangleTypeFourRawHint, notesData),
        // cellsToFocusData: getCellsToFocusData(wWing, notesData, smartHintsColorSystem),
        // focusedCells,
        // applyHint: getApplyHintData(wWing),
        // tryOutAnalyserData: {
        //     wWing,
        // },
        // removableNotes: { [wWing.removableNote]: wWing.removableNoteHostCells },
        // inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(wWing.nakedPairNotes) as InputPanelVisibleNumbers,
        // clickableCells: _cloneDeep(focusedCells),
        // unclickableCellClickInTryOutMsg: 'you can only select the cells which are highlighted here.',
    }
}
