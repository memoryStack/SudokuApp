import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _isNil from '@lodash/isNil'

import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'
import { BOARD_MOVES_TYPES } from '../../../../constants'

import {
    areSameCells,
    getBlockAndBoxNum,
    getCellAxesValues,
    getBlockStartCell,
    getCellBlockHouseInfo,
    getHousesCommonCells,
    getCellHouseForHouseType,
    areSameHouses,
} from '../../../util'
import { getHouseCells } from '../../../houseCells'
import { Houses } from '../../../classes/houses'

import { getCellsFromCellsToFocusedData, setCellDataInHintResult, transformCellBGColor } from '../../util'
import {
    HIDDEN_SINGLE_TYPES,
    HINTS_IDS,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
    SMART_HINTS_CELLS_BG_COLOR,
    HOUSE_TYPE,
} from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import smartHintColorSystemReader from '../../colorSystemReader'

import { getCellsAxesValuesListText } from '../helpers'

import { getHiddenSingleInRowOrColHighlightData } from './rowOrColHiddenSingle'
import { getCellFilledWithNumberInHouse, getInhabitableCellData } from './hiddenSingle.helpers'

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

export const getMustHighlightableNeighbourHouses = (neighbourHousesType, hostCell, mainNumbers) => {
    const result = {}
    const neighbourHousesCrossHouseType = neighbourHousesType === HOUSE_TYPE.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW
    const hostCellCrossHouseWRTNeighbourHouses = getCellHouseForHouseType(neighbourHousesCrossHouseType, hostCell)
    const blockHouse = getCellBlockHouseInfo(hostCell)

    getHousesCommonCells(blockHouse, hostCellCrossHouseWRTNeighbourHouses)
        .forEach(cell => {
            if (!areSameCells(cell, hostCell)) {
                if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
                    const neighbourHosueNum = neighbourHousesType === HOUSE_TYPE.ROW ? cell.row : cell.col
                    result[neighbourHosueNum] = true
                }
            }
        })

    return result
}

const causeCellAlreadyHighlightedForBlockCell = (cell, highlightableNeighbourHousesWinnerCandidates) => (
    highlightableNeighbourHousesWinnerCandidates.rows[cell.row]
    || highlightableNeighbourHousesWinnerCandidates.cols[cell.col]
)

const setNewNeighbourHouseWithCandidateToHighlight = (
    { row, col },
    neighbourRows,
    neighbourCols,
    highlightableNeighbourHousesWinnerCandidates,
) => {
    const instanceHouseType = getNewHighlightableInstanceHouseType({ row, col }, neighbourRows, neighbourCols)
    if (Houses.isRowHouse(instanceHouseType)) {
        highlightableNeighbourHousesWinnerCandidates.rows[row] = true
    } else if (Houses.isColHouse(instanceHouseType)) {
        highlightableNeighbourHousesWinnerCandidates.cols[col] = true
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

const highlightBlockCells = (hostCell, mainNumbers, cellsToFocusData, smartHintsColorSystem) => {
    getHouseCells(getCellBlockHouseInfo(hostCell))
        .forEach(cell => {
            if (areSameCells(cell, hostCell)) {
                const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.SELECTED }
                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            } else if (MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
                const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            } else {
                setCellDataInHintResult(cell, getInhabitableCellData(), cellsToFocusData)
            }
        })
}

const getAllNeighbourHousesWithCandidateToHighlight = (hostCellNeighbourRowsInBlock, hostCellNeighbourColsInBlock, hostCell, mainNumbers) => {
    const result = {
        rows: getMustHighlightableNeighbourHouses(hostCellNeighbourRowsInBlock, HOUSE_TYPE.ROW, hostCell, mainNumbers),
        cols: getMustHighlightableNeighbourHouses(hostCellNeighbourColsInBlock, HOUSE_TYPE.COL, hostCell, mainNumbers),
    }

    const blockCells = getHouseCells(getCellBlockHouseInfo(hostCell))

    for (let cellNo = 0; cellNo < blockCells.length; cellNo++) {
        const blockCell = blockCells[cellNo]
        if (MainNumbersRecord.isCellFilled(mainNumbers, blockCell)
            || causeCellAlreadyHighlightedForBlockCell(blockCell, result)) continue

        setNewNeighbourHouseWithCandidateToHighlight(
            blockCell,
            hostCellNeighbourRowsInBlock,
            hostCellNeighbourColsInBlock,
            result,
        )
    }

    return result
}

const highlightCauseCells = (hostCell, mainNumbers, cellsToFocusData, smartHintsColorSystem) => {
    const hostCellNeighbourRowsInBlock = getHostCellNeighbourHouseInfo(hostCell, HOUSE_TYPE.ROW, mainNumbers)
    const hostCellNeighbourColsInBlock = getHostCellNeighbourHouseInfo(hostCell, HOUSE_TYPE.COL, mainNumbers)

    const neighbourHousesWithCandidateToHighlight = getAllNeighbourHousesWithCandidateToHighlight(
        hostCellNeighbourRowsInBlock,
        hostCellNeighbourColsInBlock,
        hostCell,
        mainNumbers,
    )

    Object.keys(neighbourHousesWithCandidateToHighlight).forEach(neighbourHousesKey => {
        Object.keys(neighbourHousesWithCandidateToHighlight[neighbourHousesKey]).forEach(houseNum => {
            const { candidateHostCell } = neighbourHousesKey === 'rows' ? hostCellNeighbourRowsInBlock[houseNum]
                : hostCellNeighbourColsInBlock[houseNum]
            const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
            setCellDataInHintResult(candidateHostCell, cellHighlightData, cellsToFocusData)
        })
    })
}

const getHiddenSingleInBlockHighlightData = (hostCell, mainNumbers, smartHintsColorSystem) => {
    const cellsToFocusData = {}
    highlightBlockCells(hostCell, mainNumbers, cellsToFocusData, smartHintsColorSystem)
    highlightCauseCells(hostCell, mainNumbers, cellsToFocusData, smartHintsColorSystem)
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

export const transformHiddenSingleRawHint = ({ rawHint, mainNumbers, smartHintsColorSystem }) => {
    const { cell, type } = rawHint

    const cellsToFocusData = type === HIDDEN_SINGLE_TYPES.BLOCK
        ? getHiddenSingleInBlockHighlightData(cell, mainNumbers, smartHintsColorSystem)
        : getHiddenSingleInRowOrColHighlightData(rawHint, mainNumbers, smartHintsColorSystem)

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
