import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
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
    areSameCells, getRowAndCol, getBlockAndBoxNum, getCellAxesValues, getBlockStartCell, getCellBlockHouseInfo, getHousesCommonCells, getCellHouseForHouseType, areSameHouses,
} from '../../../util'
import { getCellsFromCellsToFocusedData, setCellDataInHintResult } from '../../util'

import {
    BOARD_MOVES_TYPES,
    CELLS_IN_HOUSE,
} from '../../../../constants'
import { getCellsAxesValuesListText } from '../helpers'
import { Houses } from '../../../classes/houses'

import { getHiddenSingleInRowOrColHighlightData } from './rowOrColHiddenSingle'

import { getCellFilledWithNumberInHouse, getInhabitableCellData } from './hiddenSingle.helpers'
import { getHouseCells } from '../../../houseCells'

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

const getMustHighlightableNeighbourRows = (neighbourRows, hostCell, mainNumbers, cellsToFocusData) => {
    const result = {}
    Object.keys(neighbourRows).forEach(rowKey => {
        const rowNum = parseInt(rowKey, 10)
        if (!MainNumbersRecord.isCellFilled(mainNumbers, { row: rowNum, col: hostCell.col })) {
            const { candidateHostCell } = neighbourRows[rowKey]
            const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            setCellDataInHintResult({ row: rowNum, col: candidateHostCell.col }, cellHighlightData, cellsToFocusData)
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
            const { candidateHostCell } = neighbourCols[colKey]
            const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            setCellDataInHintResult({ row: candidateHostCell.row, col: colNum }, cellHighlightData, cellsToFocusData)
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
        const { candidateHostCell } = neighbourRows[row]
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
        setCellDataInHintResult({ row, col: candidateHostCell.col }, cellHighlightData, cellsToFocusData)
    } else if (Houses.isColHouse(instanceHouseType)) {
        highlightableNeighbourHousesWinnerCandidates.cols[col] = true
        const { candidateHostCell } = neighbourCols[col]
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
        setCellDataInHintResult({ row: candidateHostCell.row, col }, cellHighlightData, cellsToFocusData)
    }
}

export const getEmptyCellsCountAndCandidatePosition = (blockHouse, neighbourHouse, winnerCandidate, mainNumbers) => {
    const emptyCellsCount = getHousesCommonCells(blockHouse, neighbourHouse)
        .filter(cell => !MainNumbersRecord.isCellFilled(mainNumbers, cell))
        .length
    const cellFilledWithCandidateInRow = getCellFilledWithNumberInHouse(winnerCandidate, neighbourHouse, mainNumbers)
    if (emptyCellsCount === 0 || _isNil(cellFilledWithCandidateInRow)) return null

    return {
        emptyCellsCount,
        candidateHostCell: cellFilledWithCandidateInRow,
    }
}

export const getBlockCellRowOrColNeighbourHousesInBlock = (cell, neighbourHouseType) => {
    const result = []
    const { row: startRow, col: startCol } = getBlockStartCell(getBlockAndBoxNum(cell).blockNum)
    const blockCellHouseWithNeighbourHouseType = getCellHouseForHouseType(neighbourHouseType, cell)
    for (let i = 0; i < 3; i++) {
        const neighbourHouseNum = neighbourHouseType === HOUSE_TYPE.ROW ? startRow + i : startCol + i
        const neighbourHouse = { type: neighbourHouseType, num: neighbourHouseNum }
        if (!areSameHouses(neighbourHouse, blockCellHouseWithNeighbourHouseType)) result.push(neighbourHouse)
    }
    return result
}

// todo: RENAME
const getHostCellNeighbourHouseInfo = (hostCell, neighbourHouseType, mainNumbers) => {
    const result = {}
    const blockHouse = getCellBlockHouseInfo(hostCell)
    const winnerCandidate = MainNumbersRecord.getCellSolutionValue(mainNumbers, hostCell)
    getBlockCellRowOrColNeighbourHousesInBlock(hostCell, neighbourHouseType)
        .forEach(neighbourHouse => {
            const data = getEmptyCellsCountAndCandidatePosition(blockHouse, neighbourHouse, winnerCandidate, mainNumbers)
            if (data) result[neighbourHouse.num] = data
        })
    return result
}

const highlightBlockCells = (hostCell, mainNumbers, cellsToFocusData) => {
    getHouseCells(getCellBlockHouseInfo(hostCell))
        .forEach(cell => {
            if (areSameCells(cell, hostCell)) {
                const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.SELECTED }
                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            } else if (MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
                const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            } else {
                setCellDataInHintResult(cell, getInhabitableCellData(), cellsToFocusData)
            }
        })
}

const highlightCauseCells = (hostCell, mainNumbers, cellsToFocusData) => {
    const { blockNum: hostBlockNum } = getBlockAndBoxNum(hostCell)
    const hostCellNeighbourRowsInBlock = getHostCellNeighbourHouseInfo(hostCell, HOUSE_TYPE.ROW, mainNumbers)
    const hostCellNeighbourColsInBlock = getHostCellNeighbourHouseInfo(hostCell, HOUSE_TYPE.COL, mainNumbers)
    const highlightableNeighbourHousesWinnerCandidates = {
        rows: getMustHighlightableNeighbourRows(hostCellNeighbourRowsInBlock, hostCell, mainNumbers, cellsToFocusData),
        cols: getMustHighlightableNeighbourCols(hostCellNeighbourColsInBlock, hostCell, mainNumbers, cellsToFocusData),
    }

    for (let cellNo = 0; cellNo < CELLS_IN_HOUSE; cellNo++) {
        const { row, col } = getRowAndCol(hostBlockNum, cellNo)

        if (winnerInstanceHighlightableInCellSharedHouse({ row, col }, highlightableNeighbourHousesWinnerCandidates)) { continue }

        highlightNeighbourHouseNewWinnerInstance(
            { row, col },
            getNewHighlightableInstanceHouseType({ row, col }, hostCellNeighbourRowsInBlock, hostCellNeighbourColsInBlock),
            hostCellNeighbourRowsInBlock,
            hostCellNeighbourColsInBlock,
            highlightableNeighbourHousesWinnerCandidates,
            cellsToFocusData,
        )
    }
}

const getHiddenSingleInBlockHighlightData = (hostCell, mainNumbers) => {
    const cellsToFocusData = {}
    highlightBlockCells(hostCell, mainNumbers, cellsToFocusData)
    highlightCauseCells(hostCell, mainNumbers, cellsToFocusData)
    return cellsToFocusData
}

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
        ? getHiddenSingleInBlockHighlightData(cell, mainNumbers) // TODO: refactor it's flow
        : getHiddenSingleInRowOrColHighlightData(rawHint, mainNumbers)

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
