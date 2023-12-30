import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _isNil from '@lodash/isNil'

import { getLinkHTMLText } from 'src/apps/hintsVocabulary/vocabExplainations/utils'
import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'
import { BOARD_MOVES_TYPES } from '../../../../constants'

import {
    areSameCells,
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
    HOUSE_TYPE,
    HOUSE_TYPE_VS_FULL_NAMES,
} from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import smartHintColorSystemReader from '../../colorSystem.reader'

import { getCellsAxesValuesListText } from '../helpers'

import { getHiddenSingleInRowOrColHighlightData } from './rowOrColHiddenSingle'
import { getCellFilledWithNumberInHouse, getInhabitableCellData } from './hiddenSingle.helpers'
import { getBlockAndBoxNum } from '../../../cellTransformers'
import {
    AddMainNumberHintAction, CellsFocusData, SmartHintsColorSystem, TransformedRawHint,
} from '../../types'
import { HiddenSingleRawHint } from '../../hiddenSingle/types'
import { HiddenSingleTransformerArgs } from './types'
import { HOUSE_TYPE_VS_VOCAB_ID } from '../constants'

// this file has highlighting for Block Type Hidden Single
type NeighbourHouseImpact = {
    emptyCellsCount: number
    candidateHostCell: Cell
}

type NeighbourHousesImpact = {
    // Note: this 'string' type here is string representatin of HouseNum type
    [key: string]: NeighbourHouseImpact
}

type NeighbourHousesCandidateToHighlight = {
    rows: { [key: HouseNum]: boolean }
    cols: { [key: HouseNum]: boolean }
}
type NeighbourHousesTypes = keyof NeighbourHousesCandidateToHighlight

const getNewHighlightableInstanceHouseType = (
    { row, col }: Cell,
    neighbourRows: NeighbourHousesImpact,
    neighbourCols: NeighbourHousesImpact,
) => {
    let result: HouseType = ''
    if (neighbourRows[row] && neighbourCols[col]) {
        const cellsRuledOutByRowInstance = neighbourRows[row].emptyCellsCount
        const cellsRuledOutByColInstance = neighbourCols[col].emptyCellsCount
        result = cellsRuledOutByRowInstance > cellsRuledOutByColInstance ? HOUSE_TYPE.ROW : HOUSE_TYPE.COL
    }
    if (!neighbourRows[row] && neighbourCols[col]) result = HOUSE_TYPE.COL
    if (neighbourRows[row] && !neighbourCols[col]) result = HOUSE_TYPE.ROW
    return result
}

