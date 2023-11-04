import _get from '@lodash/get'

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
    const removableNotes = getRemovableNotesInfo(getStoreState()) || {} as RemovableNotesInfo
    const filledNumberInCell = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell)
    const noteRemovableHostCells = _get(removableNotes, filledNumberInCell, [])
    return isCellExists(cell, noteRemovableHostCells)
}
