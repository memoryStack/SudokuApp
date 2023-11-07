import _filter from '@lodash/filter'
import _isEmpty from '@lodash/isEmpty'
import _some from '@lodash/some'

import { cellHasTryOutInput } from '../../../smartHintHC/helpers'
import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { MainNumbersRecord } from '../../../RecordUtilities/boardMainNumbers'

import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getMainNumbers } from '../../../store/selectors/board.selectors'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'

export const filterFilledCellsInTryOut = (cells: Cell[]) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState()) as MainNumbers
    const mainNumbers = getMainNumbers(getStoreState())

    return _filter(cells, (cell: Cell) => !MainNumbersRecord.isCellFilled(mainNumbers, cell)
        && MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))
}

export const filterCellsWithoutTryoutInput = (cells: Cell[]) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState()) as MainNumbers
    return _filter(cells, (cell: Cell) => !MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))
}

export const noInputInTryOut = (focusedCells: Cell[]) => _isEmpty(filterFilledCellsInTryOut(focusedCells))

// NOTE: run it only when we are sure that there is no cell
// which is filled wrongly in the try-out step
export const getCorrectFilledTryOutCandidates = (groupCells : Cell[], tryOutMainNumbers: MainNumbers) => {
    const result: number[] = []
    groupCells.forEach(cell => {
        if (MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)) {
            result.push(MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell))
        }
    })
    return result
}

// TODO: fix it's type
export const getCandidatesToBeFilled = (correctlyFilledGroupCandidates: number[], groupCandidates: number[]) => groupCandidates
    .map(candidate => parseInt(candidate, 10))
    .filter(groupCandidate => !correctlyFilledGroupCandidates.includes(groupCandidate))

export const isCellWithoutAnyCandidate = (cell: Cell) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState()) as MainNumbers
    const tryOutNotesInfo = getTryOutNotes(getStoreState()) as Notes
    return !MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)
    && NotesRecord.getCellVisibleNotesCount(tryOutNotesInfo, cell) === 0
}

export const getCellsWithNoCandidates = (focusedCells: Cell[]) => focusedCells.filter(cell => isCellWithoutAnyCandidate(cell))

export const anyCellFilledWithGivenCandidate = (cells: Cell[], candidate: number) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState()) as MainNumbers
    return cells.some(cell => MainNumbersRecord.isCellFilledWithNumber(tryOutMainNumbers, candidate, cell))
}

export const anyCellHasTryOutInput = (cells: Cell[]) => _some(cells, (cell: Cell) => cellHasTryOutInput(cell))
