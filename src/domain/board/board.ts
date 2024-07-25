import _get from '@lodash/get'
import _filter from '@lodash/filter'
import _every from '@lodash/every'
import _isEqual from '@lodash/isEqual'
import _map from '@lodash/map'

import { BoardIterators } from './utils/boardIterators'
import { isMainNumberPresentInAnyHouseOfCell } from './utils/common'

import { MainNumbersRecord } from './records/mainNumbersRecord'

import { NotesRecord } from './records/notesRecord'
import { BOARD_CELLS_COUNT } from './board.constants'
import { getCellHousesInfo, getHouseCells } from './utils/housesAndCells'

type NoteToSpawn = {
    cell: Cell,
    note: NoteValue
}

type NotesToSpawn = Array<NoteToSpawn>

type EmptyCellsAndSolutions = {
    cell: Cell,
    solution: MainNumberValue
}[]

type Board = {
    getNewNotesToSpawn: (mainNumbers: MainNumbers, notes: Notes) => NotesToSpawn,
    isPuzzleSolved: (mainNumbers: MainNumbers) => boolean,
    isMainNumberEligibleToErase: (cell: Cell, mainNumbers: MainNumbers) => boolean,
    isMainNumberNotEligibleToErase: (cell: Cell, mainNumbers: MainNumbers) => boolean,
    getNotesToRemoveAfterMainNumberInput: (number: number, cell: Cell, notes: Notes) => { cell: Cell, note: NoteValue }[],
    getEmptyCellsAndTheirSolution: (mainNumbers: MainNumbers) => EmptyCellsAndSolutions,
    madeMistake: (inputNumber: MainNumberValue, cell: Cell, mainNumbers: MainNumbers) => boolean,
    getCluesCount: (mainNumbers: MainNumbers) => number,
}

const getNewNotesToSpawn = (mainNumbers: MainNumbers, notes: Notes): NotesToSpawn => {
    const result: NotesToSpawn = []

    BoardIterators.forBoardEachCell(cell => {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
            _filter(
                NotesRecord.getCellNotes(notes, cell),
                ({ noteValue, show }: Note) => !show && !isMainNumberPresentInAnyHouseOfCell(noteValue, cell, mainNumbers),
            ).forEach(({ noteValue }: Note) => {
                result.push({ cell, note: noteValue })
            })
        }
    })

    return result
}

const isPuzzleSolved = (mainNumbers: MainNumbers) => {
    let result = 0
    BoardIterators.forBoardEachCell(cell => {
        if (MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)) result++
    })
    return result === BOARD_CELLS_COUNT
}

const isMainNumberEligibleToErase = (cell: Cell, mainNumbers: MainNumbers) => {
    return MainNumbersRecord.isCellFilled(mainNumbers, cell)
        && !MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)
}

const isMainNumberNotEligibleToErase = (cell: Cell, mainNumbers: MainNumbers) => {
    return MainNumbersRecord.isCellFilled(mainNumbers, cell)
        && MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)
}

const getNotesToRemoveAfterMainNumberInput = (number: number, cell: Cell, notes: Notes) => {
    const visibleNotes = NotesRecord.getCellVisibleNotesList(notes, cell)

    const result = visibleNotes.map((noteValue) => ({ cell, note: noteValue }))

    const cellHouses = getCellHousesInfo(cell)
    cellHouses.forEach(house => {
        getHouseCells(house).forEach(houseCell => {
            if (NotesRecord.isNotePresentInCell(notes, number, houseCell)) {
                result.push({ cell: houseCell, note: number })
            }
        })
    })

    return result
}

const getEmptyCellsAndTheirSolution = (mainNumbers: MainNumbers): EmptyCellsAndSolutions => {
    const result: EmptyCellsAndSolutions = []

    BoardIterators.forBoardEachCell(cell => {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
            result.push({
                cell,
                solution: MainNumbersRecord.getCellSolutionValue(mainNumbers, cell)
            })
        }
    })

    return result
}

const madeMistake = (inputNumber: MainNumberValue, cell: Cell, mainNumbers: MainNumbers) => {
    return inputNumber !== MainNumbersRecord.getCellSolutionValue(mainNumbers, cell)
}

const getCluesCount = (mainNumbers: MainNumbers) => {
    let cluesCount = 0
    BoardIterators.forBoardEachCell(cell => {
        if (MainNumbersRecord.isCellFilled(mainNumbers, cell)) cluesCount++
    })
    return cluesCount
}

export const Board: Board = {
    getNewNotesToSpawn,
    isPuzzleSolved,
    isMainNumberEligibleToErase,
    isMainNumberNotEligibleToErase,
    getNotesToRemoveAfterMainNumberInput,
    getEmptyCellsAndTheirSolution,
    madeMistake,
    getCluesCount,
}
