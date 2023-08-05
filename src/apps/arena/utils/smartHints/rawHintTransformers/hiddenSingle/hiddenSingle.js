import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _find from '@lodash/find'
import _isNil from '@lodash/isNil'

import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'
import {
    HIDDEN_SINGLE_TYPES,
    HINTS_IDS,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
    SMART_HINTS_CELLS_BG_COLOR,
    HOUSE_TYPE,
} from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import {
    areSameCells, getRowAndCol, getBlockAndBoxNum, getCellAxesValues, getBlockStartCell, getCellHouseForHouseType, getHousesCommonCells,
} from '../../../util'
import { getCellsFromCellsToFocusedData, setCellDataInHintResult } from '../../util'

import {
    BLOCKS_COUNT_IN_ROW,
    BOARD_MOVES_TYPES,
    CELLS_IN_HOUSE,
    GRID_TRAVERSALS,
    HOUSES_COUNT,
} from '../../../../constants'
import { getHouseCells } from '../../../houseCells'
import { getCellsAxesValuesListText } from '../helpers'
import { Houses } from '../../../classes/houses'

const getInhabitableCellData = () => ({
    bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
    inhabitable: true,
})

const getNewHighlightableInstanceHouseType = ({ row, col }, neighbourRows, neighbourCols) => {
    let result = ''
    if (neighbourRows[row] && neighbourCols[col]) {
        const cellsRuledOutByRowInstance = neighbourRows[row].emptyCellsCount
        const cellsRuledOutByColInstance = neighbourCols[col].emptyCellsCount
        result = cellsRuledOutByRowInstance > cellsRuledOutByColInstance ? HOUSE_TYPE.ROW : HOUSE_TYPE.COL
    }
    if (!neighbourRows[row] && neighbourCols[col]) result = HOUSE_TYPE.COL
    if (neighbourRows[row] && !neighbourCols[col]) result = HOUSE_TYPE.ROW
    return result
}

// TODO: these functions don't make sense
const getWinnerInstanceInfoInRow = (firstCell, winnerCandidate, mainNumbers, neighbourRows) => {
    const getWinnerInstancePosInRow = () => {
        for (let col = 0; col < CELLS_IN_HOUSE; col++) {
            if (MainNumbersRecord.isCellFilledWithNumber(mainNumbers, winnerCandidate, { row: firstCell.row, col })) return col
        }
        return -1
    }

    const getBlockEmptyCellsCountInRow = () => {
        let result = 0
        for (let i = 0; i < 3; i++) {
            if (!MainNumbersRecord.isCellFilled(mainNumbers, { row: firstCell.row, col: firstCell.col + i })) result++
        }
        return result
    }

    const emptyCellsCount = getBlockEmptyCellsCountInRow()
    if (emptyCellsCount) {
        const winnerInstancePos = getWinnerInstancePosInRow()
        if (winnerInstancePos !== -1) {
            neighbourRows[firstCell.row] = {
                emptyCellsCount,
                col: winnerInstancePos,
            }
        }
    }
}

const getWinnerInstanceInfoInCol = (firstCell, winnerCandidate, mainNumbers, neighbourCols) => {
    const getWinnerInstancePosInCol = () => {
        for (let row = 0; row < CELLS_IN_HOUSE; row++) {
            if (MainNumbersRecord.isCellFilledWithNumber(mainNumbers, winnerCandidate, { row, col: firstCell.col })) return row
        }
        return -1
    }

    const getBlockEmptyCellsCountInCol = () => {
        let result = 0
        for (let i = 0; i < 3; i++) {
            if (!MainNumbersRecord.isCellFilled(mainNumbers, { row: firstCell.row + i, col: firstCell.col })) result++
        }
        return result
    }

    const emptyCellsCount = getBlockEmptyCellsCountInCol()
    if (emptyCellsCount) {
        const winnerInstancePos = getWinnerInstancePosInCol()
        if (winnerInstancePos !== -1) {
            neighbourCols[firstCell.col] = {
                emptyCellsCount,
                row: winnerInstancePos,
            }
        }
    }
}

