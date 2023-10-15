import _isNil from '@lodash/isNil'

import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'
import { getBlockAndBoxNum } from '../../../cellTransformers'
import { getHouseCells } from '../../../houseCells'
import {
    areSameCells, getCellHouseForHouseType, getHousesCommonCells,
} from '../../../util'

import smartHintColorSystemReader from '../../colorSystem.reader'
import { HIDDEN_SINGLE_TYPES, HOUSE_TYPE } from '../../constants'
import { HiddenSingleRawHint } from '../../hiddenSingle/types'
import { CellsFocusData, SmartHintsColorSystem } from '../../types'
import { setCellDataInHintResult, transformCellBGColor } from '../../util'

import {
    getHostHouse,
    getInhabitableCellData,
    getNextNeighbourBlock,
    getNextBlockSearchDirection,
    getCellFilledWithNumberInHouse,
    shouldHighlightWinnerCandidateInstanceInBlock,
} from './hiddenSingle.helpers'

const highlightRowOrColHostHouseCells = (
    hostCell: Cell,
    hiddenSingleType: HIDDEN_SINGLE_TYPES,
    mainNumbers: MainNumbers,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    getHouseCells(getHostHouse(hostCell, hiddenSingleType))
        .forEach(cell => {
            if (areSameCells(hostCell, cell)) {
                const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.selectedCellBGColor(smartHintsColorSystem)) }
                setCellDataInHintResult(hostCell, cellHighlightData, cellsToFocusData)
            } else if (MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
                const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            } else {
                setCellDataInHintResult(cell, getInhabitableCellData(smartHintsColorSystem), cellsToFocusData)
            }
        })
}

const highlightCrossHouseCellFilledWithHSCandidate = (
    singleType: HIDDEN_SINGLE_TYPES,
    hostHouseCell: Cell,
    winnerCandidate: SolutionValue,
    mainNumbers: MainNumbers,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const crossHouseType = singleType === HIDDEN_SINGLE_TYPES.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW
    const crossHouse = getCellHouseForHouseType(crossHouseType, hostHouseCell)
    const candidateInstanceCell = getCellFilledWithNumberInHouse(winnerCandidate, crossHouse, mainNumbers)
    const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
    setCellDataInHintResult(candidateInstanceCell, cellHighlightData, cellsToFocusData)
}

const highlightHSCauseCellsInBlockForRowOrColHS = ({
    blockNum, mainNumbers, cellsToFocusData, singleType, hostCell: hiddenSingleHostCell, smartHintsColorSystem,
}: {
    blockNum: number,
    mainNumbers: MainNumbers,
    cellsToFocusData: CellsFocusData,
    singleType: HIDDEN_SINGLE_TYPES,
    hostCell: Cell,
    smartHintsColorSystem: SmartHintsColorSystem,
}) => {
    const winnerCandidate = MainNumbersRecord.getCellSolutionValue(mainNumbers, hiddenSingleHostCell)
    const blockHouse = { type: HOUSE_TYPE.BLOCK, num: blockNum }
    const winnerCandidateHostCellInBlock = getCellFilledWithNumberInHouse(winnerCandidate, blockHouse, mainNumbers)
    const highlightWinnerCandidateNumberInBlock = !!winnerCandidateHostCellInBlock
        && shouldHighlightWinnerCandidateInstanceInBlock(getHostHouse(hiddenSingleHostCell, singleType), blockHouse, mainNumbers)
    if (highlightWinnerCandidateNumberInBlock) {
        const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        setCellDataInHintResult(winnerCandidateHostCellInBlock, cellHighlightData, cellsToFocusData)
    } else {
        getHousesCommonCells(blockHouse, getHostHouse(hiddenSingleHostCell, singleType))
            .filter(blockCell => !areSameCells(blockCell, hiddenSingleHostCell))
            .forEach(blockCell => {
                if (!MainNumbersRecord.isCellFilled(mainNumbers, blockCell) && _isNil(winnerCandidateHostCellInBlock)) {
                    highlightCrossHouseCellFilledWithHSCandidate(singleType, blockCell, winnerCandidate, mainNumbers, cellsToFocusData, smartHintsColorSystem)
                }
            })
    }
}

const highlightHSCauseCellsForRowOrColHS = (
    hostCell: Cell,
    mainNumbers: MainNumbers,
    singleType: HIDDEN_SINGLE_TYPES,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    let blocksCount = 3
    let { blockNum: blockNumToHighlight } = getBlockAndBoxNum(hostCell)
    while (blocksCount--) {
        highlightHSCauseCellsInBlockForRowOrColHS({
            blockNum: blockNumToHighlight,
            mainNumbers,
            cellsToFocusData,
            singleType,
            hostCell,
            smartHintsColorSystem,
        })
        blockNumToHighlight = getNextNeighbourBlock(blockNumToHighlight, getNextBlockSearchDirection(singleType))
    }
}

export const getHiddenSingleInRowOrColHighlightData = (
    rawHint: HiddenSingleRawHint,
    mainNumbers: MainNumbers,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const { cell, type } = rawHint
    const cellsToFocusData = {}
    highlightRowOrColHostHouseCells(cell, type, mainNumbers, cellsToFocusData, smartHintsColorSystem)
    highlightHSCauseCellsForRowOrColHS(cell, mainNumbers, type, cellsToFocusData, smartHintsColorSystem)
    return cellsToFocusData
}