export const getMustHighlightableNeighbourHouses = (neighbourHousesType: HouseType, hostCell: Cell, mainNumbers: MainNumbers) => {
    const result: { [key: HouseNum]: boolean } = {}
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

const causeCellAlreadyHighlightedForBlockCell = (cell: Cell, highlightableNeighbourHousesWinnerCandidates: NeighbourHousesCandidateToHighlight) => (
    highlightableNeighbourHousesWinnerCandidates.rows[cell.row]
    || highlightableNeighbourHousesWinnerCandidates.cols[cell.col]
)

const setNewNeighbourHouseWithCandidateToHighlight = (
    { row, col }: Cell,
    neighbourRows: NeighbourHousesImpact,
    neighbourCols: NeighbourHousesImpact,
    highlightableNeighbourHousesWinnerCandidates: NeighbourHousesCandidateToHighlight,
) => {
    const instanceHouseType = getNewHighlightableInstanceHouseType({ row, col }, neighbourRows, neighbourCols)
    if (Houses.isRowHouse(instanceHouseType)) {
        highlightableNeighbourHousesWinnerCandidates.rows[row] = true
    } else if (Houses.isColHouse(instanceHouseType)) {
        highlightableNeighbourHousesWinnerCandidates.cols[col] = true
    }
}

export const getEmptyCellsCountAndCandidatePosition = (
    blockHouse: House,
    neighbourHouse: House,
    winnerCandidate: SolutionValue,
    mainNumbers: MainNumbers,
): NeighbourHouseImpact | null => {
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

export const getBlockCellRowOrColNeighbourHousesInBlock = (cell: Cell, neighbourHouseType: HouseType) => {
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

const getHostCellNeighbourHouseInfo = (hostCell: Cell, neighbourHouseType: HouseType, mainNumbers: MainNumbers) => {
    const result: NeighbourHousesImpact = {}
    const blockHouse = getCellBlockHouseInfo(hostCell)
    const winnerCandidate = MainNumbersRecord.getCellSolutionValue(mainNumbers, hostCell)
    getBlockCellRowOrColNeighbourHousesInBlock(hostCell, neighbourHouseType)
        .forEach(neighbourHouse => {
            const data = getEmptyCellsCountAndCandidatePosition(blockHouse, neighbourHouse, winnerCandidate, mainNumbers)
            if (data) result[neighbourHouse.num] = data
        })
    return result
}

const highlightBlockCells = (hostCell: Cell, mainNumbers: MainNumbers, cellsToFocusData: CellsFocusData, smartHintsColorSystem: SmartHintsColorSystem) => {
    getHouseCells(getCellBlockHouseInfo(hostCell))
        .forEach(cell => {
            if (areSameCells(cell, hostCell)) {
                const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.selectedCellBGColor(smartHintsColorSystem)) }
                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            } else if (MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
                const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            } else {
                setCellDataInHintResult(cell, getInhabitableCellData(smartHintsColorSystem), cellsToFocusData)
            }
        })
}

const getAllNeighbourHousesWithCandidateToHighlight = (
    hostCellNeighbourRowsInBlock: NeighbourHousesImpact,
    hostCellNeighbourColsInBlock: NeighbourHousesImpact,
    hostCell: Cell,
    mainNumbers: MainNumbers,
) => {
    const result = {
        rows: getMustHighlightableNeighbourHouses(HOUSE_TYPE.ROW, hostCell, mainNumbers),
        cols: getMustHighlightableNeighbourHouses(HOUSE_TYPE.COL, hostCell, mainNumbers),
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

const highlightCauseCells = (
    hostCell: Cell,
    mainNumbers: MainNumbers,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const hostCellNeighbourRowsInBlock = getHostCellNeighbourHouseInfo(hostCell, HOUSE_TYPE.ROW, mainNumbers)
    const hostCellNeighbourColsInBlock = getHostCellNeighbourHouseInfo(hostCell, HOUSE_TYPE.COL, mainNumbers)

    const neighbourHousesWithCandidateToHighlight = getAllNeighbourHousesWithCandidateToHighlight(
        hostCellNeighbourRowsInBlock,
        hostCellNeighbourColsInBlock,
        hostCell,
        mainNumbers,
    )

    Object.keys(neighbourHousesWithCandidateToHighlight).forEach(neighbourHousesKey => {
        Object.keys(neighbourHousesWithCandidateToHighlight[neighbourHousesKey as NeighbourHousesTypes])
            .forEach(houseNum => {
                const { candidateHostCell } = neighbourHousesKey === 'rows' ? hostCellNeighbourRowsInBlock[houseNum]
                    : hostCellNeighbourColsInBlock[houseNum]
                const cellHighlightData = {
                    bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)),
                }
                setCellDataInHintResult(candidateHostCell, cellHighlightData, cellsToFocusData)
            })
    })
}

const getHiddenSingleInBlockHighlightData = (hostCell: Cell, mainNumbers: MainNumbers, smartHintsColorSystem: SmartHintsColorSystem) => {
    const cellsToFocusData = {}
    highlightBlockCells(hostCell, mainNumbers, cellsToFocusData, smartHintsColorSystem)
    highlightCauseCells(hostCell, mainNumbers, cellsToFocusData, smartHintsColorSystem)
    return cellsToFocusData
}

const getHiddenSingleLogic = (rawHint: HiddenSingleRawHint, solutionValue: SolutionValue, filledCellsWithSolutionValue: Cell[]) => {
    const { type: houseType, cell } = rawHint
    const msgPlaceholdersValues = {
        houseType: getLinkHTMLText(HOUSE_TYPE_VS_VOCAB_ID[houseType], HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME),
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

const getApplyHintData = (rawHint: HiddenSingleRawHint): AddMainNumberHintAction[] => {
    const { cell, mainNumber } = rawHint
    return [
        {
            cell,
            action: { type: BOARD_MOVES_TYPES.ADD, mainNumber },
        },
    ]
}

export const transformHiddenSingleRawHint = ({ rawHint, mainNumbers, smartHintsColorSystem } : HiddenSingleTransformerArgs): TransformedRawHint => {
    const { cell, type } = rawHint

    const cellsToFocusData = type === HIDDEN_SINGLE_TYPES.BLOCK
        ? getHiddenSingleInBlockHighlightData(cell, mainNumbers, smartHintsColorSystem)
        : getHiddenSingleInRowOrColHighlightData(rawHint, mainNumbers, smartHintsColorSystem)

    const hiddenSingleCellSolutionValue = MainNumbersRecord.getCellSolutionValue(mainNumbers, cell)

    const filledCellsWithSolutionValue = getCellsFromCellsToFocusedData(cellsToFocusData)
        .filter(aCell => MainNumbersRecord.isCellFilledWithNumber(mainNumbers, hiddenSingleCellSolutionValue, aCell))

    return {
        type: HINTS_IDS.HIDDEN_SINGLE,
        cellsToFocusData,
        title: HINT_ID_VS_TITLES[HINTS_IDS.HIDDEN_SINGLE],
        steps: [{ text: getHiddenSingleLogic(rawHint, hiddenSingleCellSolutionValue, filledCellsWithSolutionValue) }],
        selectCellOnClose: cell,
        applyHint: getApplyHintData(rawHint),
    }
}
