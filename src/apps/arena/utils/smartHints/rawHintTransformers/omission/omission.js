import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _map from '@lodash/map'

import { getHouseCells } from '../../../houseCells'
import { isCellExists, isCellNoteVisible } from '../../../util'

import {
    HINTS_IDS,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
    HOUSE_TYPE_VS_FULL_NAMES,
    SMART_HINTS_CELLS_BG_COLOR,
} from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { getCellsAxesValuesListText } from '../helpers'
import { setCellDataInHintResult } from '../../util'
import { BOARD_MOVES_TYPES } from '../../../../constants'

const COLORS = {
    CELL: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
    HOST_HOUSE_NOTE: 'green',
    REMOVABLE_NOTE: 'red',
}

const addHostHouseHighlightData = (omission, cellsToFocusData) => {
    const { hostHouse, note, hostCells } = omission

    getHouseCells(hostHouse).forEach(cell => {
        const cellHighlightData = { bgColor: COLORS.CELL }
        if (isCellExists(cell, hostCells)) {
            cellHighlightData.notesToHighlightData = {
                [note]: { fontColor: COLORS.HOST_HOUSE_NOTE },
            }
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
}

const addRemovableNotesHouseHighlightData = (omission, notesData, cellsToFocusData) => {
    const { removableNotesHostHouse, note, hostCells } = omission
    // not filtering out the cells which are highlighted by hostHouse already
    // becoz won't make a difference
    const cellsToHighlight = getHouseCells(removableNotesHostHouse).filter(cell => !isCellExists(cell, hostCells))

    cellsToHighlight.forEach(cell => {
        const cellHighlightData = { bgColor: COLORS.CELL }
        if (isCellNoteVisible(note, notesData[cell.row][cell.col])) {
            cellHighlightData.notesToHighlightData = {
                [note]: { fontColor: COLORS.REMOVABLE_NOTE },
            }
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
}

const getUICellsToFocusData = (omission, notesData) => {
    const cellsToFocusData = {}
    addHostHouseHighlightData(omission, cellsToFocusData)
    addRemovableNotesHouseHighlightData(omission, notesData, cellsToFocusData)
    return cellsToFocusData
}

export const getHouseNoteHostCells = (note, house, notes) => getHouseCells(house).filter(cell => {
    const cellNotes = notes[cell.row][cell.col]
    return isCellNoteVisible(note, cellNotes)
})

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

export const transformOmissionRawHint = ({ rawHint: omission, notesData }) => ({
    cellsToFocusData: getUICellsToFocusData(omission, notesData),
    title: HINT_ID_VS_TITLES[HINTS_IDS.OMISSION],
    steps: [{ text: getHintExplaination(omission, notesData) }],
    applyHint: getApplyHintData(omission, notesData),
})
