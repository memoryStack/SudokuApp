import { dynamicInterpolation } from 'lodash/src/utils/dynamicInterpolation'
import _find from 'lodash/src/utils/find'

import { HIDDEN_SINGLE_TYPES, HINTS_IDS, SMART_HINTS_CELLS_BG_COLOR } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { HOUSE_TYPE } from '../../constants'
import { isCellEmpty, areSameCells, getRowAndCol, getBlockAndBoxNum } from '../../../util'
import { setCellDataInHintResult } from '../../util'

import { BLOCKS_COUNT_IN_ROW, CELLS_IN_HOUSE, GRID_TRAVERSALS, HOUSES_COUNT } from '../../../../constants'
import { getHouseCells } from '../../../houseCells'

const getInhabitableCellData = () => {
    return {
        bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
        inhabitable: true,
    }
}

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

const getWinnerInstanceInfoInRow = (firstCell, winnerCandidate, mainNumbers, neighbourRows) => {
    const getWinnerInstancePosInRow = () => {
        for (let col = 0; col < CELLS_IN_HOUSE; col++) {
            if (mainNumbers[firstCell.row][col].value === winnerCandidate) return col
        }
        return -1
    }

    const getBlockEmptyCellsCountInRow = () => {
        let result = 0
        for (let i = 0; i < 3; i++) {
            if (isCellEmpty({ row: firstCell.row, col: firstCell.col + i }, mainNumbers)) result++
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
            if (mainNumbers[row][firstCell.col].value === winnerCandidate) return row
        }
        return -1
    }

    const getBlockEmptyCellsCountInCol = () => {
        let result = 0
        for (let i = 0; i < 3; i++) {
            if (isCellEmpty({ row: firstCell.row + i, col: firstCell.col }, mainNumbers)) result++
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
        if (isCellEmpty({ row: rowNum, col: hostCell.col }, mainNumbers)) {
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
        if (isCellEmpty({ row: hostCell.row, col: colNum }, mainNumbers)) {
            const { row: instanceRow } = neighbourCols[colKey]
            const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            setCellDataInHintResult({ row: instanceRow, col: colNum }, cellHighlightData, cellsToFocusData)
            result[colKey] = true
        }
    })
    return result
}

const winnerInstanceHighlightableInCellSharedHouse = (cell, highlightableNeighbourHousesWinnerCandidates) => {
    return (
        highlightableNeighbourHousesWinnerCandidates.rows[cell.row] ||
        highlightableNeighbourHousesWinnerCandidates.cols[cell.col]
    )
}

const highlightNeighbourHouseNewWinnerInstance = (
    { row, col },
    instanceHouseType,
    neighbourRows,
    neighbourCols,
    highlightableNeighbourHousesWinnerCandidates,
    cellsToFocusData,
) => {
    if (instanceHouseType === HOUSE_TYPE.ROW) {
        highlightableNeighbourHousesWinnerCandidates.rows[row] = true
        const { col: instanceColumn } = neighbourRows[row]
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
        setCellDataInHintResult({ row, col: instanceColumn }, cellHighlightData, cellsToFocusData)
    } else if (instanceHouseType === HOUSE_TYPE.COL) {
        highlightableNeighbourHousesWinnerCandidates.cols[col] = true
        const { row: instanceRow } = neighbourCols[col]
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
        setCellDataInHintResult({ row: instanceRow, col }, cellHighlightData, cellsToFocusData)
    }
}

const getBlockStartCell = blockNum => {
    return {
        row: blockNum - (blockNum % 3),
        col: (blockNum % 3) * 3,
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
    const winnerCandidate = mainNumbers[hostRow][hostCol].solutionValue
    for (let i = 0; i < 3; i++) {
        const row = startRow + i
        if (row !== hostRow)
            getWinnerInstanceInfoInRow({ row, col: startCol }, winnerCandidate, mainNumbers, neighbourRows)

        const col = startCol + i
        if (col !== hostCol)
            getWinnerInstanceInfoInCol({ row: startRow, col }, winnerCandidate, mainNumbers, neighbourCols)
    }

    const cellsToFocusData = {}
    const highlightableNeighbourHousesWinnerCandidates = {
        rows: getMustHighlightableNeighbourRows(neighbourRows, hostCell, mainNumbers, cellsToFocusData),
        cols: getMustHighlightableNeighbourCols(neighbourCols, hostCell, mainNumbers, cellsToFocusData),
    }

    for (let cellNo = 0; cellNo < CELLS_IN_HOUSE; cellNo++) {
        const { row, col } = getRowAndCol(hostBlockNum, cellNo)

        if (!isCellEmpty({ row, col }, mainNumbers)) {
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

        if (winnerInstanceHighlightableInCellSharedHouse({ row, col }, highlightableNeighbourHousesWinnerCandidates))
            continue

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

const getNextBlockInCol = currentBlockNumIdx => {
    return (currentBlockNumIdx + BLOCKS_COUNT_IN_ROW) % HOUSES_COUNT
}

const getCandidateInstanceCordinatesInHouse = (candidate, house, mainNumbers) => {
    return _find(getHouseCells(house), ({ row, col }) => {
        return mainNumbers[row][col].value === candidate
    })
}

const shouldHighlightWinnerCandidateInstanceInBlock = (hostCell, blockNum, singleType, mainNumbers) => {
    const blockFirstCell = getRowAndCol(blockNum, 0)
    const cellIncrementer = singleType === HIDDEN_SINGLE_TYPES.ROW ? { row: 0, col: 1 } : { row: 1, col: 0 }
    const hostHouseCellInBlock =
        singleType === HIDDEN_SINGLE_TYPES.ROW
            ? { row: hostCell.row, col: blockFirstCell.col }
            : { row: blockFirstCell.row, col: hostCell.col }

    let hostCellsCountInBlock = 3
    for (let i = 0; i < hostCellsCountInBlock; i++) {
        if (isCellEmpty(hostHouseCellInBlock, mainNumbers)) return true
        hostHouseCellInBlock.row += cellIncrementer.row
        hostHouseCellInBlock.col += cellIncrementer.col
    }
    return false
}

const hiddenSingleInRowHighlightBlockCells = ({
    selectedRow,
    selectedCol,
    blockNum,
    mainNumbers,
    cellsToFocusData,
    candidateCordinatesInBlock,
}) => {
    const winnerCandidate = mainNumbers[selectedRow][selectedCol].solutionValue

    const currentBlockStartColumn = getBlockStartCell(blockNum).col
    for (let i = 0; i < 3; i++) {
        const col = currentBlockStartColumn + i
        if (col === selectedCol) continue
        if (!mainNumbers[selectedRow][col].value) {
            if (!candidateCordinatesInBlock) {
                const { row: instanceRow, col: instanceCol } = getCandidateInstanceCordinatesInHouse(
                    winnerCandidate,
                    { type: HOUSE_TYPE.COL, num: col },
                    mainNumbers,
                )

                const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
                setCellDataInHintResult({ row: instanceRow, col: instanceCol }, cellHighlightData, cellsToFocusData)
            }
            setCellDataInHintResult({ row: selectedRow, col }, getInhabitableCellData(), cellsToFocusData)
        } else {
            const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            setCellDataInHintResult({ row: selectedRow, col }, cellHighlightData, cellsToFocusData)
        }
    }
}

const hiddenSingleInColHighlightBlockCells = ({
    selectedRow,
    selectedCol,
    blockNum,
    mainNumbers,
    cellsToFocusData,
    candidateCordinatesInBlock,
}) => {
    const winnerCandidate = mainNumbers[selectedRow][selectedCol].solutionValue
    const currentBlockStartRow = getBlockStartCell(blockNum).row
    for (let i = 0; i < 3; i++) {
        const row = currentBlockStartRow + i
        if (row === selectedRow) continue
        if (!mainNumbers[row][selectedCol].value) {
            if (!candidateCordinatesInBlock) {
                const { row: instanceRow, col: instanceCol } = getCandidateInstanceCordinatesInHouse(
                    winnerCandidate,
                    { type: HOUSE_TYPE.ROW, num: row },
                    mainNumbers,
                )

                const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
                setCellDataInHintResult({ row: instanceRow, col: instanceCol }, cellHighlightData, cellsToFocusData)
            }
            setCellDataInHintResult({ row, col: selectedCol }, getInhabitableCellData(), cellsToFocusData)
        } else {
            const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            setCellDataInHintResult({ row, col: selectedCol }, cellHighlightData, cellsToFocusData)
        }
    }
}

const highlightBlockCells = ({ selectedRow, selectedCol, blockNum, mainNumbers, cellsToFocusData, singleType }) => {
    const winnerCandidate = mainNumbers[selectedRow][selectedCol].solutionValue

    const candidateCordinatesInBlock = getCandidateInstanceCordinatesInHouse(
        winnerCandidate,
        { type: HOUSE_TYPE.BLOCK, num: blockNum },
        mainNumbers,
    )
    if (
        shouldHighlightWinnerCandidateInstanceInBlock(
            { row: selectedRow, col: selectedCol },
            blockNum,
            singleType,
            mainNumbers,
        ) &&
        candidateCordinatesInBlock
    ) {
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
        setCellDataInHintResult(candidateCordinatesInBlock, cellHighlightData, cellsToFocusData)
    }

    if (singleType === HIDDEN_SINGLE_TYPES.ROW) {
        hiddenSingleInRowHighlightBlockCells({
            selectedRow,
            selectedCol,
            blockNum,
            mainNumbers,
            cellsToFocusData,
            candidateCordinatesInBlock,
        })
    } else {
        hiddenSingleInColHighlightBlockCells({
            selectedRow,
            selectedCol,
            blockNum,
            mainNumbers,
            cellsToFocusData,
            candidateCordinatesInBlock,
        })
    }
}

// row and column are going to have same logic, let's write them down in the same function only
// let's make it generic for col as well
const getHiddenSingleInRowOrColData = (hostCell, type, mainNumbers) => {
    const { row: hostRow, col: hostCol } = hostCell
    const cellsToFocusData = {}

    const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.SELECTED }
    setCellDataInHintResult({ row: hostRow, col: hostCol }, cellHighlightData, cellsToFocusData)

    const { blockNum: currentBlockNum } = getBlockAndBoxNum(hostCell)
    highlightBlockCells({
        selectedRow: hostRow,
        selectedCol: hostCol,
        blockNum: currentBlockNum,
        mainNumbers,
        cellsToFocusData,
        singleType: type,
    })

    // check in 2 neighbour blocks
    let neighboursBlocks = 2
    let neighbourBlockNum = getNextNeighbourBlock(currentBlockNum, getNextBlockSearchDirection(type))
    while (neighboursBlocks--) {
        highlightBlockCells({
            selectedRow: hostRow,
            selectedCol: hostCol,
            blockNum: neighbourBlockNum,
            mainNumbers,
            cellsToFocusData,
            singleType: type,
        })
        neighbourBlockNum = getNextNeighbourBlock(neighbourBlockNum, getNextBlockSearchDirection(type))
    }
    return cellsToFocusData
}

const getNextBlockSearchDirection = hiddenSingleType => {
    return hiddenSingleType === HIDDEN_SINGLE_TYPES.ROW ? GRID_TRAVERSALS.ROW : GRID_TRAVERSALS.COL
}

const getHiddenSingleLogic = (houseType, solutionValue) => {
    const msgPlaceholdersValues = { houseType, solutionValue }
    const msgTemplate = HINT_EXPLANATION_TEXTS[HINTS_IDS.HIDDEN_SINGLE]
    return dynamicInterpolation(msgTemplate, msgPlaceholdersValues)
}

export const transformHiddenSingleRawHint = ({ rawHint, mainNumbers }) => {
    const { cell, type } = rawHint

    let cellsToFocusData =
        type === HIDDEN_SINGLE_TYPES.BLOCK
            ? getHiddenSingleInBlockData(cell, mainNumbers)
            : getHiddenSingleInRowOrColData(cell, type, mainNumbers)

    return {
        cellsToFocusData,
        title: HINT_ID_VS_TITLES[HINTS_IDS.HIDDEN_SINGLE],
        steps: [{ text: getHiddenSingleLogic(type, mainNumbers[cell.row][cell.col].solutionValue) }],
        selectCellOnClose: cell,
    }
}