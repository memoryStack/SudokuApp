import { HOUSE_TYPE, SMART_HINTS_CELLS_BG_COLOR, HINTS_IDS, HINT_ID_VS_TITLES } from '../../constants'
import { isCellExists, isCellNoteVisible } from '../../../util'
import { setCellDataInHintResult, getHintExplanationStepsFromHintChunks, getTryOutInputPanelNumbersVisibility, getCellsFromCellsToFocusedData } from '../../util'
import { getHouseCells } from '../../../houseCells'
import { getCrossHouseType, getXWingCandidate, getXWingHousesTexts, getXWingRectangleCornersAxesText, getDiagonalsCornersAxesTexts, getCrossHouseAxesText } from '../utils'
import { getCellsAxesValuesListText } from '../../tryOutInputAnalyser/helpers'

const DIAGONAL_CELLS_COLORS = {
    TOP_LEFT_BOTTOM_RIGHT: 'orange',
    BOTTOM_LEFT_TOP_RIGHT: 'pink',
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

const highlightHouseCells = ({ houseType, cells }, cellsToFocusData) => {
    const firstHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][0].row : cells[0][0].col
    const secondHouseNum = houseType === HOUSE_TYPE.ROW ? cells[1][0].row : cells[1][0].col

    const xWingCells = [...cells[0], ...cells[1]]

    // TODO: weird bug. we have to declare this array first. else it doesn't work
    const xWingHousesNum = [firstHouseNum, secondHouseNum]
    xWingHousesNum.forEach(houseNum => {
        getHouseCells(houseType, houseNum)
            .filter(cell => !isCellExists(cell, xWingCells))
            .forEach(cell =>
                setCellDataInHintResult(
                    cell,
                    { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT },
                    cellsToFocusData,
                ),
            )
    })
}

const highlightCrossHouseCells = ({ houseType, cells, candidate }, notesData, cellsToFocusData) => {
    const xWingCells = [...cells[0], ...cells[1]]
    const firstCrossHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][0].col : cells[0][0].row
    const secondCrossHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][1].col : cells[0][1].row
    const crossHousesNum = [firstCrossHouseNum, secondCrossHouseNum]
    crossHousesNum.forEach(houseNum => {
        const crossHouseType = getCrossHouseType(houseType)
        getHouseCells(crossHouseType, houseNum)
            .filter(cell => !isCellExists(cell, xWingCells))
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
}

const getHintChunks = (xWing, removableNotesHostCells) => {
    const candidate = getXWingCandidate(xWing)
    const crossHouseType = getCrossHouseType(xWing.houseType)
    const houseFullName = HOUSE_TYPE_VOCABOLARY[xWing.houseType].FULL_NAME_PLURAL
    const crossHouseFullName = HOUSE_TYPE_VOCABOLARY[crossHouseType].FULL_NAME_PLURAL
    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    const rectangleCornersText = getXWingRectangleCornersAxesText(xWing.legs)
    const { topDown: topDownDiagonalText, bottomUp: bottomUpDiagonalText } = getDiagonalsCornersAxesTexts(xWing)
    const { crossHouseAAxesValue, crossHouseBAxesValue } = getCrossHouseAxesText(xWing)

    return [
        `in X-Wing we focus on a candidate which is possible in exactly 2 cells of 2 rows or 2 columns.`
        + ` these cells must behave like the corners of a rectangle or square when connected`,
        `if the candidate is found in exactly 2 cells in rows then all the other occurences of candidate in columns`
        + ` can be removed and same is true when candidate is found in exactly 2 cells in columns then it can be removed`
        + ` from other cells in the rows`,
        `notice in highlighted area in the board\n`
        + `${candidate} is present in exactly 2 cells in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName}`
        + ` forming a ${rectangleCornersText} rectangle. now in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName} ${candidate}`
        + ` can be filled either in ${topDownDiagonalText} or ${bottomUpDiagonalText} cells and it will result in removing ${candidate}`
        + ` from ${crossHouseAAxesValue} and ${crossHouseBAxesValue} ${crossHouseFullName} ${getCellsAxesValuesListText(removableNotesHostCells)} cells`
    ]
}

const getRemovableNotesHostCells = (xWingCells, candidate, focusedCells, notes) => {
    return focusedCells.filter((cell) => {
        return !isCellExists(cell, xWingCells) && isCellNoteVisible(candidate, notes[cell.row][cell.col])
    })
}

export const getPerfectXWingUIData = (xWing, notesData) => {
    const { legs, houseType } = xWing
    const candidate = legs[0].candidate
    const cells = legs.map(leg => leg.cells)

    const xWingCells = [...cells[0], ...cells[1]]

    const cellsToFocusData = {}
    highlightXWingCells(xWingCells, candidate, cellsToFocusData)
    highlightHouseCells({ houseType, cells }, cellsToFocusData)
    highlightCrossHouseCells({ houseType, cells, candidate }, notesData, cellsToFocusData)

    const tryOutInputPanelAllowedCandidates = [candidate]


    const focusedCells = getCellsFromCellsToFocusedData(cellsToFocusData)
    const removableNotesHostCells = getRemovableNotesHostCells(xWingCells, candidate, focusedCells, notesData)

    return {
        hasTryOut: true,
        type: HINTS_IDS.PERFECT_X_WING,
        title: HINT_ID_VS_TITLES[HINTS_IDS.PERFECT_X_WING],
        cellsToFocusData,
        focusedCells,
        steps: getHintExplanationStepsFromHintChunks(getHintChunks(xWing, removableNotesHostCells)),
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(tryOutInputPanelAllowedCandidates),
        tryOutAnalyserData: {
            xWingCells,
            removableNotesHostCells,
            xWing,
        }
    }
}
