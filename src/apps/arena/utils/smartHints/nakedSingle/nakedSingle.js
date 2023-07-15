import _filter from '@lodash/filter'

import { CELLS_IN_HOUSE } from '../../../constants'

import { getHouseCells } from '../../houseCells'
import {
    isCellEmpty, getCellRowHouseInfo, getCellColHouseInfo, getCellBlockHouseInfo,
} from '../../util'

import { maxHintsLimitReached } from '../util'
import { isHintValid } from '../validityTest'
import { HINTS_IDS, NAKED_SINGLE_TYPES } from '../constants'

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
    const emptyCellsInHouse = _filter(getHouseCells(house), cell => isCellEmpty(cell, mainNumbers))
    return emptyCellsInHouse.length === 1
}

export const getNakedSingleRawHints = (mainNumbers, notes, maxHintsThreshold) => {
    const result = []

    // BOARD_LOOPER: 9
    hintsSearchLoop: for (let row = 0; row < CELLS_IN_HOUSE; row++) {
        for (let col = 0; col < CELLS_IN_HOUSE; col++) {
            if (maxHintsLimitReached(result, maxHintsThreshold)) break hintsSearchLoop
            if (!isCellEmpty({ row, col }, mainNumbers)) continue

            const cell = { row, col }
            // TODO: change "mainNumber" field name. it doesn't feel right.
            const { present, mainNumber } = isNakedSinglePresent(notes[row][col])
            const isValid = present && isHintValid({ type: HINTS_IDS.NAKED_SINGLE, data: { cell } })
            if (isValid) {
                result.push({ cell, mainNumber, type: getNakedSingleType(cell, mainNumbers) })
            }
        }
    }

    return result
}
