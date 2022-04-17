import { consoleLog } from '../../../../../utils/util'
import { getHouseCells } from '../../houseCells'
import { getCellHousesInfo } from '../../util'
import { SMART_HINTS_CELLS_BG_COLOR } from '../constants'
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

const convertBoardCellToNum = ({ row, col }) => {
    return row * 9 + col
}

const convertBoardCellNumToCell = cellNum => {
    return {
        row: Math.floor(cellNum / 9),
        col: cellNum % 9,
    }
}

const getHousesCellsNum = cell => {
    const result = {}
    getCellHousesInfo(cell).forEach(({ type, num }) => {
        getHouseCells(type, num).forEach(cell => {
            const cellNum = convertBoardCellToNum(cell)
            result[cellNum] = true
        })
    })
    return result
}

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

const cellNoteVisible = (note, cellNotes) => {
    consoleLog('@@@@@ note', note)
    return cellNotes[note - 1].show
}

const getUICellsToFocusData = ({ commonNoteInWings, pivotCell, wingCells, eliminableNotesCells }) => {
    const cellsToFocusData = {}

    const pivotCellHighlightData = { bgColor: COLORS[YWING_CELLS_TYPES.PIVOT] }
    setCellDataInHintResult(pivotCell, pivotCellHighlightData, cellsToFocusData)

    wingCells.forEach(wingCell => {
        const wingCellHighlightData = { bgColor: COLORS[YWING_CELLS_TYPES.WING] }
        setCellDataInHintResult(wingCell, wingCellHighlightData, cellsToFocusData)
    })

    eliminableNotesCells.forEach(cell => {
        const cellHighlightData = { bgColor: COLORS[YWING_CELLS_TYPES.ELIMINABLE_NOTE] }
        cellHighlightData.notesToHighlightData = {
            [commonNoteInWings]: {
                fontColor: 'red',
            },
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })

    return cellsToFocusData
}

const getHintExplaination = ({ pivotNotes, commonNoteInWings }) => {
    return `In the highlighted green cell, either ${pivotNotes[0]} or ${pivotNotes[1]} can come here. now whatever comes in the green cell, one of the orange cell will be ${commonNoteInWings} for sure. and the notes highlighted in the red in cells which can be seen by both orange cells can be eliminated.`
}

const getYWingHintUIHighlightData = (yWing, notesData) => {
    const { pivot, wings } = yWing

    const pivotCell = pivot.cell
    const wingCells = wings.map(wing => {
        return wing.cell
    })

    const commonNoteInWings = yWing.wingsCommonNote
    const wingsCommonSeenCells = getWingsCommonCells(...wingCells)

    const eliminableNotesCells = wingsCommonSeenCells.filter(cell => {
        return cellNoteVisible(commonNoteInWings, notesData[cell.row][cell.col])
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
        techniqueInfo: {
            title: 'Y Wing',
            logic: getHintExplaination({ pivotNotes: pivot.notes, commonNoteInWings }),
        },
    }
}

// can inline this func in yWIng file only
export const getUIHighlightData = (yWings, notesData) => {
    if (!yWings.length) return null

    return yWings
        .map(yWing => {
            return getYWingHintUIHighlightData(yWing, notesData)
        })
        .filter(yWingHint => !!yWingHint)
}
