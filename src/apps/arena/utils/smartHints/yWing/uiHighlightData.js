import { getHouseCells } from '../../houseCells'
import { getCellHousesInfo, isCellNoteVisible, convertBoardCellToNum, convertBoardCellNumToCell } from '../../util'
import { HINTS_IDS, SMART_HINTS_CELLS_BG_COLOR } from '../constants'
import { HINT_ID_VS_TITLES } from '../stringLiterals'
import { setCellDataInHintResult } from '../util'

const YWING_CELLS_TYPES = {
    PIVOT: 'PIVOT',
    WING: 'WING',
    ELIMINABLE_NOTE: 'ELIMINABLE_NOTE',
}

const COLORS = {
    [YWING_CELLS_TYPES.PIVOT]: { backgroundColor: 'green' },
    [YWING_CELLS_TYPES.WING]: { backgroundColor: 'orange' },
    [YWING_CELLS_TYPES.ELIMINABLE_NOTE]: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
}

const getHousesCellsNum = cell => {
    const result = {}
    getCellHousesInfo(cell).forEach((house) => {
        getHouseCells(house).forEach(cell => {
            const cellNum = convertBoardCellToNum(cell)
            result[cellNum] = true
        })
    })
    return result
}

// TODO: this func can be shifted to utils.
// but let's keep it here only for now
const getWingsCommonCells = (wingCellA, wingCellB) => {
    const wingACells = getHousesCellsNum(wingCellA)
    const wingBCells = getHousesCellsNum(wingCellB)

    const commonCellsInAllHouses = []

    for (const cellNum in wingACells) {
        if (wingBCells[cellNum]) commonCellsInAllHouses.push(cellNum)
    }

    return commonCellsInAllHouses.map(cellNum => {
        return convertBoardCellNumToCell(parseInt(cellNum, 10))
    })
}

const addPivotUIHighlightData = (pivotCell, cellsToFocusData) => {
    const pivotCellHighlightData = { bgColor: COLORS[YWING_CELLS_TYPES.PIVOT] }
    setCellDataInHintResult(pivotCell, pivotCellHighlightData, cellsToFocusData)
}

const addWingsUIHighlightData = (wingCells, cellsToFocusData) => {
    wingCells.forEach(wingCell => {
        const wingCellHighlightData = { bgColor: COLORS[YWING_CELLS_TYPES.WING] }
        setCellDataInHintResult(wingCell, wingCellHighlightData, cellsToFocusData)
    })
}

const addEliminableNoteCellUIHighlightData = (eliminableNote, eliminableNotesCells, cellsToFocusData) => {
    eliminableNotesCells.forEach(cell => {
        const cellHighlightData = { bgColor: COLORS[YWING_CELLS_TYPES.ELIMINABLE_NOTE] }
        cellHighlightData.notesToHighlightData = {
            [eliminableNote]: {
                fontColor: 'red',
            },
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
}

const getUICellsToFocusData = ({ commonNoteInWings, pivotCell, wingCells, eliminableNotesCells }) => {
    const cellsToFocusData = {}

    addPivotUIHighlightData(pivotCell, cellsToFocusData)
    addWingsUIHighlightData(wingCells, cellsToFocusData)
    addEliminableNoteCellUIHighlightData(commonNoteInWings, eliminableNotesCells, cellsToFocusData)

    return cellsToFocusData
}

const getHintExplaination = ({ pivotNotes, commonNoteInWings }) => {
    return `In the highlighted green cell, either ${pivotNotes[0]} or ${pivotNotes[1]} can come here. now whatever comes in the green cell, one of the orange cell will be ${commonNoteInWings} for sure. and the notes highlighted in the red in cells which can be seen by both orange cells can be eliminated.`
}

export const getYWingHintUIHighlightData = (yWing, notesData) => {
    const { pivot, wings } = yWing

    const pivotCell = pivot.cell
    const wingCells = wings.map(wing => {
        return wing.cell
    })

    const commonNoteInWings = yWing.wingsCommonNote
    const wingsCommonSeenCells = getWingsCommonCells(...wingCells)

    const eliminableNotesCells = wingsCommonSeenCells.filter(cell => {
        return isCellNoteVisible(commonNoteInWings, notesData[cell.row][cell.col])
    })

    if (!eliminableNotesCells.length) return null

    const cellsToFocusData = getUICellsToFocusData({
        commonNoteInWings,
        pivotCell,
        wingCells,
        eliminableNotesCells,
    })

    return {
        cellsToFocusData,
        title: HINT_ID_VS_TITLES[HINTS_IDS.Y_WING],
        steps: [{ text: getHintExplaination({ pivotNotes: pivot.notes, commonNoteInWings }) }],
    }
}
