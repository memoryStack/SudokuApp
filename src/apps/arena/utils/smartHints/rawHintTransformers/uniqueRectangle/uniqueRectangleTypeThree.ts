import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'

import { CellAndRemovableNotes, URTransformerArgs, UniqueRectangleTypeThreeRawHint } from '../../types/uniqueRectangle'

import { TransformedRawHint, CellsFocusData, SmartHintsColorSystem, SmartHintsTranslationsTexts } from '../../types'
import { getAxisValuesFromTranslations, getCandidatesListText, getHintExplanationStepsFromHintChunks, setCellBGColor, setCellNotesColor } from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { HINTS_IDS } from '../../constants'
import { UR_TYPES } from '../../uniqueRectangle/constants'
import { getCellsAxesValuesListText } from '../helpers'
import { getURHostCellsWithExtraCandidates, getExtraNotesInURCell } from './helpers'
import { getCellsDifference, getCellAxesValues } from '../../../util'

const getCellsToFocusData = (
    ur: UniqueRectangleTypeThreeRawHint,
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
    _forEach(ur.nakedPairCells, (cell: Cell) => {
        setCellNotesColor(cell, ur.nakedPairNotes, smartHintColorSystemReader.urTypeThreeNPNotes(smartHintsColorSystem), cellsToFocusData)
    })

    return cellsToFocusData
}

const getHintExplanationText = (
    ur: UniqueRectangleTypeThreeRawHint,
    notes: Notes,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts
) => {
    const { texts, ngHintTexts } = smartHintsTranslationsTexts.explanation[HINTS_IDS.UNIQUE_RECTANGLE][UR_TYPES.TYPE_THREE]
    const axesValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const { conjugations } = smartHintsTranslationsTexts.common

    const cellsWithExtraCandidates = getURHostCellsWithExtraCandidates(ur, notes)
    const ngCellsOutsideURHostCells = getCellsDifference(ur.nakedPairCells, ur.hostCells)

    const msgPlaceholdersValues = {
        ngCandidates: getCandidatesListText(ur.nakedPairNotes, conjugations.or),
        cellsWithExtraCandidates: getCellsAxesValuesListText(cellsWithExtraCandidates, conjugations.and, axesValues),
        urHostCells: getCellsAxesValuesListText(ur.hostCells, conjugations.and, axesValues),
        urNotes: getCandidatesListText(ur.urNotes, conjugations.and),

        firstCellWithExtraCandidates: getCellAxesValues(cellsWithExtraCandidates[0], axesValues),
        firstCellExtraCandidates: getCandidatesListText(getExtraNotesInURCell(ur, cellsWithExtraCandidates[0], notes), conjugations.or),
        secondCellWithExtraCandidates: getCellAxesValues(cellsWithExtraCandidates[1], axesValues),
        secondCellExtraCandidates: getCandidatesListText(getExtraNotesInURCell(ur, cellsWithExtraCandidates[1], notes), conjugations.or),
        firstNGCells: getCellsAxesValuesListText([...ngCellsOutsideURHostCells, cellsWithExtraCandidates[0]], undefined, axesValues),
        secondNGCells: getCellsAxesValuesListText([...ngCellsOutsideURHostCells, cellsWithExtraCandidates[1]], undefined, axesValues),
        ngHintText: ngCellsOutsideURHostCells.length === 1 ? ngHintTexts.nakedDouble : ngHintTexts.nakedTripple,

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

const getCellsToFocus = (ur: UniqueRectangleTypeThreeRawHint) => {
    let result: Cell[] = []

    result = [...ur.hostCells, ...ur.nakedPairCells]
    _forEach(ur.cellAndRemovableNotes, ({ cell }: CellAndRemovableNotes) => {
        result.push(cell)
    })

    return result
}

export const transformURTypeThree = ({
    rawHint: _ur,
    notesData,
    smartHintsColorSystem,
    smartHintsTranslationsTexts
}: URTransformerArgs): TransformedRawHint => {
    const ur = _ur as UniqueRectangleTypeThreeRawHint
    const generalTitleText = smartHintsTranslationsTexts.title[HINTS_IDS.UNIQUE_RECTANGLE]
    return {
        title: `${generalTitleText}-3`,
        hasTryOut: false,
        steps: getHintExplanationText(ur, notesData, smartHintsTranslationsTexts),
        cellsToFocusData: getCellsToFocusData(ur, smartHintsColorSystem),
        focusedCells: getCellsToFocus(ur as UniqueRectangleTypeThreeRawHint),
        // tryOutAnalyserData: {
        //     wWing,
        // },
        // removableNotes: getRemovableNotesVsHostCells(ur), // how it's used ??
        // inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(wWing.nakedPairNotes) as InputPanelVisibleNumbers,
        // clickableCells: _cloneDeep(focusedCells),
        // unclickableCellClickInTryOutMsg: 'you can only select the cells which are highlighted here.',
    }
}
