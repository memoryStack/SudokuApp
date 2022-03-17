import { HOUSE_TYPE, SMART_HINTS_CELLS_BG_COLOR } from '../constants'
import { isCellExists } from '../../util'
import { setCellDataInHintResult } from '../util'
import { getHouseCells } from '../../houseCells'

const DIAGONAL_CELLS_COLORS = {
    TOP_LEFT_BOTTOM_RIGHT: 'orange',
    BOTTOM_LEFT_TOP_RIGHT: 'pink',
}

const getUIData = ({ candidate, cells, type: houseType }, notesData) => {
    const cellsToFocusData = {}

    const xWingCells = [...cells[0], ...cells[1]]

    const isXWingCell = cell => {
        return isCellExists(cell, xWingCells)
    }

    // highlight the xWing Cells
    xWingCells.forEach(({ row, col }, index) => {
        const isTopLeftCell = index === 0
        const isBottomRightCell = index === 3

        // TODO: come up with a better color scheme
        const cellHighlightData = {
            // bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
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

    // highlight the x-wing house cells
    const firstHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][0].row : cells[0][0].col
    const secondHouseNum = houseType === HOUSE_TYPE.ROW ? cells[1][0].row : cells[1][0].col

    // TODO: weird bug. we have to declare this array first. else it doesn't work
    const xWingHousesNum = [firstHouseNum, secondHouseNum]
    xWingHousesNum.forEach(houseNum => {
        getHouseCells(houseType, houseNum)
            .filter(cell => !isXWingCell(cell))
            .forEach(cell =>
                setCellDataInHintResult(
                    cell,
                    { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT },
                    cellsToFocusData,
                ),
            )
    })

    // think of a better name here
    const firstOppositeHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][0].col : cells[0][0].row
    const secondOppositeHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][1].col : cells[0][1].row
    const oppositeHousesNum = [firstOppositeHouseNum, secondOppositeHouseNum]
    oppositeHousesNum.forEach(houseNum => {
        const oppositeHouseType = houseType === HOUSE_TYPE.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW
        getHouseCells(oppositeHouseType, houseNum)
            .filter(cell => !isXWingCell(cell))
            .forEach(cell => {
                const cellHighlightData = {
                    bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
                }

                const cellNotes = notesData[cell.row][cell.col]
                if (cellNotes[candidate - 1].show) {
                    cellHighlightData.notesToHighlightData = {
                        [candidate]: { fontColor: 'red' },
                    }
                }

                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            })
    })

    // TODO: failing to comeup with good wordings
    const getExplaination = () => {
        // TODO: houseType = col -> column

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

        const oppositeHouseType = houseType === HOUSE_TYPE.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW
        const houseFullName = HOUSE_TYPE_VOCABOLARY[houseType].FULL_NAME_PLURAL
        const oppositeHouseFullName = HOUSE_TYPE_VOCABOLARY[oppositeHouseType].FULL_NAME_PLURAL
        return `In the two highlighted ${houseFullName}, number ${candidate} is a possible solution for only two cells. notice that the cells in these ${houseFullName} where ${candidate} can come are present in the same ${oppositeHouseFullName} as well. this rectangular arrangement of these 4 cells highlighted in ${DIAGONAL_CELLS_COLORS.TOP_LEFT_BOTTOM_RIGHT} and ${DIAGONAL_CELLS_COLORS.BOTTOM_LEFT_TOP_RIGHT} colors make a X-Wing. now only ways ${candidate} can be placed in these two ${houseFullName} correctly are if either ${candidate} comes in both ${DIAGONAL_CELLS_COLORS.TOP_LEFT_BOTTOM_RIGHT} cells or both ${DIAGONAL_CELLS_COLORS.BOTTOM_LEFT_TOP_RIGHT} cells. in these both ways ${candidate} can't be placed in the cells where it is highlighted in red in these two ${oppositeHouseFullName}. so we can remove these red highlghted notes safely.`
    }

    return {
        cellsToFocusData,
        techniqueInfo: {
            title: 'X-Wing',
            logic: getExplaination(),
        },
    }
}

export const getUIHighlightData = (xWings, notesData) => {
    if (!xWings.length) return null

    return xWings.map(xWing => {
        return getUIData(xWing, notesData)
    })
}
