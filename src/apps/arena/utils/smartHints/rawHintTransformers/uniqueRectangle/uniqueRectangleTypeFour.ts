import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'

import { CellAndRemovableNotes, URTransformerArgs, UniqueRectangleTypeFourRawHint } from '../../types/uniqueRectangle'

import { TransformedRawHint, CellsFocusData, SmartHintsColorSystem, SmartHintsTranslationsTexts } from '../../types'
import { getAxisValuesFromTranslations, getCandidatesListText, getHintExplanationStepsFromHintChunks, getHouseWithNumAndNameText, setCellBGColor, setCellNotesColor } from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { HINTS_IDS } from '../../constants'
import { UR_TYPES } from '../../uniqueRectangle/constants'
import { getCellsAxesValuesListText } from '../helpers'
import { getURHostCellsWithExtraCandidates, getExtraNotesInURCells, getURHostCellsHavingURNotesOnly } from './helpers'
import { getCellAxesValues } from '../../../util'

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

const getHintExplanationText = (
    ur: UniqueRectangleTypeFourRawHint,
    notes: Notes,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts
) => {
    const { texts, config } = smartHintsTranslationsTexts.explanation[HINTS_IDS.UNIQUE_RECTANGLE][UR_TYPES.TYPE_FOUR]
    const axesValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const { conjugations } = smartHintsTranslationsTexts.common

    const cellsWithExtraCandidates = getURHostCellsWithExtraCandidates(ur, notes)
    const msgPlaceholdersValues = {
        extraNote: getExtraNotesInURCells(ur, notes)[0],
        omissonNote: ur.urNoteOmission.note,
        removableNote: ur.removableURNote,
        cellsWithExtraCandidatesOrConcat: getCellsAxesValuesListText(cellsWithExtraCandidates, conjugations.or, axesValues),
        cellsWithExtraCandidatesAndConcat: getCellsAxesValuesListText(cellsWithExtraCandidates, conjugations.and, axesValues),
        cellsHavingOnlyURNotes: getCellsAxesValuesListText(getURHostCellsHavingURNotesOnly(ur, notes), conjugations.and, axesValues),
        omissionHostHouse: getHouseWithNumAndNameText(
            ur.urNoteOmission.house,
            config.houseNumAndName,
            smartHintsTranslationsTexts
        ),
        firstURNote: ur.urNotes[0],
        secondURNote: ur.urNotes[1],
        firstHostCell: getCellAxesValues(ur.hostCells[0], axesValues),
        secondHostCell: getCellAxesValues(ur.hostCells[1], axesValues),
        thirdHostCell: getCellAxesValues(ur.hostCells[2], axesValues),
        fourthHostCell: getCellAxesValues(ur.hostCells[3], axesValues)
    }

    const hintChunks = texts.map((msgTemplate: string) => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
    return getHintExplanationStepsFromHintChunks(hintChunks, false)
}

export const transformURTypeFour = ({
    rawHint: ur,
    notesData,
    smartHintsColorSystem,
    smartHintsTranslationsTexts
}: URTransformerArgs): TransformedRawHint => {
    const generalTitleText = smartHintsTranslationsTexts.title[HINTS_IDS.UNIQUE_RECTANGLE]
    return {
        type: 'UNIQUE_RECTANGLE',
        hasTryOut: true,
        title: `${generalTitleText}-4`,

        cellsToFocusData: getCellsToFocusData(ur as UniqueRectangleTypeFourRawHint, notesData, smartHintsColorSystem),
        focusedCells: getCellsToFocus(ur as UniqueRectangleTypeFourRawHint),
        steps: getHintExplanationText(ur as UniqueRectangleTypeFourRawHint, notesData, smartHintsTranslationsTexts),
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
