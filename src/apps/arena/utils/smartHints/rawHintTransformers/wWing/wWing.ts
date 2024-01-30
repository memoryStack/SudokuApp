import _cloneDeep from '@lodash/cloneDeep'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _isEmpty from '@lodash/isEmpty'
import _filter from '@lodash/filter'
import _unique from '@lodash/unique'
import _sortNumbers from '@lodash/sortNumbers'

import _sortBy from '@lodash/sortBy'
import _difference from '@lodash/difference'

import _isNil from '@lodash/isNil'
import _intersection from '@lodash/intersection'

import { HINTS_IDS } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { areSameColCells, areSameRowCells, getCellAxesValues, getNoteHostCellsInHouse } from '../../../util'

import { getCellsAxesValuesListText, getHouseNumAndName } from '../helpers'
import {
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    highlightNoteInCellsWithGivenColor,
} from '../../util'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import smartHintColorSystemReader from '../../colorSystem.reader'
import {
    CellsFocusData, NotesRemovalHintAction, SmartHintsColorSystem, TransformedRawHint,
} from '../../types'

import { WWingTransformerArgs } from './types'
import { WWingRawHint } from '../../wWing/types'

const CELLS_NOTES_COLORS = {
    CONJUGATE_HOUSE_NOTE: '#4B61D1',
    NAKED_PAIR_OTHER_NOTE: 'green'
}

const getConjugateHouseAndNakedPairCellsPairing = (wWing: WWingRawHint, notes: Notes) => {
    const result: { [conjugateHouseCell: string]: string } = {}
    const conjugateHouseCells = getNoteHostCellsInHouse(wWing.conjugateNote, wWing.conjugateHouse, notes)

    const cellsPairing = conjugateHouseCells.map((conjguateHouseCell) => {
        const nakedPairCellSharingLinearHouse = wWing.nakedPairCells.find((nakedPairCell) => {
            const cells = [conjguateHouseCell, nakedPairCell]
            return areSameColCells(cells) || areSameRowCells(cells)
        })
        return [conjguateHouseCell, nakedPairCellSharingLinearHouse]
    })

    cellsPairing.forEach(([conjugateHouseCell, nakedPairCell]) => {
        if (!_isNil(conjugateHouseCell) && !_isNil(nakedPairCell)) {
            result[getCellAxesValues(conjugateHouseCell as Cell)] = getCellAxesValues(nakedPairCell as Cell)
        }
    })

    return result
}

const getHintExplanationText = (wWing: WWingRawHint, notes: Notes) => {
    const conjugateHouseCellsAndNakedPairCellsPairing = getConjugateHouseAndNakedPairCellsPairing(wWing, notes)
    const conjugateHouseCellsKeys = Object.keys(conjugateHouseCellsAndNakedPairCellsPairing)
    const firstConjugateHouseCell = conjugateHouseCellsKeys[0]
    const secondConjugateHouseCell = conjugateHouseCellsKeys[1]



    const msgTemplates = HINT_EXPLANATION_TEXTS.W_WING
    const msgPlaceholdersValues = {
        conjguateHouse: getHouseNumAndName(wWing.conjugateHouse),
        conjugateHouseNote: wWing.conjugateNote,
        nakedPairHostCells: getCellsAxesValuesListText(wWing.nakedPairCells),
        removableNote: wWing.removableNote,
        firstConjugateHouseCell,
        secondConjugateHouseCell,
        firstNakedPairHostCell: conjugateHouseCellsAndNakedPairCellsPairing[firstConjugateHouseCell],
        secondNakedPairHostCell: conjugateHouseCellsAndNakedPairCellsPairing[secondConjugateHouseCell],
    }
    const hintChunks = msgTemplates.map((msgTemplate: string) => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
    return getHintExplanationStepsFromHintChunks(hintChunks)
}

const getCellsToFocusData = (
    wWing: WWingRawHint,
    notes: Notes,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const cellsToFocusData: CellsFocusData = {}

    highlightNoteInCellsWithGivenColor(
        wWing.conjugateNote,
        getNoteHostCellsInHouse(wWing.conjugateNote, wWing.conjugateHouse, notes),
        CELLS_NOTES_COLORS.CONJUGATE_HOUSE_NOTE,
        smartHintsColorSystem,
        cellsToFocusData
    )

    highlightNoteInCellsWithGivenColor(
        wWing.removableNote,
        wWing.nakedPairCells,
        CELLS_NOTES_COLORS.NAKED_PAIR_OTHER_NOTE,
        smartHintsColorSystem,
        cellsToFocusData
    )

    highlightNoteInCellsWithGivenColor(
        wWing.conjugateNote,
        wWing.nakedPairCells,
        CELLS_NOTES_COLORS.CONJUGATE_HOUSE_NOTE,
        smartHintsColorSystem,
        cellsToFocusData
    )

    highlightNoteInCellsWithGivenColor(
        wWing.removableNote,
        wWing.removableNoteHostCells,
        smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem),
        smartHintsColorSystem,
        cellsToFocusData
    )

    return cellsToFocusData
}

const getApplyHintData = (wWing: WWingRawHint) => {
    const result: NotesRemovalHintAction[] = []

    _forEach(wWing.removableNoteHostCells, (cell: Cell) => {
        result.push({
            cell,
            action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [wWing.removableNote] },
        })
    })

    return result
}

export const transformWWingRawHint = ({
    rawHint: wWing,
    notesData,
    smartHintsColorSystem,
}: WWingTransformerArgs): TransformedRawHint => {
    const focusedCells = [
        ...wWing.nakedPairCells,
        ...wWing.removableNoteHostCells,
        ...getNoteHostCellsInHouse(wWing.conjugateNote, wWing.conjugateHouse, notesData),
    ]

    return {
        type: HINTS_IDS.W_WING,
        hasTryOut: true,
        title: HINT_ID_VS_TITLES[HINTS_IDS.W_WING],
        steps: getHintExplanationText(wWing, notesData),
        cellsToFocusData: getCellsToFocusData(wWing, notesData, smartHintsColorSystem),
        focusedCells,
        applyHint: getApplyHintData(wWing),
        tryOutAnalyserData: {
            wWing,
        },
        removableNotes: { [wWing.removableNote]: wWing.removableNoteHostCells },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(wWing.nakedPairNotes) as InputPanelVisibleNumbers,
        clickableCells: _cloneDeep(focusedCells),
        unclickableCellClickInTryOutMsg: 'you can only select the cells which are highlighted here.',
    }
}
