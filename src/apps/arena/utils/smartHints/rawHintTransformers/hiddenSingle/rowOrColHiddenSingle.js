import _isNil from '@lodash/isNil'

import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'
import { getHouseCells } from '../../../houseCells'
import {
    areSameCells, getBlockAndBoxNum, getCellHouseForHouseType, getHousesCommonCells,
} from '../../../util'

import smartHintColorSystemReader from '../../colorSystem.reader'
import { HIDDEN_SINGLE_TYPES, HOUSE_TYPE, SMART_HINTS_CELLS_BG_COLOR } from '../../constants'
import { setCellDataInHintResult, transformCellBGColor } from '../../util'

import {
    getHostHouse,
    getInhabitableCellData,
    getNextNeighbourBlock,
    getNextBlockSearchDirection,
    getCellFilledWithNumberInHouse,
    shouldHighlightWinnerCandidateInstanceInBlock,
} from './hiddenSingle.helpers'

const highlightRowOrColHostHouseCells = (hostCell, hiddenSingleType, mainNumbers, cellsToFocusData, smartHintsColorSystem) => {
    getHouseCells(getHostHouse(hostCell, hiddenSingleType))
        .forEach(cell => {
            if (areSameCells(hostCell, cell)) {
                const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.SELECTED }
                setCellDataInHintResult(hostCell, cellHighlightData, cellsToFocusData)
            } else if (MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
                const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            } else {
                setCellDataInHintResult(cell, getInhabitableCellData(smartHintsColorSystem), cellsToFocusData)
            }
        })
}

const highlightCrossHouseCellFilledWithHSCandidate = (singleType, hostHouseCell, winnerCandidate, mainNumbers, cellsToFocusData, smartHintsColorSystem) => {
    const crossHouseType = singleType === HIDDEN_SINGLE_TYPES.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW
    const crossHouse = getCellHouseForHouseType(crossHouseType, hostHouseCell)
    const candidateInstanceCell = getCellFilledWithNumberInHouse(winnerCandidate, crossHouse, mainNumbers)
    const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
    setCellDataInHintResult(candidateInstanceCell, cellHighlightData, cellsToFocusData)
}

const highlightHSCauseCellsInBlockForRowOrColHS = ({
    blockNum, mainNumbers, cellsToFocusData, singleType, hostCell: hiddenSingleHostCell, smartHintsColorSystem,
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

const highlightHSCauseCellsForRowOrColHS = (hostCell, mainNumbers, singleType, cellsToFocusData, smartHintsColorSystem) => {
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

export const getHiddenSingleInRowOrColHighlightData = (rawHint, mainNumbers, smartHintsColorSystem) => {
    const { cell, type } = rawHint
    const cellsToFocusData = {}
    highlightRowOrColHostHouseCells(cell, type, mainNumbers, cellsToFocusData, smartHintsColorSystem)
    highlightHSCauseCellsForRowOrColHS(cell, mainNumbers, type, cellsToFocusData, smartHintsColorSystem)
    return cellsToFocusData
}