const getMustHighlightableNeighbourRows = (neighbourRows, hostCell, mainNumbers, cellsToFocusData) => {
    const result = {}
    Object.keys(neighbourRows).forEach(rowKey => {
        const rowNum = parseInt(rowKey, 10)
        if (!MainNumbersRecord.isCellFilled(mainNumbers, { row: rowNum, col: hostCell.col })) {
            const { col: instanceColumn } = neighbourRows[rowKey]
            const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            setCellDataInHintResult({ row: rowNum, col: instanceColumn }, cellHighlightData, cellsToFocusData)
            result[rowKey] = true
        }
    })
    return result
}

const getMustHighlightableNeighbourCols = (neighbourCols, hostCell, mainNumbers, cellsToFocusData) => {
    const result = {}
    Object.keys(neighbourCols).forEach(colKey => {
        const colNum = parseInt(colKey, 10)
        if (!MainNumbersRecord.isCellFilled(mainNumbers, { row: hostCell.row, col: colNum })) {
            const { row: instanceRow } = neighbourCols[colKey]
            const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            setCellDataInHintResult({ row: instanceRow, col: colNum }, cellHighlightData, cellsToFocusData)
            result[colKey] = true
        }
    })
    return result
}

const winnerInstanceHighlightableInCellSharedHouse = (cell, highlightableNeighbourHousesWinnerCandidates) => (
    highlightableNeighbourHousesWinnerCandidates.rows[cell.row]
    || highlightableNeighbourHousesWinnerCandidates.cols[cell.col]
)

const highlightNeighbourHouseNewWinnerInstance = (
    { row, col },
    instanceHouseType,
    neighbourRows,
    neighbourCols,
    highlightableNeighbourHousesWinnerCandidates,
    cellsToFocusData,
) => {
    if (Houses.isRowHouse(instanceHouseType)) {
        highlightableNeighbourHousesWinnerCandidates.rows[row] = true
        const { col: instanceColumn } = neighbourRows[row]
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
        setCellDataInHintResult({ row, col: instanceColumn }, cellHighlightData, cellsToFocusData)
    } else if (Houses.isColHouse(instanceHouseType)) {
        highlightableNeighbourHousesWinnerCandidates.cols[col] = true
        const { row: instanceRow } = neighbourCols[col]
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
        setCellDataInHintResult({ row: instanceRow, col }, cellHighlightData, cellsToFocusData)
    }
}

// TODO: test how cross-hatching fits into this highlighting properly
// TODO: we can break it down further but let's leave it for now.
//          the flow looks much simpler now.
const getHiddenSingleInBlockData = (hostCell, mainNumbers) => {
    const { row: hostRow, col: hostCol } = hostCell
    // NOTE: here we are using 'neighbour' in relative to hostCell

    // highlight all the cells of the current block
    // change the naming of "neighbourRows" and "neighbourCols"
    // it doesn't communicate anything
    const neighbourRows = {}
    const neighbourCols = {}
    const { blockNum: hostBlockNum } = getBlockAndBoxNum(hostCell)
    const { row: startRow, col: startCol } = getBlockStartCell(hostBlockNum)
    const winnerCandidate = MainNumbersRecord.getCellSolutionValue(mainNumbers, { row: hostRow, col: hostCol })

    for (let i = 0; i < 3; i++) {
        const row = startRow + i
        if (row !== hostRow) { getWinnerInstanceInfoInRow({ row, col: startCol }, winnerCandidate, mainNumbers, neighbourRows) }

        const col = startCol + i
        if (col !== hostCol) { getWinnerInstanceInfoInCol({ row: startRow, col }, winnerCandidate, mainNumbers, neighbourCols) }
    }

    const cellsToFocusData = {}
    const highlightableNeighbourHousesWinnerCandidates = {
        rows: getMustHighlightableNeighbourRows(neighbourRows, hostCell, mainNumbers, cellsToFocusData),
        cols: getMustHighlightableNeighbourCols(neighbourCols, hostCell, mainNumbers, cellsToFocusData),
    }

    for (let cellNo = 0; cellNo < CELLS_IN_HOUSE; cellNo++) {
        const { row, col } = getRowAndCol(hostBlockNum, cellNo)

        if (MainNumbersRecord.isCellFilled(mainNumbers, { row, col })) {
            const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
            continue
        }

        if (areSameCells({ row, col }, hostCell)) {
            const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.SELECTED }
            setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
            continue
        }

        setCellDataInHintResult({ row, col }, getInhabitableCellData(), cellsToFocusData)

        if (winnerInstanceHighlightableInCellSharedHouse({ row, col }, highlightableNeighbourHousesWinnerCandidates)) { continue }

        highlightNeighbourHouseNewWinnerInstance(
            { row, col },
            getNewHighlightableInstanceHouseType({ row, col }, neighbourRows, neighbourCols),
            neighbourRows,
            neighbourCols,
            highlightableNeighbourHousesWinnerCandidates,
            cellsToFocusData,
        )
    }
    return cellsToFocusData
}

