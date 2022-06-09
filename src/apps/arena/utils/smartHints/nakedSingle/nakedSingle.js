import { getBlockAndBoxNum, getRowAndCol } from '../../../../../utils/util'
import { isCellEmpty } from '../../util'
import { HINTS_IDS, NAKED_SINGLE_TYPES } from '../constants'
import { maxHintsLimitReached } from '../util'
import { isHintValid } from '../validityTest'
import { getUIHighlightData } from './uiHighlightData'

const isNakedSinglePresent = cellNotes => {
    let possibleCandidatesCount = 0
    let mainNumber = -1

    cellNotes.some(({ show, noteValue }) => {
        if (show) {
            possibleCandidatesCount++
            mainNumber = noteValue
        }
        return possibleCandidatesCount > 1
    })

    return {
        present: possibleCandidatesCount === 1,
        mainNumber: possibleCandidatesCount === 1 ? mainNumber : -1,
    }
}

const isOnlyEmptyCellInRow = (cell, mainNumbers) => {
    let cellsFilled = 0
    for (let col = 0; col < 9; col++) {
        if (!isCellEmpty({ row: cell.row, col }, mainNumbers)) cellsFilled++
    }
    return cellsFilled === 8
}

const isOnlyEmptyCellInCol = (cell, mainNumbers) => {
    let cellsFilled = 0
    for (let row = 0; row < 9; row++) {
        if (!isCellEmpty({ row, col: cell.col }, mainNumbers)) cellsFilled++
    }
    return cellsFilled === 8
}

const isOnlyEmptyCellInBlock = (cell, mainNumbers) => {
    let cellsFilled = 0
    const { blockNum } = getBlockAndBoxNum(cell)
    for (let boxNum = 0; boxNum < 9; boxNum++) {
        if (!isCellEmpty(getRowAndCol(blockNum, boxNum), mainNumbers)) cellsFilled++
    }
    return cellsFilled === 8
}

const getHouseType = (cell, mainNumbers) => {
    if (isOnlyEmptyCellInRow(cell, mainNumbers)) return NAKED_SINGLE_TYPES.ROW
    if (isOnlyEmptyCellInCol(cell, mainNumbers)) return NAKED_SINGLE_TYPES.COL
    if (isOnlyEmptyCellInBlock(cell, mainNumbers)) return NAKED_SINGLE_TYPES.BLOCK
    return NAKED_SINGLE_TYPES.MIX
}

const getNakedSinglesRawInfo = (mainNumbers, notesInfo, maxHintsThreshold) => {
    const result = []

    // BOARD_LOOPER: 9
    hintsSearchLoop: for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (mainNumbers[row][col].value) {
                continue
            }
            if (maxHintsLimitReached(result, maxHintsThreshold)) {
                break hintsSearchLoop
            }

            const cell = { row, col }
            // TODO: change "mainNumber" field name. it doesn't feel right.
            const { present, mainNumber } = isNakedSinglePresent(notesInfo[row][col])
            const isValid = present && isHintValid({ type: HINTS_IDS.NAKED_SINGLE, data: { cell } })
            if (present && isValid) {
                result.push({ cell, mainNumber, type: getHouseType(cell, mainNumbers) })
            }
        }
    }

    return result
}

const getAllNakedSingles = (mainNumbers, notesInfo, maxHintsThreshold) => {
    const singles = getNakedSinglesRawInfo(mainNumbers, notesInfo, maxHintsThreshold)
    return getUIHighlightData(singles, mainNumbers)
}

export { getAllNakedSingles, getNakedSinglesRawInfo }
