import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { MainNumbersRecord } from '../../../RecordUtilities/boardMainNumbers'
import { CELLS_IN_HOUSE } from '../../../constants'

import { isHintValid } from '../validityTest'
import { maxHintsLimitReached } from '../util'
import { HIDDEN_SINGLE_TYPES, HINTS_IDS } from '../constants'

const getCellHiddenSingle = (cell, notesData) => {
    let singleType = ''

    const possibleCandiates = NotesRecord.getCellVisibleNotesList(notesData, cell)

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

export const getHiddenSingleRawHints = (mainNumbers, notesData, maxHintsThreshold) => {
    const result = []

    for (let row = 0; row < CELLS_IN_HOUSE; row++) {
        for (let col = 0; col < CELLS_IN_HOUSE; col++) {
            if (maxHintsLimitReached(result, maxHintsThreshold)) break

            const cell = { row, col }
            const skipCheckingHiddenSingle = MainNumbersRecord.isCellFilled(mainNumbers, cell)
                || isHintValid({ type: HINTS_IDS.NAKED_SINGLE, data: { cell } })
            if (skipCheckingHiddenSingle) continue

            const { present, type, mainNumber } = getCellHiddenSingle(cell, notesData)
            if (present) result.push({ cell, mainNumber, type })
        }
    }

    return result
}
