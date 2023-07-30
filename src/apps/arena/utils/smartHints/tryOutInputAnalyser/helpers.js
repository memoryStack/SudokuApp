import _filter from '@lodash/filter'
import _isEmpty from '@lodash/isEmpty'
import { MainNumbersRecord } from '../../../RecordUtilities/boardMainNumbers'

import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getMainNumbers } from '../../../store/selectors/board.selectors'
import { getTryOutMainNumbers } from '../../../store/selectors/smartHintHC.selectors'

export const filterFilledCellsInTryOut = cells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())

    return _filter(cells, cell => !MainNumbersRecord.isCellFilled(mainNumbers, cell)
        && MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))
}

export const noInputInTryOut = focusedCells => _isEmpty(filterFilledCellsInTryOut(focusedCells))

// NOTE: run it only when we are sure that there is no cell
// which is filled wrongly in the try-out step
export const getCorrectFilledTryOutCandidates = (groupCells, tryOutMainNumbers) => {
    const result = []
    groupCells.forEach(cell => {
        if (MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)) {
            result.push(MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell))
        }
    })
    return result
}

export const getCandidatesToBeFilled = (correctlyFilledGroupCandidates, groupCandidates) => groupCandidates
    .map(candidate => parseInt(candidate, 10))
    .filter(groupCandidate => !correctlyFilledGroupCandidates.includes(groupCandidate))
