import { getStoreState } from '../../../redux/dispatch.helpers'
import { getMainNumbers } from '../store/selectors/board.selectors'
import { getTryOutMainNumbers, getTryOutSelectedCell } from '../store/selectors/smartHintHC.selectors'
import { isCellEmpty } from '../utils/util'

export const cellHasTryOutInput = cell => {
    const selectedCell = cell || getTryOutSelectedCell(getStoreState())
    const actualMainNumbers = getMainNumbers(getStoreState())
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return isCellEmpty(selectedCell, actualMainNumbers) && !isCellEmpty(selectedCell, tryOutMainNumbers)
}
