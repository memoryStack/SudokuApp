import { getStoreState } from '../../../redux/dispatch.helpers'
import { getMainNumbers } from '../store/selectors/board.selectors'
import {
    getTryOutMainNumbers,
    getTryOutClickableCells,
} from '../store/selectors/smartHintHC.selectors'
import { isCellEmpty, isCellExists } from '../utils/util'

export const cellHasTryOutInput = cell => {
    const actualMainNumbers = getMainNumbers(getStoreState())
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return isCellEmpty(cell, actualMainNumbers) && !isCellEmpty(cell, tryOutMainNumbers)
}

export const isCellTryOutClickable = cell => {
    const clickableCells = getTryOutClickableCells(getStoreState())
    if (clickableCells.length === 0) return true
    return isCellExists(cell, clickableCells)
}
