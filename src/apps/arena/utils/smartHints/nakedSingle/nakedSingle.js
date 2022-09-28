import _filter from 'lodash/src/utils/filter'

import { CELLS_IN_HOUSE } from '../../../constants'
import { getHouseCells } from '../../houseCells'
import { isCellEmpty, getCellRowHouseInfo, getCellColHouseInfo, getCellBlockHouseInfo } from '../../util'
import { HINTS_IDS, NAKED_SINGLE_TYPES } from '../constants'
import { maxHintsLimitReached } from '../util'
import { isHintValid } from '../validityTest'
import { getUIHighlightData } from './uiHighlightData'

// TODO: put it in utils and refactore it with unit test cases
export const isNakedSinglePresent = cellNotes => {
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

const getNakedSingleType = (cell, mainNumbers) => {
    if (isOnlyOneCellEmptyInHouse(getCellRowHouseInfo(cell), mainNumbers)) return NAKED_SINGLE_TYPES.ROW
    if (isOnlyOneCellEmptyInHouse(getCellColHouseInfo(cell), mainNumbers)) return NAKED_SINGLE_TYPES.COL
    if (isOnlyOneCellEmptyInHouse(getCellBlockHouseInfo(cell), mainNumbers)) return NAKED_SINGLE_TYPES.BLOCK
    return NAKED_SINGLE_TYPES.MIX
}

const isOnlyOneCellEmptyInHouse = (house, mainNumbers) => {
    const emptyCellsInHouse = _filter(getHouseCells(house.type, house.num), cell => {
        return isCellEmpty(cell, mainNumbers)
    })
    return emptyCellsInHouse.length === 1
}

const getNakedSinglesRawInfo = (mainNumbers, notesInfo, maxHintsThreshold) => {
    const result = []

    // BOARD_LOOPER: 9
    hintsSearchLoop: for (let row = 0; row < CELLS_IN_HOUSE; row++) {
        for (let col = 0; col < CELLS_IN_HOUSE; col++) {
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
                result.push({ cell, mainNumber, type: getNakedSingleType(cell, mainNumbers) })
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
