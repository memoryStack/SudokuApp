import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _map from '@lodash/map'

import { getLinkHTMLText } from 'src/apps/hintsVocabulary/vocabExplainations/utils'
import { NotesRecord } from '@domain/board/records/notesRecord'
import { getHouseCells } from '@domain/board/utils/housesAndCells'
import { isCellExists } from '../../../util'

import {
    HINTS_IDS,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
    HOUSE_TYPE_VS_FULL_NAMES,
} from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { getCellsAxesValuesListText, getHouseNumText } from '../helpers'
import { getAxisValuesFromTranslations, getLanguageSpecificHouseNumText, getLanguageSpecificHouseTypeText, setCellDataInHintResult, transformCellBGColor } from '../../util'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { OmissionTransformerArgs } from './types'
import { RawOmissionHint } from '../../omission/types'
import {
    CellHighlightData, CellsFocusData, NotesRemovalHintAction, SmartHintsColorSystem, SmartHintsTranslationsTexts, TransformedRawHint,
} from '../../types'
import { HOUSE_TYPE_VS_VOCAB_ID } from '../constants'
import { formatMessage } from '@utils/util'

const addHostHouseHighlightData = (
    omission: RawOmissionHint,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const { hostHouse, note, hostCells } = omission

    getHouseCells(hostHouse).forEach(cell => {
        const cellHighlightData: CellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        if (isCellExists(cell, hostCells)) {
            cellHighlightData.notesToHighlightData = {
                [note]: { fontColor: smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem) },
            }
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
}

const addRemovableNotesHouseHighlightData = (
    omission: RawOmissionHint,
    notesData: Notes,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const { removableNotesHostHouse, note, hostCells } = omission
    // not filtering out the cells which are highlighted by hostHouse already
    // becoz won't make a difference
    const cellsToHighlight = getHouseCells(removableNotesHostHouse).filter(cell => !isCellExists(cell, hostCells))

    cellsToHighlight.forEach(cell => {
        const cellHighlightData: CellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        if (NotesRecord.isNotePresentInCell(notesData, note, cell)) {
            cellHighlightData.notesToHighlightData = {
                [note]: { fontColor: smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem) },
            }
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
}

const getUICellsToFocusData = (omission: RawOmissionHint, notesData: Notes, smartHintsColorSystem: SmartHintsColorSystem) => {
    const cellsToFocusData: CellsFocusData = {}
    addHostHouseHighlightData(omission, cellsToFocusData, smartHintsColorSystem)
    addRemovableNotesHouseHighlightData(omission, notesData, cellsToFocusData, smartHintsColorSystem)
    return cellsToFocusData
}

export const getHouseNoteHostCells = (note: NoteValue, house: House, notes: Notes) => getHouseCells(house)
    .filter(cell => NotesRecord.isNotePresentInCell(notes, note, cell))

const getRemovableNotesHostCells = (omission: RawOmissionHint, notes: Notes) => {
    const { note, hostHouse, removableNotesHostHouse } = omission
    const hostHouseHostCells = getHouseNoteHostCells(note, hostHouse, notes)
    return getHouseNoteHostCells(note, removableNotesHostHouse, notes).filter(
        cell => !isCellExists(cell, hostHouseHostCells),
    )
}

// extract it out if this func is needed
// at other places as well
const getHintExplaination = (
    omission: RawOmissionHint,
    notes: Notes,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts
) => {
    const { hostHouse, note, removableNotesHostHouse } = omission
    const hostHouseHostCells = getHouseNoteHostCells(note, hostHouse, notes)

    const hostHouseHostCellsListText = getCellsAxesValuesListText(
        hostHouseHostCells,
        smartHintsTranslationsTexts.common.conjugations.and,
        getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    )

    const {
        text,
        config,
    } = smartHintsTranslationsTexts.explanation[HINTS_IDS.OMISSION]

    console.log('@@@@@@ removableNotesHostHouse.type', text)

    const msgPlaceholdersValues = {
        note,
        hostHouseFullName: getLinkHTMLText(
            HOUSE_TYPE_VS_VOCAB_ID[hostHouse.type],
            getLanguageSpecificHouseTypeText(hostHouse.type, config.hostHouseFullName, smartHintsTranslationsTexts)
        ),
        hostHouseHostCellsListText,
        houseNum_one: getLanguageSpecificHouseNumText(
            removableNotesHostHouse,
            config.houseNum_one,
            smartHintsTranslationsTexts
        ),
        houseName_one: getLanguageSpecificHouseTypeText(
            removableNotesHostHouse.type,
            config.houseName_one as any,
            smartHintsTranslationsTexts
        ),
        houseType_one: removableNotesHostHouse.type,
        removableNotesHostCellsListText: getCellsAxesValuesListText(
            getRemovableNotesHostCells(omission, notes),
            smartHintsTranslationsTexts.common.conjugations.and,
            getAxisValuesFromTranslations(smartHintsTranslationsTexts)
        ),
    }

    return formatMessage(
        dynamicInterpolation(text, msgPlaceholdersValues),
        msgPlaceholdersValues
    )
}

const getApplyHintData = (omission: RawOmissionHint, notes: Notes): NotesRemovalHintAction[] => {
    const removableNotesHostCells = getRemovableNotesHostCells(omission, notes)
    return _map(removableNotesHostCells, (cell: Cell) => ({
        cell,
        action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [omission.note] },
    }))
}

export const transformOmissionRawHint = ({
    rawHint: omission,
    notesData,
    smartHintsColorSystem,
    smartHintsTranslationsTexts,
}: OmissionTransformerArgs): TransformedRawHint => ({
    type: HINTS_IDS.OMISSION,
    cellsToFocusData: getUICellsToFocusData(omission, notesData, smartHintsColorSystem),
    title: smartHintsTranslationsTexts.title[HINTS_IDS.OMISSION],
    steps: [{ text: getHintExplaination(omission, notesData, smartHintsTranslationsTexts) }],
    applyHint: getApplyHintData(omission, notesData),
})
