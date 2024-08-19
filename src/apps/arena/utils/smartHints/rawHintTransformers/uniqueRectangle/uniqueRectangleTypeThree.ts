import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _filter from '@lodash/filter'
import _difference from '@lodash/difference'

import { BaseURRawHint, CellAndRemovableNotes, URTransformerArgs, UniqueRectangleTypeThreeRawHint } from '../../types/uniqueRectangle'

import { TransformedRawHint, CellsFocusData, SmartHintsColorSystem } from '../../types'
import _map from '@lodash/map'
import { getHintExplanationStepsFromHintChunks, setCellBGColor, setCellNotesColor } from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { getCellAxesValues } from '@domain/board/utils/housesAndCells'
import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS } from '../../stringLiterals'
import { UR_TYPES } from '../../uniqueRectangle/constants'
import { getCellsAxesValuesListText } from '../helpers'
import { getURHostCellsWithExtraCandidates, getExtraNotesInURCells } from './helpers'

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

const getHintExplanationText = (ur: UniqueRectangleTypeThreeRawHint, notes: Notes) => {
    const cellsWithExtraCandidates = getURHostCellsWithExtraCandidates(ur, notes)
    const msgPlaceholdersValues = {
        extraNote: getExtraNotesInURCells(ur, notes)[0],
        urHostCellsList: getCellsAxesValuesListText(ur.hostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        cellsWithExtraCandidateList: getCellsAxesValuesListText(cellsWithExtraCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR),
        firstURNote: ur.urNotes[0],
        secondURNote: ur.urNotes[1],
        firstHostCell: getCellAxesValues(ur.hostCells[0]),
        secondHostCell: getCellAxesValues(ur.hostCells[1]),
        thirdHostCell: getCellAxesValues(ur.hostCells[2]),
        fourthHostCell: getCellAxesValues(ur.hostCells[3])
    }

    const msgTemplates = HINT_EXPLANATION_TEXTS[HINTS_IDS.UNIQUE_RECTANGLE][UR_TYPES.TYPE_TWO]
    const hintChunks = msgTemplates.map((msgTemplate: string) => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
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
    smartHintsColorSystem
}: URTransformerArgs): TransformedRawHint => {
    const ur = _ur as UniqueRectangleTypeThreeRawHint
    return {
        hasTryOut: false,
        steps: getHintExplanationText(ur, notesData),
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
