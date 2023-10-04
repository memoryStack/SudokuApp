import _filter from '@lodash/filter'
import _keys from '@lodash/keys'
import _forEach from '@lodash/forEach'

import { MainNumbersRecord } from 'src/apps/arena/RecordUtilities/boardMainNumbers'
import { NotesRecord } from 'src/apps/arena/RecordUtilities/boardNotes'
import { convertBoardCellNumToCell } from 'src/apps/arena/utils/cellTransformers'
import { BoardIterators } from 'src/apps/arena/utils/classes/boardIterators'
import { isMainNumberPresentInAnyHouseOfCell } from 'src/apps/arena/utils/util'

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
export const getPuzzleDataFromPuzzleString = puzzleString => {
    const mainNumbers = MainNumbersRecord.initMainNumbers()
    for (let i = 0; i < puzzleString.length; i++) {
        const { row, col } = convertBoardCellNumToCell(i)
        mainNumbers[row][col].value = parseInt(puzzleString[i], 10)
        mainNumbers[row][col].isClue = true
    }

    return {
        mainNumbers,
        notes: getNewNotesBunchToShow(mainNumbers),
        possibleNotes: getNewNotesBunchToShow(mainNumbers),
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
