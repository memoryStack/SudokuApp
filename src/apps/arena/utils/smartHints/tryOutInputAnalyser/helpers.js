import _filter from '@lodash/filter'
import _isEmpty from '@lodash/isEmpty'

import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getMainNumbers } from '../../../store/selectors/board.selectors'
import { getTryOutMainNumbers } from '../../../store/selectors/smartHintHC.selectors'
import { isCellEmpty } from '../../util'

export const filterFilledCellsInTryOut = cells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())

    return _filter(cells, cell => isCellEmpty(cell, mainNumbers) && !isCellEmpty(cell, tryOutMainNumbers))
}

export const noInputInTryOut = focusedCells => _isEmpty(filterFilledCellsInTryOut(focusedCells))

// NOTE: run it only when we are sure that there is no cell
// which is filled wrongly in the try-out step
export const getCorrectFilledTryOutCandidates = (groupCells, tryOutMainNumbers) => {
    const result = []
    groupCells.forEach(cell => {
        if (!isCellEmpty(cell, tryOutMainNumbers)) {
            result.push(tryOutMainNumbers[cell.row][cell.col].value)
        }
    })
    return result
}

export const getCandidatesToBeFilled = (correctlyFilledGroupCandidates, groupCandidates) => groupCandidates
    .map(candidate => parseInt(candidate, 10))
    .filter(groupCandidate => !correctlyFilledGroupCandidates.includes(groupCandidate))
