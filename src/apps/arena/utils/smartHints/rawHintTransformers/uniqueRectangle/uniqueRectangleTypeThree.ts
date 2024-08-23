import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _filter from '@lodash/filter'
import _difference from '@lodash/difference'

import { CellAndRemovableNotes, URTransformerArgs, UniqueRectangleTypeThreeRawHint } from '../../types/uniqueRectangle'

import { TransformedRawHint, CellsFocusData, SmartHintsColorSystem } from '../../types'
import _map from '@lodash/map'
import { getCandidatesListText, getHintExplanationStepsFromHintChunks, setCellBGColor, setCellNotesColor } from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { getCellAxesValues } from '@domain/board/utils/housesAndCells'
import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS } from '../../stringLiterals'
import { UR_TYPES } from '../../uniqueRectangle/constants'
import { getCellsAxesValuesListText } from '../helpers'
import { getURHostCellsWithExtraCandidates, getExtraNotesInURCell } from './helpers'
import { getCellsDifference } from '../../../util'
import { getLinkHTMLText } from 'src/apps/hintsVocabulary/vocabExplainations/utils'
import { HINTS_VOCAB_IDS } from '../constants'

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
    const ngCellsOutsideURHostCells = getCellsDifference(ur.nakedPairCells, ur.hostCells)
    const msgPlaceholdersValues = {
        ngCandidates: getCandidatesListText(ur.nakedPairNotes, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR),
        cellsWithExtraCandidates: getCellsAxesValuesListText(cellsWithExtraCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        urHostCells: getCellsAxesValuesListText(ur.hostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        urNotes: getCandidatesListText(ur.urNotes, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),

        firstCellWithExtraCandidates: getCellAxesValues(cellsWithExtraCandidates[0]),
        firstCellExtraCandidates: getCandidatesListText(getExtraNotesInURCell(ur, cellsWithExtraCandidates[0], notes), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR),
        secondCellWithExtraCandidates: getCellAxesValues(cellsWithExtraCandidates[1]),
        secondCellExtraCandidates: getCandidatesListText(getExtraNotesInURCell(ur, cellsWithExtraCandidates[1], notes), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR),
        firstNGCells: getCellsAxesValuesListText([...ngCellsOutsideURHostCells, cellsWithExtraCandidates[0]]),
        secondNGCells: getCellsAxesValuesListText([...ngCellsOutsideURHostCells, cellsWithExtraCandidates[1]]),
        ngHintText: ngCellsOutsideURHostCells.length === 1 ? getLinkHTMLText(HINTS_VOCAB_IDS.NAKED_DOUBLE, 'Naked Double')
            : getLinkHTMLText(HINTS_VOCAB_IDS.NAKED_TRIPPLE, 'Naked Tripple'),

        firstURNote: ur.urNotes[0],
        secondURNote: ur.urNotes[1],
        firstHostCell: getCellAxesValues(ur.hostCells[0]),
        secondHostCell: getCellAxesValues(ur.hostCells[1]),
        thirdHostCell: getCellAxesValues(ur.hostCells[2]),
        fourthHostCell: getCellAxesValues(ur.hostCells[3])
    }

    const msgTemplates = HINT_EXPLANATION_TEXTS[HINTS_IDS.UNIQUE_RECTANGLE][UR_TYPES.TYPE_THREE]
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
        title: 'Unique Rectangle-3',
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
