import _get from '@lodash/get'

import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'

import { BoardInputs } from '../utils/smartHints/tryOutInputAnalyser/types'
import { RemovableNotesInfo } from '../utils/smartHints/types'
import { isCellExists } from '../utils/util'

type BoardMainNumbers = Omit<BoardInputs, 'tryOutNotes' | 'actualNotes'>

// TODO: merge this with "filterFilledCellsInTryOut" or "noInputInTryOut"
export const cellHasTryOutInput = (cell: Cell, { actualMainNumbers, tryOutMainNumbers }: BoardMainNumbers) => !MainNumbersRecord.isCellFilled(actualMainNumbers, cell)
    && MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)

export const removableNoteFilledInCell = (
    cell: Cell,
    removableNotes: RemovableNotesInfo,
    tryOutMainNumbers: MainNumbers,
) => {
    const filledNumberInCell = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell)
    const noteRemovableHostCells = _get(removableNotes, filledNumberInCell, [])
    return isCellExists(cell, noteRemovableHostCells)
}
