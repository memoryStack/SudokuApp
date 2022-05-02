import { HOUSE_TYPE, SMART_HINTS_CELLS_BG_COLOR } from '../../constants'
import { isCellExists, isCellNoteVisible } from '../../../util'
import { setCellDataInHintResult } from '../../util'
import { getHouseCells } from '../../../houseCells'
import { categorizeLegs, categorizeFinnedLegCells, getFinnedXWingRemovableNotesHostCells } from '../utils'

// export it to constants
const DIAGONAL_CELLS_COLORS = {
    TOP_LEFT_BOTTOM_RIGHT: 'orange',
    BOTTOM_LEFT_TOP_RIGHT: 'pink',
    FINN: '#dfe5f0',
}

// TODO: come up with a better color scheme
const HOUSE_TYPE_VOCABOLARY = {
    [HOUSE_TYPE.ROW]: {
        FULL_NAME: 'row',
        FULL_NAME_PLURAL: 'rows',
    },
    [HOUSE_TYPE.COL]: {
        FULL_NAME: 'column',
        FULL_NAME_PLURAL: 'columns',
    },
}

const getCrossHouseType = houseType => (houseType === HOUSE_TYPE.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW)

const getTechniqueExplaination = ({ houseType, candidate }) => {
    return 'some logic is coming soon'
    // const crossHouseType = getCrossHouseType(houseType)
    // const houseFullName = HOUSE_TYPE_VOCABOLARY[houseType].FULL_NAME_PLURAL
    // const crossHouseFullName = HOUSE_TYPE_VOCABOLARY[crossHouseType].FULL_NAME_PLURAL
    // return `In the two highlighted ${houseFullName}, number ${candidate} is a possible solution for only two cells. notice that the cells in these ${houseFullName} where ${candidate} can come are present in the same ${crossHouseFullName} as well. this rectangular arrangement of these 4 cells highlighted in ${DIAGONAL_CELLS_COLORS.TOP_LEFT_BOTTOM_RIGHT} and ${DIAGONAL_CELLS_COLORS.BOTTOM_LEFT_TOP_RIGHT} colors make a X-Wing. now only ways ${candidate} can be placed in these two ${houseFullName} correctly are if either ${candidate} comes in both ${DIAGONAL_CELLS_COLORS.TOP_LEFT_BOTTOM_RIGHT} cells or both ${DIAGONAL_CELLS_COLORS.BOTTOM_LEFT_TOP_RIGHT} cells. in these both ways ${candidate} can't be placed in the cells where it is highlighted in red in these two ${crossHouseFullName}. so we can remove these red highlghted notes safely.`
}

// doing 2 things
const defaultHighlightHouseCells = ({ houseType, cells }, cellsToFocusData) => {
    const firstHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][0].row : cells[0][0].col
    const secondHouseNum = houseType === HOUSE_TYPE.ROW ? cells[1][0].row : cells[1][0].col

    // TODO: weird bug. we have to declare this array first. else it doesn't work
    const xWingHousesNum = [firstHouseNum, secondHouseNum]
    xWingHousesNum.forEach(houseNum => {
        getHouseCells(houseType, houseNum)
            .forEach(cell =>
                setCellDataInHintResult(
                    cell,
                    { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT },
                    cellsToFocusData,
                ),
            )
    })
}

const defaultHighlightCrossHouseCells = ({ houseType, cells }, cellsToFocusData) => {
    const firstCrossHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][0].col : cells[0][0].row
    const secondCrossHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][1].col : cells[0][1].row
    const crossHousesNum = [firstCrossHouseNum, secondCrossHouseNum]
    crossHousesNum.forEach(houseNum => {
        const crossHouseType = getCrossHouseType(houseType)
        getHouseCells(crossHouseType, houseNum)
            .forEach(cell => {
                const cellHighlightData = {
                    bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
                }

                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            })
    })
}

const highlightXWingCells = (cells, candidate, cellsToFocusData) => {
    cells.forEach(({ row, col }, index) => {
        const isTopLeftCell = index === 0
        const isBottomRightCell = index === 3

        const cellHighlightData = {
            bgColor: {
                backgroundColor:
                    isTopLeftCell || isBottomRightCell
                        ? DIAGONAL_CELLS_COLORS.TOP_LEFT_BOTTOM_RIGHT
                        : DIAGONAL_CELLS_COLORS.BOTTOM_LEFT_TOP_RIGHT,
            },
            notesToHighlightData: {
                [candidate]: { fontColor: 'green' },
            },
        }
        setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
    })
}

const highlightFinnCells = (finnCells, candidate, cellsToFocusData) => {
    finnCells.forEach(({ row, col }) => {
        const cellHighlightData = {
            bgColor: {
                backgroundColor: DIAGONAL_CELLS_COLORS.FINN
            },
            notesToHighlightData: {
                [candidate]: { fontColor: 'green' },
            },
        }
        setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
    })
}

const highlightRemovableNotesHostCells = (hostCells, candidate,  notesData, cellsToFocusData) => {

    hostCells.filter((cell) => {
        const cellNotes = notesData[cell.row][cell.col]
        return isCellNoteVisible(candidate, cellNotes)
    }).forEach((cell) => {
        const cellHighlightData = {
            bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
            notesToHighlightData: {
                [candidate]: { fontColor: 'red' },
            },
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
}

export const getFinnedXWingUIData = ({ legs, houseType }, notesData) => {
    const candidate = legs[0].candidate

    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(...legs)

    const { perfect: finnedLegPerfectCells, finns: finnCells } = categorizeFinnedLegCells(perfectLeg.cells, finnedLeg.cells)

    const cellsToFocusData = {}
    
    defaultHighlightHouseCells( { houseType, cells: [ perfectLeg.cells, finnedLegPerfectCells ] },  cellsToFocusData)
    defaultHighlightCrossHouseCells({ houseType, cells: [ perfectLeg.cells, finnedLegPerfectCells ] }, cellsToFocusData)
    highlightXWingCells([ ...perfectLeg.cells, ...finnedLegPerfectCells ], candidate, cellsToFocusData)
    highlightFinnCells(finnCells, candidate, cellsToFocusData)
    highlightRemovableNotesHostCells(getFinnedXWingRemovableNotesHostCells({houseType, legs}), candidate, notesData, cellsToFocusData)

    return {
        cellsToFocusData,
        techniqueInfo: {
            title: 'Finned X-Wing',
            logic: getTechniqueExplaination({ houseType, candidate }),
        },
    }
}
