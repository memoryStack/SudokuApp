import { getHouseCells } from '../../houseCells'
import { isCellExists, isCellNoteVisible } from '../../util'
import { SMART_HINTS_CELLS_BG_COLOR } from '../constants'
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

const getHintExplaination = omission => {
    const { hostHouse, removableNotesHostHouse, note } = omission
    return `In the highlight ${hostHouse.type}, ${note} can appear in one of the cells where it's highlighted in green. because of this we can remove ${note} highlighted in red color in the highlighted ${removableNotesHostHouse.type}`
}

export const getUIHighlightData = (omission, notesData) => {
    return {
        cellsToFocusData: getUICellsToFocusData(omission, notesData),
        techniqueInfo: {
            title: 'Omission',
            logic: getHintExplaination(omission),
        },
    }
}