export const getNextNeighbourBlock = (currentBlockNumIdx, direction) => {
    if (direction === GRID_TRAVERSALS.ROW) return getNextBlockInRow(currentBlockNumIdx)
    if (direction === GRID_TRAVERSALS.COL) return getNextBlockInCol(currentBlockNumIdx)
    return -1
}

const getNextBlockInRow = currentBlockNumIdx => {
    let result = currentBlockNumIdx + 1
    if (result % BLOCKS_COUNT_IN_ROW === 0) result -= BLOCKS_COUNT_IN_ROW
    return result
}

const getNextBlockInCol = currentBlockNumIdx => (currentBlockNumIdx + BLOCKS_COUNT_IN_ROW) % HOUSES_COUNT

// TODO: write test cases for it
export const getCellFilledWithNumberInHouse = (number, house, mainNumbers) => _find(getHouseCells(house), cell => MainNumbersRecord.isCellFilledWithNumber(mainNumbers, number, cell))

export const shouldHighlightWinnerCandidateInstanceInBlock = (hostHouse, blockHouse, mainNumbers) => getHousesCommonCells(blockHouse, hostHouse)
    .some(cell => !MainNumbersRecord.isCellFilled(mainNumbers, cell))

const getHostHouse = (hostCell, singleType) => {
    if (singleType === HIDDEN_SINGLE_TYPES.ROW) return getCellHouseForHouseType(HOUSE_TYPE.ROW, hostCell)
    if (singleType === HIDDEN_SINGLE_TYPES.COL) return getCellHouseForHouseType(HOUSE_TYPE.COL, hostCell)
    return getCellHouseForHouseType(HOUSE_TYPE.BLOCK, hostCell)
}

const highlightCrossHouseCellFilledWithHSCandidate = (singleType, hostHouseCell, winnerCandidate, mainNumbers, cellsToFocusData) => {
    const crossHouseType = singleType === HIDDEN_SINGLE_TYPES.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW
    const crossHouse = getCellHouseForHouseType(crossHouseType, hostHouseCell)
    const candidateInstanceCell = getCellFilledWithNumberInHouse(winnerCandidate, crossHouse, mainNumbers)
    const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
    setCellDataInHintResult(candidateInstanceCell, cellHighlightData, cellsToFocusData)
}

const highlightCommonCellsInBlockAndRowOrColHostHouse = ({
    blockHouse,
    mainNumbers,
    cellsToFocusData,
    isCandidatePresentInBlock,
    hostCell,
    singleType,
}) => {
    const winnerCandidate = MainNumbersRecord.getCellSolutionValue(mainNumbers, hostCell)
    getHousesCommonCells(blockHouse, getHostHouse(hostCell, singleType))
        .filter(blockCell => !areSameCells(blockCell, hostCell))
        .forEach(blockCell => {
            if (MainNumbersRecord.isCellFilled(mainNumbers, blockCell)) {
                const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
                setCellDataInHintResult(blockCell, cellHighlightData, cellsToFocusData)
            } else {
                setCellDataInHintResult(blockCell, getInhabitableCellData(), cellsToFocusData)
                if (!isCandidatePresentInBlock) {
                    highlightCrossHouseCellFilledWithHSCandidate(singleType, blockCell, winnerCandidate, mainNumbers, cellsToFocusData)
                }
            }
        })
}

