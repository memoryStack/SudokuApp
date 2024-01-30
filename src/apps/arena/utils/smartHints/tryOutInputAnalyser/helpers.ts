import _filter from '@lodash/filter'
import _isEmpty from '@lodash/isEmpty'
import _some from '@lodash/some'

import { cellHasTryOutInput } from '../../../smartHintHC/helpers'
import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { MainNumbersRecord } from '../../../RecordUtilities/boardMainNumbers'

import { BoardInputs } from './types'
import { isNakedSinglePresent } from '../nakedSingle/nakedSingle'

export const filterFilledCellsInTryOut = (cells: Cell[], boardInputs: BoardInputs): Cell[] => {
    const { tryOutMainNumbers, actualMainNumbers } = boardInputs
    return _filter(cells, (cell: Cell) => !MainNumbersRecord.isCellFilled(actualMainNumbers, cell)
        && MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))
}

export const filterCellsWithoutTryoutInput = (cells: Cell[], boardInputs: BoardInputs) => {
    const { tryOutMainNumbers } = boardInputs
    return _filter(cells, (cell: Cell) => !MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))
}

export const noInputInTryOut = (focusedCells: Cell[], boardInputs: BoardInputs) => _isEmpty(filterFilledCellsInTryOut(focusedCells, boardInputs))

// NOTE: run it only when we are sure that there is no cell
// which is filled wrongly in the try-out step
export const getCorrectFilledTryOutCandidates = (groupCells: Cell[], tryOutMainNumbers: MainNumbers) => {
    const result: number[] = []
    groupCells.forEach(cell => {
        if (MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)) {
            result.push(MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell))
        }
    })
    return result
}

export const getCandidatesToBeFilled = (correctlyFilledGroupCandidates: number[], groupCandidates: number[]) => groupCandidates
    .filter(groupCandidate => !correctlyFilledGroupCandidates.includes(groupCandidate))

export const isCellWithoutAnyCandidate = (cell: Cell, boardInputs: BoardInputs) => {
    const { tryOutMainNumbers, tryOutNotes } = boardInputs
    return !MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)
        && NotesRecord.getCellVisibleNotesCount(tryOutNotes, cell) === 0
}

export const getCellsWithNoCandidates = (cells: Cell[], boardInputs: BoardInputs) => cells.filter(cell => isCellWithoutAnyCandidate(cell, boardInputs))

export const anyCellHasTryOutInput = (cells: Cell[], { tryOutMainNumbers, actualMainNumbers }: BoardInputs) => _some(cells, (cell: Cell) => cellHasTryOutInput(cell, { tryOutMainNumbers, actualMainNumbers }))

export const filterNakedSingleCells = (cells: Cell[], boardInputs: BoardInputs) => {
    return cells.filter((cell) => {
        return NotesRecord.getCellVisibleNotesCount(boardInputs.tryOutNotes, cell) === 1
    })
}
