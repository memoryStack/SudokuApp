import { MainNumbersRecord } from '../RecordUtilities/boardMainNumbers'

import { isCellExists } from '../utils/util'

// TODO: merge this with "filterFilledCellsInTryOut" or "noInputInTryOut"
export const cellHasTryOutInput = (cell, actualMainNumbers, tryOutMainNumbers) => !MainNumbersRecord.isCellFilled(actualMainNumbers, cell)
    && MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)

export const isCellTryOutClickable = (cell, clickableCells) => {
    if (clickableCells.length === 0) return true
    return isCellExists(cell, clickableCells)
}
