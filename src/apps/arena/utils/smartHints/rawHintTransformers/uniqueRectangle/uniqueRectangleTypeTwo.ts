import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'

import { BaseURRawHint, CellAndRemovableNotes, URTransformerArgs } from '../../types/uniqueRectangle'

import { TransformedRawHint, CellsFocusData, SmartHintsColorSystem, SmartHintsTranslationsTexts } from '../../types'
import { getAxisValuesFromTranslations, getCandidatesListText, getHintExplanationStepsFromHintChunks, setCellBGColor, setCellNotesColor } from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { HINTS_IDS } from '../../constants'
import { UR_TYPES } from '../../uniqueRectangle/constants'
import { getCellsAxesValuesListText } from '../helpers'
import { getURHostCellsWithExtraCandidates, getExtraNotesInURCells } from './helpers'
import { getCellAxesValues } from '../../../util'

const getCellsToFocusData = (
    ur: BaseURRawHint,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const cellsToFocusData: CellsFocusData = {}

    _forEach(getCellsToFocus(ur), (cell: Cell) => {
        setCellBGColor(cell, smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem), cellsToFocusData)
    })
    _forEach(ur.hostCells, (cell: Cell) => {
        setCellNotesColor(cell, ur.urNotes, smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem), cellsToFocusData)
    })
    _forEach(ur.cellAndRemovableNotes, ({ cell, notes }: CellAndRemovableNotes) => {
        setCellNotesColor(cell, notes, smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem), cellsToFocusData)
    })

    return cellsToFocusData
}

const getHintExplanationText = (
    ur: BaseURRawHint,
    notes: Notes,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts
) => {
    const typeTwoTexts = smartHintsTranslationsTexts.explanation[HINTS_IDS.UNIQUE_RECTANGLE][UR_TYPES.TYPE_TWO]
    const axesValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const { conjugations } = smartHintsTranslationsTexts.common

    const cellsWithExtraCandidates = getURHostCellsWithExtraCandidates(ur, notes)
    const msgPlaceholdersValues = {
        extraNote: getExtraNotesInURCells(ur, notes)[0],
        urNotes: getCandidatesListText(ur.urNotes, conjugations.and),
        urHostCellsList: getCellsAxesValuesListText(ur.hostCells, conjugations.and, axesValues),
        cellsWithExtraCandidateList: getCellsAxesValuesListText(cellsWithExtraCandidates, conjugations.or, axesValues),
        firstURNote: ur.urNotes[0],
        secondURNote: ur.urNotes[1],
        firstHostCell: getCellAxesValues(ur.hostCells[0], axesValues),
        secondHostCell: getCellAxesValues(ur.hostCells[1], axesValues),
        thirdHostCell: getCellAxesValues(ur.hostCells[2], axesValues),
        fourthHostCell: getCellAxesValues(ur.hostCells[3], axesValues)
    }

    const hintChunks = typeTwoTexts.map((msgTemplate: string) => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
    return getHintExplanationStepsFromHintChunks(hintChunks, false)
}

const getCellsToFocus = (ur: BaseURRawHint) => {
    let result: Cell[] = []

    result = [...ur.hostCells]
    _forEach(ur.cellAndRemovableNotes, ({ cell }: CellAndRemovableNotes) => {
        result.push(cell)
    })

    return result
}

export const transformURTypeTwo = ({
    rawHint: ur,
    notesData,
    smartHintsColorSystem,
    smartHintsTranslationsTexts
}: URTransformerArgs): TransformedRawHint => {
    const generalTitleText = smartHintsTranslationsTexts.title[HINTS_IDS.UNIQUE_RECTANGLE]
    return {
        title: `${generalTitleText}-2`,
        hasTryOut: false,
        steps: getHintExplanationText(ur, notesData, smartHintsTranslationsTexts),
        cellsToFocusData: getCellsToFocusData(ur, smartHintsColorSystem),
        focusedCells: getCellsToFocus(ur),
        // tryOutAnalyserData: {
        //     wWing,
        // },
        // removableNotes: getRemovableNotesVsHostCells(ur), // how it's used ??
        // inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(wWing.nakedPairNotes) as InputPanelVisibleNumbers,
        // clickableCells: _cloneDeep(focusedCells),
        // unclickableCellClickInTryOutMsg: 'you can only select the cells which are highlighted here.',
    }
}
