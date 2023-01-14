// NOTE: take some handlers from naked double or tripple as well
// they might come in handy in this hint

import { forEachHouse } from '../../util'
import { HOUSE_TYPE } from '../constants'
import { filterNakedGroupEligibleCellsInHouse } from '../nakedGroup/nakedGroup'
import { cellHasAllPossibleNotes } from '../validityTest/validity.helpers'

import { NOTES_COUNT_IN_ELIGIBLE_CELLS } from './remotePairs.constants'

export const getRemotePairsRawHints = (mainNumbers, notes, maxHintsThreshold) => {
    const cellsWithValidNotes = getAllValidCellsWithPairs(mainNumbers, notes)

    //
}

export const getAllValidCellsWithPairs = (mainNumbers, notes) => {
    const result = []
    forEachHouse(num => {
        const validCells = filterNakedGroupEligibleCellsInHouse(
            { type: HOUSE_TYPE.ROW, num },
            NOTES_COUNT_IN_ELIGIBLE_CELLS,
            mainNumbers,
            notes,
        ).filter(cell => cellHasAllPossibleNotes(cell, notes[cell.row][cell.col]))
        result.push(...validCells)
    })
    return result
}
