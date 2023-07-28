import { getStoreState } from '../../../redux/dispatch.helpers'
import { MainNumbersRecord } from '../RecordUtilities/boardMainNumbers'
import { getMainNumbers } from '../store/selectors/board.selectors'
import {
    getTryOutMainNumbers,
    getTryOutClickableCells,
} from '../store/selectors/smartHintHC.selectors'
import { isCellExists } from '../utils/util'

// TODO: merge this with "filterFilledCellsInTryOut" or "noInputInTryOut"
export const cellHasTryOutInput = cell => {
    const actualMainNumbers = getMainNumbers(getStoreState())
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return !MainNumbersRecord.isCellFilled(actualMainNumbers, cell)
        && MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)
}

export const isCellTryOutClickable = cell => {
    const clickableCells = getTryOutClickableCells(getStoreState())
    if (clickableCells.length === 0) return true
    return isCellExists(cell, clickableCells)
}
