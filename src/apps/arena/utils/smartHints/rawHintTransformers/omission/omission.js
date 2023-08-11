import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _map from '@lodash/map'

import { NotesRecord } from '../../../../RecordUtilities/boardNotes'
import { getHouseCells } from '../../../houseCells'
import { isCellExists } from '../../../util'

import {
    HINTS_IDS,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
    HOUSE_TYPE_VS_FULL_NAMES,
} from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { getCellsAxesValuesListText } from '../helpers'
import { setCellDataInHintResult, transformCellBGColor } from '../../util'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import smartHintColorSystemReader from '../../colorSystem.reader'

const addHostHouseHighlightData = (omission, cellsToFocusData, smartHintsColorSystem) => {
    const { hostHouse, note, hostCells } = omission

    getHouseCells(hostHouse).forEach(cell => {
        const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        if (isCellExists(cell, hostCells)) {
            cellHighlightData.notesToHighlightData = {
                [note]: { fontColor: smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem) },
            }
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
}

const addRemovableNotesHouseHighlightData = (omission, notesData, cellsToFocusData, smartHintsColorSystem) => {
    const { removableNotesHostHouse, note, hostCells } = omission
    // not filtering out the cells which are highlighted by hostHouse already
    // becoz won't make a difference
    const cellsToHighlight = getHouseCells(removableNotesHostHouse).filter(cell => !isCellExists(cell, hostCells))

    cellsToHighlight.forEach(cell => {
        const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        if (NotesRecord.isNotePresentInCell(notesData, note, cell)) {
            cellHighlightData.notesToHighlightData = {
                [note]: { fontColor: smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem) },
            }
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
}

const getUICellsToFocusData = (omission, notesData, smartHintsColorSystem) => {
    const cellsToFocusData = {}
    addHostHouseHighlightData(omission, cellsToFocusData, smartHintsColorSystem)
    addRemovableNotesHouseHighlightData(omission, notesData, cellsToFocusData, smartHintsColorSystem)
    return cellsToFocusData
}

export const getHouseNoteHostCells = (note, house, notes) => getHouseCells(house)
    .filter(cell => NotesRecord.isNotePresentInCell(notes, note, cell))

const getRemovableNotesHostCells = (omission, notes) => {
    const { note, hostHouse, removableNotesHostHouse } = omission
    const hostHouseHostCells = getHouseNoteHostCells(note, hostHouse, notes)
    return getHouseNoteHostCells(note, removableNotesHostHouse, notes).filter(
        cell => !isCellExists(cell, hostHouseHostCells),
    )
}

// extract it out if this func is needed
// at other places as well
const getHintExplaination = (omission, notes) => {
    const { hostHouse, note } = omission
    const hostHouseHostCells = getHouseNoteHostCells(note, hostHouse, notes)

    const hostHouseHostCellsListText = getCellsAxesValuesListText(
        hostHouseHostCells,
        HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
    )

    const msgPlaceholdersValues = {
        note,
        hostHouseFullName: HOUSE_TYPE_VS_FULL_NAMES[hostHouse.type].FULL_NAME,
        hostHouseHostCellsListText,
        removableNotesHostCellsListText: getCellsAxesValuesListText(getRemovableNotesHostCells(omission, notes)),
    }

    const msgTemplate = HINT_EXPLANATION_TEXTS[HINTS_IDS.OMISSION]
    return dynamicInterpolation(msgTemplate, msgPlaceholdersValues)
}

const getApplyHintData = (omission, notes) => {
    const removableNotesHostCells = getRemovableNotesHostCells(omission, notes)
    return _map(removableNotesHostCells, cell => ({
        cell,
        action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [omission.note] },
    }))
}

export const transformOmissionRawHint = ({ rawHint: omission, notesData, smartHintsColorSystem }) => ({
    cellsToFocusData: getUICellsToFocusData(omission, notesData, smartHintsColorSystem),
    title: HINT_ID_VS_TITLES[HINTS_IDS.OMISSION],
    steps: [{ text: getHintExplaination(omission, notesData) }],
    applyHint: getApplyHintData(omission, notesData),
})
