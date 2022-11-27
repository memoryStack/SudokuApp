import _isEmpty from 'lodash/src/utils/isEmpty'

import { HIDDEN_SINGLE_TYPES, HINTS_IDS } from '../constants'
import { isCellEmpty } from '../../util'
import { getHiddenSingleTechniqueInfo } from './uiHighlightData'
import { isHintValid } from '../validityTest'
import { maxHintsLimitReached } from '../util'
import { CELLS_IN_HOUSE } from '../../../constants'

const getCellHiddenSingle = (cell, notesData) => {
    const { row, col } = cell
    let singleType = ''

    const possibleCandiates = []
    notesData[row][col].forEach(({ noteValue, show }) => {
        if (show) possibleCandiates.push(noteValue)
    })

    let singleCandidate = -1
    possibleCandiates.some(candidate => {
        singleCandidate = candidate
        if (
            isHintValid({ type: HINTS_IDS.HIDDEN_SINGLE, data: { cell, type: HIDDEN_SINGLE_TYPES.BLOCK, candidate } })
        ) {
            singleType = HIDDEN_SINGLE_TYPES.BLOCK
            return true
        }

        if (isHintValid({ type: HINTS_IDS.HIDDEN_SINGLE, data: { cell, type: HIDDEN_SINGLE_TYPES.COL, candidate } })) {
            singleType = HIDDEN_SINGLE_TYPES.COL
            return true
        }

        if (isHintValid({ type: HINTS_IDS.HIDDEN_SINGLE, data: { cell, type: HIDDEN_SINGLE_TYPES.ROW, candidate } })) {
            singleType = HIDDEN_SINGLE_TYPES.ROW
            return true
        }

        return false
    })

    return {
        present: singleType !== '',
        type: singleType,
        mainNumber: singleCandidate,
    }
}

const getHiddenSinglesRawInfo = (mainNumbers, notesData, maxHintsThreshold) => {
    const result = []

    // BOARD_LOOPER: 8
    hintsSearchLoop: for (let row = 0; row < CELLS_IN_HOUSE; row++) {
        for (let col = 0; col < CELLS_IN_HOUSE; col++) {
            if (maxHintsLimitReached(result, maxHintsThreshold)) {
                break hintsSearchLoop
            }

            const cell = { row, col }
            const skipCheckingHiddenSingle =
                !isCellEmpty(cell, mainNumbers) || isHintValid({ type: HINTS_IDS.NAKED_SINGLE, data: { cell } })
            if (skipCheckingHiddenSingle) continue

            const { present, type, mainNumber } = getCellHiddenSingle(cell, notesData)
            if (present) result.push({ cell, mainNumber, type })
        }
    }
    return result
}

// TODO: remove the wrapper
const getAllHiddenSingles = (mainNumbers, notesData, maxHintsThreshold) => {
    return getHiddenSinglesRawInfo(mainNumbers, notesData, maxHintsThreshold)
}

export { getAllHiddenSingles, getHiddenSinglesRawInfo }
