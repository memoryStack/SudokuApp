import { getHouseCells } from '../../houseCells'
import { isCellExists, isCellNoteVisible } from '../../util'
import { HINTS_IDS, HINT_ID_VS_TITLES, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE_VS_FULL_NAMES, SMART_HINTS_CELLS_BG_COLOR } from '../constants'
import { getCellsAxesValuesListText } from '../tryOutInputAnalyser/helpers'
import { setCellDataInHintResult } from '../util'

const COLORS = {
    CELL: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
    HOST_HOUSE_NOTE: 'green',
    REMOVABLE_NOTE: 'red',
}

const addHostHouseHighlightData = (omission, cellsToFocusData) => {
    const { hostHouse, note, hostCells } = omission

    getHouseCells(hostHouse.type, hostHouse.num).forEach(cell => {
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
    const cellsToHighlight = getHouseCells(removableNotesHostHouse.type, removableNotesHostHouse.num).filter(cell => {
        // not filtering out the cells which are highlighted by hostHouse already
        // becoz won't make a difference
        return !isCellExists(cell, hostCells)
    })

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

export const getHouseNoteHostCells = (note, house, notes) => {
    return getHouseCells(house.type, house.num).filter(cell => {
        const cellNotes = notes[cell.row][cell.col]
        return isCellNoteVisible(note, cellNotes)
    })
}

// extract it out if this func is needed
// at other places as well
const getHintExplaination = (omission, notes) => {
    const { hostHouse, removableNotesHostHouse, note } = omission
    const hostHouseHostCells = getHouseNoteHostCells(note, hostHouse, notes)
    const removableNotesHostCells = getHouseNoteHostCells(note, removableNotesHostHouse, notes).filter(cell => {
        return !isCellExists(cell, hostHouseHostCells)
    })

    const hostHouseHostCellsListText = getCellsAxesValuesListText(
        hostHouseHostCells,
        HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
    )
    const hostHouseHostCellsListTextOrJoined = getCellsAxesValuesListText(
        hostHouseHostCells,
        HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR,
    )
    const removableNotesHostCellsListText = getCellsAxesValuesListText(removableNotesHostCells)
    const hostHouseFullName = HOUSE_TYPE_VS_FULL_NAMES[hostHouse.type].FULL_NAME
    const removableNotesHostHouseFullName = HOUSE_TYPE_VS_FULL_NAMES[removableNotesHostHouse.type].FULL_NAME
    return (
        `In the highlighted ${hostHouseFullName}, ${note} is present` +
        ` only in ${hostHouseHostCellsListText} and these cells are also part of the` +
        ` highlighted ${removableNotesHostHouseFullName}. so ${note} in ${removableNotesHostCellsListText}` +
        ` will be removed when it will be filled in the ${hostHouseFullName} in one of ${hostHouseHostCellsListTextOrJoined}.`
    )
}

export const getUIHighlightData = (omission, notesData) => {
    return {
        cellsToFocusData: getUICellsToFocusData(omission, notesData),
        title: HINT_ID_VS_TITLES[HINTS_IDS.OMISSION],
        steps: [{ text: getHintExplaination(omission, notesData) }],
    }
}