const highlightBlockCellsForRowOrColHiddenSingle = ({
    blockNum, mainNumbers, cellsToFocusData, singleType, hostCell: hiddenSingleHostCell,
}) => {
    const winnerCandidate = MainNumbersRecord.getCellSolutionValue(mainNumbers, hiddenSingleHostCell)

    const blockHouse = { type: HOUSE_TYPE.BLOCK, num: blockNum }

    const winnerCandidateHostCellInBlock = getCellFilledWithNumberInHouse(winnerCandidate, blockHouse, mainNumbers)

    const highlightWinnerCandidateNumberInBlock = !!winnerCandidateHostCellInBlock
        && shouldHighlightWinnerCandidateInstanceInBlock(getHostHouse(hiddenSingleHostCell, singleType), blockHouse, mainNumbers)
    if (highlightWinnerCandidateNumberInBlock) {
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
        setCellDataInHintResult(winnerCandidateHostCellInBlock, cellHighlightData, cellsToFocusData)
    }

    highlightCommonCellsInBlockAndRowOrColHostHouse({
        mainNumbers,
        cellsToFocusData,
        isCandidatePresentInBlock: !_isNil(winnerCandidateHostCellInBlock),
        hostCell: hiddenSingleHostCell,
        blockHouse,
        singleType,
    })
}

// row and column are going to have same logic, let's write them down in the same function only
// let's make it generic for col as well
const getHiddenSingleInRowOrColData = (hostCell, type, mainNumbers) => {
    const { row: hostRow, col: hostCol } = hostCell
    const cellsToFocusData = {}

    const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.SELECTED }
    setCellDataInHintResult(hostCell, cellHighlightData, cellsToFocusData)

    const { blockNum: currentBlockNum } = getBlockAndBoxNum(hostCell)
    // why are we highlighting the block cells just like that ??
    highlightBlockCellsForRowOrColHiddenSingle({
        blockNum: currentBlockNum,
        mainNumbers,
        cellsToFocusData,
        singleType: type,
        hostCell: {
            row: hostRow,
            col: hostCol,
        },
    })

    // check in 2 neighbour blocks
    let neighboursBlocks = 2
    let neighbourBlockNum = getNextNeighbourBlock(currentBlockNum, getNextBlockSearchDirection(type))
    while (neighboursBlocks--) {
        highlightBlockCellsForRowOrColHiddenSingle({
            blockNum: neighbourBlockNum,
            mainNumbers,
            cellsToFocusData,
            singleType: type,
            hostCell: {
                row: hostRow,
                col: hostCol,
            },
        })
        neighbourBlockNum = getNextNeighbourBlock(neighbourBlockNum, getNextBlockSearchDirection(type))
    }
    return cellsToFocusData
}

const getNextBlockSearchDirection = hiddenSingleType => (hiddenSingleType === HIDDEN_SINGLE_TYPES.ROW ? GRID_TRAVERSALS.ROW : GRID_TRAVERSALS.COL)

const getHiddenSingleLogic = (rawHint, solutionValue, filledCellsWithSolutionValue) => {
    const { type: houseType, cell } = rawHint
    const msgPlaceholdersValues = {
        houseType,
        solutionValue,
        hostCell: getCellAxesValues(cell),
        filledCellsWithSolutionValue: getCellsAxesValuesListText(
            filledCellsWithSolutionValue,
            HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
        ),
    }
    const msgTemplate = HINT_EXPLANATION_TEXTS[HINTS_IDS.HIDDEN_SINGLE]
    return dynamicInterpolation(msgTemplate, msgPlaceholdersValues)
}

const getApplyHintData = rawHint => {
    const { cell, mainNumber } = rawHint
    return [
        {
            cell,
            action: { type: BOARD_MOVES_TYPES.ADD, mainNumber },
        },
    ]
}

export const transformHiddenSingleRawHint = ({ rawHint, mainNumbers }) => {
    const { cell, type } = rawHint

    const cellsToFocusData = type === HIDDEN_SINGLE_TYPES.BLOCK
        ? getHiddenSingleInBlockData(cell, mainNumbers)
        : getHiddenSingleInRowOrColData(cell, type, mainNumbers)

    const hiddenSingleCellSolutionValue = MainNumbersRecord.getCellSolutionValue(mainNumbers, cell)

    const filledCellsWithSolutionValue = getCellsFromCellsToFocusedData(cellsToFocusData)
        .filter(aCell => MainNumbersRecord.isCellFilledWithNumber(mainNumbers, hiddenSingleCellSolutionValue, aCell))

    return {
        cellsToFocusData,
        title: HINT_ID_VS_TITLES[HINTS_IDS.HIDDEN_SINGLE],
        steps: [{ text: getHiddenSingleLogic(rawHint, hiddenSingleCellSolutionValue, filledCellsWithSolutionValue) }],
        selectCellOnClose: cell,
        applyHint: getApplyHintData(rawHint),
    }
}
