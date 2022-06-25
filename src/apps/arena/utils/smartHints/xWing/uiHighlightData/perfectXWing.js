import { HOUSE_TYPE, SMART_HINTS_CELLS_BG_COLOR, HINTS_IDS } from '../../constants'
import { isCellExists } from '../../../util'
import { setCellDataInHintResult, getHintExplanationStepsFromHintChunks, getTryOutInputPanelNumbersVisibility, getCellsFromCellsToFocusedData } from '../../util'
import { getHouseCells } from '../../../houseCells'
import { getCrossHouseType } from '../utils'

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

const getTechniqueExplaination = ({ houseType, candidate }) => {
    const crossHouseType = getCrossHouseType(houseType)
    const houseFullName = HOUSE_TYPE_VOCABOLARY[houseType].FULL_NAME_PLURAL
    const crossHouseFullName = HOUSE_TYPE_VOCABOLARY[crossHouseType].FULL_NAME_PLURAL
    return `In the two highlighted ${houseFullName}, number ${candidate} is a possible solution for only two cells. notice that the cells in these ${houseFullName} where ${candidate} can come are present in the same ${crossHouseFullName} as well. this rectangular arrangement of these 4 cells highlighted in ${DIAGONAL_CELLS_COLORS.TOP_LEFT_BOTTOM_RIGHT} and ${DIAGONAL_CELLS_COLORS.BOTTOM_LEFT_TOP_RIGHT} colors make a X-Wing. now only ways ${candidate} can be placed in these two ${houseFullName} correctly are if either ${candidate} comes in both ${DIAGONAL_CELLS_COLORS.TOP_LEFT_BOTTOM_RIGHT} cells or both ${DIAGONAL_CELLS_COLORS.BOTTOM_LEFT_TOP_RIGHT} cells. in these both ways ${candidate} can't be placed in the cells where it is highlighted in red in these two ${crossHouseFullName}. so we can remove these red highlghted notes safely.`
}

export const getPerfectXWingUIData = ({ legs, houseType }, notesData) => {
    const candidate = legs[0].candidate
    const cells = legs.map(leg => leg.cells)

    const xWingCells = [...cells[0], ...cells[1]]

    const cellsToFocusData = {}
    highlightXWingCells(xWingCells, candidate, cellsToFocusData)
    highlightHouseCells({ houseType, cells }, cellsToFocusData)
    highlightCrossHouseCells({ houseType, cells, candidate }, notesData, cellsToFocusData)

    const tryOutInputPanelAllowedCandidates = [1]
    const hintChunks = [getTechniqueExplaination({ houseType, candidate })]
    return {
        hasTryOut: true,
        type: HINTS_IDS.PERFECT_X_WING,
        title: 'X-Wing',
        cellsToFocusData,
        focusedCells: getCellsFromCellsToFocusedData(cellsToFocusData),
        steps: getHintExplanationStepsFromHintChunks(hintChunks),
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(tryOutInputPanelAllowedCandidates),
        tryOutAnalyserData: {}
    }
}

//     clickableCells: cloneDeep([...hostCells, ...removableGroupCandidatesHostCells]),
//         cellsRestrictedNumberInputs: getRemovableGroupCandidatesHostCellsRestrictedNumberInputs(
//             removableGroupCandidatesHostCells,
//             groupCandidates,
//             notesData,
//         ),
//             restrictedNumberInputMsg:
// "input the numbers which are highlighted in red color in this cell. other numbers don't help in learning this hint.",