import _includes from '@lodash/includes'

import { getStoreState } from '../../../redux/dispatch.helpers'
import { MainNumbersRecord } from '../RecordUtilities/boardMainNumbers'
import { getMainNumbers } from '../store/selectors/board.selectors'
import {
    getTryOutMainNumbers,
    getTryOutClickableCells,
    getRemovableNotesInfo,
} from '../store/selectors/smartHintHC.selectors'
import { RemovableNotesInfo } from '../utils/smartHints/types'
import { isCellExists } from '../utils/util'

// TODO: merge this with "filterFilledCellsInTryOut" or "noInputInTryOut"
export const cellHasTryOutInput = (cell: Cell) => {
    const actualMainNumbers = getMainNumbers(getStoreState())
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState()) as MainNumbers
    return !MainNumbersRecord.isCellFilled(actualMainNumbers, cell)
        && MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)
}

export const isCellTryOutClickable = (cell: Cell) => {
    const clickableCells = getTryOutClickableCells(getStoreState())
    if (clickableCells.length === 0) return true
    return isCellExists(cell, clickableCells)
}

export const removableNoteFilledInCell = (cell: Cell) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState()) as MainNumbers
    const { notes = [], hostCells = [] } = getRemovableNotesInfo(getStoreState()) || {} as RemovableNotesInfo
    if (!isCellExists(cell, hostCells)) return false
    const filledNumberInCell = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell)
    return _includes(notes, filledNumberInCell)
}
