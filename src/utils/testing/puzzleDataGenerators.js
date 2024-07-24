import _filter from '@lodash/filter'
import _keys from '@lodash/keys'
import _forEach from '@lodash/forEach'

import { NotesRecord } from '../../apps/arena/RecordUtilities/boardNotes'
import { convertBoardCellNumToCell } from '@domain/board/utils/cellsTransformers'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import { isMainNumberPresentInAnyHouseOfCell } from '../../apps/arena/utils/util'
import { MainNumbersRecord } from '../../apps/arena/RecordUtilities/boardMainNumbers'

// TODO: this is almost copied from fastPencilAction in board.actions file
const getNewNotesBunchToShow = mainNumbers => {
    const notes = NotesRecord.initNotes()

    BoardIterators.forBoardEachCell(cell => {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
            _filter(
                NotesRecord.getCellNotes(notes, cell),
                ({ noteValue, show }) => !show && !isMainNumberPresentInAnyHouseOfCell(noteValue, cell, mainNumbers),
            ).forEach(({ noteValue }) => {
                notes[cell.row][cell.col][noteValue - 1].show = 1
            })
        }
    })

    return notes
}

// TODO: this logic is almost duplicated with customPuzzle handler
export const getPuzzleDataFromPuzzleString = (puzzleString, shouldGeneratePossibleNotes = true) => {
    const mainNumbers = MainNumbersRecord.initMainNumbers()
    for (let i = 0; i < puzzleString.length; i++) {
        const { row, col } = convertBoardCellNumToCell(i)
        mainNumbers[row][col].value = parseInt(puzzleString[i], 10)
        mainNumbers[row][col].isClue = mainNumbers[row][col].value !== 0
    }

    return {
        mainNumbers,
        notes: getNewNotesBunchToShow(mainNumbers),
        ...shouldGeneratePossibleNotes && { possibleNotes: getNewNotesBunchToShow(mainNumbers) },
    }
}

// TODO: rename it
export const generateCustomNotes = customNotes => {
    const notes = NotesRecord.initNotes()
    _forEach(_keys(customNotes), cell => {
        const { row, col } = convertBoardCellNumToCell(parseInt(cell, 10))
        _forEach(customNotes[cell], note => {
            notes[row][col][note - 1].show = 1
        })
    })
    return notes
}

export const editNotes = (notes, { add, remove }) => {
    _forEach(_keys(add), cell => {
        const { row, col } = convertBoardCellNumToCell(parseInt(cell, 10))
        _forEach(add[cell], note => {
            notes[row][col][note - 1].show = 1
        })
    })

    _forEach(_keys(remove), cell => {
        const { row, col } = convertBoardCellNumToCell(parseInt(cell, 10))
        _forEach(remove[cell], note => {
            notes[row][col][note - 1].show = 0
        })
    })
}
