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

import {
    HINTS_IDS, HOUSE_TYPE, HOUSE_TYPE_VS_FULL_NAMES,
} from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { getCellAxesValues, getNoteHostCellsInHouse } from '../../../util'

import { getHouseNumAndName, getHouseNumText } from '../helpers'
import {
    getHintExplanationStepsFromHintChunks,
    setCellDataInHintResult,
    getTryOutInputPanelNumbersVisibility,
    transformCellBGColor,
} from '../../util'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { EmptyRectangleTransformerArgs } from './types'
import {
    CellHighlightData, CellsFocusData, NotesRemovalHintAction, SmartHintsColorSystem, TransformedRawHint,
} from '../../types'

import { EmptyRectangleRawHint } from '../../emptyRectangle/types'
import { HOUSE_TYPE_VS_VOCAB_ID } from '../constants'
import { getLinkHTMLText } from 'src/apps/hintsVocabulary/vocabExplainations/utils'
import { getBlockHostHouse } from '../../emptyRectangle/helpers'

// TODO: colors are copied from XY-Chain hint
// put them in theme object
const CELLS_NOTES_COLORS = {
    CONJUGATE_HOUSE: 'green',
    BLOCK_HOST_HOUSE: '#4B61D1'
}

// TODO: make it an independent util
const highlightNoteInCellsWithGivenColor = (
    note: NoteValue,
    cells: Cell[],
    fontColor: string,
    smartHintsColorSystem: SmartHintsColorSystem,
    cellsToFocusData: CellsFocusData
) => {
    cells.forEach((cell) => {
        const cellHighlightData: CellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        cellHighlightData.notesToHighlightData = {
            [note]: { fontColor }
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
}

const getCellsToFocusData = (
    emptyRectangle: EmptyRectangleRawHint,
    notes: Notes,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const cellsToFocusData: CellsFocusData = {}

    highlightNoteInCellsWithGivenColor(
        emptyRectangle.note,
        getNoteHostCellsInHouse(emptyRectangle.note, emptyRectangle.conjugateHouse, notes),
        CELLS_NOTES_COLORS.CONJUGATE_HOUSE,
        smartHintsColorSystem,
        cellsToFocusData
    )

    highlightNoteInCellsWithGivenColor(
        emptyRectangle.note,
        getNoteHostCellsInHouse(emptyRectangle.note, getBlockHostHouse(emptyRectangle), notes),
        CELLS_NOTES_COLORS.BLOCK_HOST_HOUSE,
        smartHintsColorSystem,
        cellsToFocusData
    )

    highlightNoteInCellsWithGivenColor(
        emptyRectangle.note,
        [emptyRectangle.removableNotesHostCell],
        smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem),
        smartHintsColorSystem,
        cellsToFocusData
    )

    return cellsToFocusData
}

const getApplyHintData = (emptyRectangle: EmptyRectangleRawHint) => {
    const result: NotesRemovalHintAction[] = []

    result.push({
        cell: emptyRectangle.removableNotesHostCell,
        action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [emptyRectangle.note] },
    })

    return result
}

const getHintExplanationText = (emptyRectangle: EmptyRectangleRawHint) => {
    const { conjugateHouse } = emptyRectangle

    const msgTemplates = HINT_EXPLANATION_TEXTS.EMPTY_RECTANGLE

    const blockHostHouse = getBlockHostHouse(emptyRectangle)

    const conjugateHouseWithHouseTypeLink = `${getHouseNumText(conjugateHouse)} ${getLinkHTMLText(HOUSE_TYPE_VS_VOCAB_ID[conjugateHouse.type], HOUSE_TYPE_VS_FULL_NAMES[conjugateHouse.type].FULL_NAME)}`
    const hostBlockHouseWithHouseTypeLink = `${getHouseNumText(blockHostHouse)} ${getLinkHTMLText(HOUSE_TYPE_VS_VOCAB_ID[blockHostHouse.type], HOUSE_TYPE_VS_FULL_NAMES[blockHostHouse.type].FULL_NAME)}`
    const msgPlaceholdersValues = {
        candidate: emptyRectangle.note,
        conjugateHouseWithHouseTypeLink,
        hostBlockHouseWithHouseTypeLink,
        conjugateHouse: getHouseNumAndName(emptyRectangle.conjugateHouse),
        hostBlockHouse: getHouseNumAndName(blockHostHouse),
        removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell)
    }

    const hintChunks = msgTemplates.map((msgTemplate: string) => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
    return getHintExplanationStepsFromHintChunks(hintChunks)
}

export const transformEmptyRectangleRawHint = ({
    rawHint: emptyRectangle,
    mainNumbers,
    notesData,
    smartHintsColorSystem,
}: EmptyRectangleTransformerArgs): TransformedRawHint => {

    const focusedCells = [
        ...getNoteHostCellsInHouse(emptyRectangle.note, emptyRectangle.conjugateHouse, notesData),
        ...getNoteHostCellsInHouse(emptyRectangle.note, getBlockHostHouse(emptyRectangle), notesData),
        emptyRectangle.removableNotesHostCell
    ]

    return {
        type: HINTS_IDS.EMPTY_RECTANGLE,
        hasTryOut: true,
        title: HINT_ID_VS_TITLES[HINTS_IDS.EMPTY_RECTANGLE],
        steps: getHintExplanationText(emptyRectangle),
        cellsToFocusData: getCellsToFocusData(emptyRectangle, notesData, smartHintsColorSystem),
        focusedCells,
        applyHint: getApplyHintData(emptyRectangle),
        tryOutAnalyserData: {
            emptyRectangle,
        },
        removableNotes: { [emptyRectangle.note]: [emptyRectangle.removableNotesHostCell] },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility([emptyRectangle.note]) as InputPanelVisibleNumbers,
        clickableCells: _cloneDeep(focusedCells),
        unclickableCellClickInTryOutMsg: 'you can only select the cells which are highlighted here.',
    }
}
