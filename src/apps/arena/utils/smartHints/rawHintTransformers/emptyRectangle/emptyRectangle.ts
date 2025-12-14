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
    HINTS_IDS, HOUSE_TYPE_VS_FULL_NAMES,
} from '../../constants'
import { HINT_EXPLANATION_TEXTS } from '../../stringLiterals'
import { getCellAxesValues, getNoteHostCellsInHouse } from '../../../util'

import { getHouseNumAndName, getHouseNumText } from '../helpers'
import {
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    highlightNoteInCellsWithGivenColor,
    getAxisValuesFromTranslations,
    getLanguageSpecificHouseNumText,
    getLanguageSpecificHouseTypeText,
    getHouseWithNumAndNameText,
} from '../../util'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { EmptyRectangleTransformerArgs } from './types'
import {
    CellsFocusData, NotesRemovalHintAction, SmartHintsColorSystem, SmartHintsTranslationsTexts, TransformedRawHint,
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

const getHintExplanationText = (
    emptyRectangle: EmptyRectangleRawHint,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts,
) => {
    const { conjugateHouse } = emptyRectangle

    const { texts, config } = smartHintsTranslationsTexts.explanation[HINTS_IDS.EMPTY_RECTANGLE]

    const blockHostHouse = getBlockHostHouse(emptyRectangle)

    const axesValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)

    const msgPlaceholdersValues = {
        candidate: emptyRectangle.note,
        conjugateHouseNum: getLanguageSpecificHouseNumText(conjugateHouse, config.houseNumAndName.houseNum, smartHintsTranslationsTexts),
        conjugateHouseName:
            getLinkHTMLText(
                HOUSE_TYPE_VS_VOCAB_ID[conjugateHouse.type],
                getLanguageSpecificHouseTypeText(conjugateHouse.type, config.houseNumAndName.houseName, smartHintsTranslationsTexts)
            ),
        hostBlockHouseNum: getLanguageSpecificHouseNumText(blockHostHouse, config.houseNumAndName.houseNum, smartHintsTranslationsTexts),
        hostBlockHouseName: getLinkHTMLText(
            HOUSE_TYPE_VS_VOCAB_ID[blockHostHouse.type],
            getLanguageSpecificHouseTypeText(blockHostHouse.type, config.houseNumAndName.houseName, smartHintsTranslationsTexts)
        ),
        conjugateHouse: getHouseWithNumAndNameText(conjugateHouse, config.houseNumAndName, smartHintsTranslationsTexts),
        hostBlockHouse: getHouseWithNumAndNameText(blockHostHouse, config.houseNumAndName, smartHintsTranslationsTexts),

        removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell, axesValues)
    }

    const hintChunks = texts.map(({ text }: { text: string }) => dynamicInterpolation(text, msgPlaceholdersValues))
    return getHintExplanationStepsFromHintChunks(hintChunks)
}

export const transformEmptyRectangleRawHint = ({
    rawHint: emptyRectangle,
    mainNumbers,
    notesData,
    smartHintsColorSystem,
    smartHintsTranslationsTexts,
}: EmptyRectangleTransformerArgs): TransformedRawHint => {

    const focusedCells = [
        ...getNoteHostCellsInHouse(emptyRectangle.note, emptyRectangle.conjugateHouse, notesData),
        ...getNoteHostCellsInHouse(emptyRectangle.note, getBlockHostHouse(emptyRectangle), notesData),
        emptyRectangle.removableNotesHostCell
    ]

    return {
        type: HINTS_IDS.EMPTY_RECTANGLE,
        hasTryOut: true,
        title: smartHintsTranslationsTexts.title[HINTS_IDS.EMPTY_RECTANGLE],
        steps: getHintExplanationText(emptyRectangle, smartHintsTranslationsTexts),
        cellsToFocusData: getCellsToFocusData(emptyRectangle, notesData, smartHintsColorSystem),
        focusedCells,
        applyHint: getApplyHintData(emptyRectangle),
        tryOutAnalyserData: {
            emptyRectangle,
        },
        removableNotes: { [emptyRectangle.note]: [emptyRectangle.removableNotesHostCell] },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility([emptyRectangle.note]) as InputPanelVisibleNumbers,
        clickableCells: _cloneDeep(focusedCells),
        unclickableCellClickInTryOutMsg: smartHintsTranslationsTexts.tryOutAnalyser.unclickableCellClickedInTryOutMsg.clickAnyHighlightedCell
    }
}
