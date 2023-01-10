// NOTE: take some handlers from naked double or tripple as well
// they might come in handy in this hint

import { forEachHouse } from '../../util'
import { HOUSE_TYPE } from '../constants'
import { filterNakedGroupEligibleCellsInHouse } from '../nakedGroup/nakedGroup'

export const getAllCellsWithPairs = (mainNumbers, notes) => {
    const result = []
    forEachHouse(num => {
        result.push(...filterNakedGroupEligibleCellsInHouse(
            { type: HOUSE_TYPE.ROW, num },
            2,
            mainNumbers,
            notes,
        ))
    })
    return result
}

export const getRemotePairsRawHints = (mainNumbers, notes, maxHintsThreshold) => null
