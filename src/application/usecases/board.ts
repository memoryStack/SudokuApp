import { Board } from '@domain/board/board'

import type {
    BoardRepository,
    State,
    CellMainNumber,
    ToggleNotes,
    Move,
} from '../adapterInterfaces/stateManagers/boardRepository'
import { BOARD_MOVES_TYPES } from '../constants'

/*
    1. input main number
    2. input notes in cells
    3. fast pencil click
    4. erase main number
    5. erase notes
    6. fill the puzzle
    7. undo
*/

const constructMove = ({ mainNumber = {}, notes = {} }, selectedCell: Cell) => ({
    selectedCell,
    mainNumber,
    notes,
})

export const fastPencilUseCase = (boardRepository: BoardRepository) => {
    const mainNumbers = boardRepository.getMainNumbers()
    const notes = boardRepository.getNotes()
    const newNotesBunchToAdd = Board.getNewNotesToSpawn(mainNumbers, notes)

    if (!newNotesBunchToAdd.length) return

    const move = {
        notes: {
            action: BOARD_MOVES_TYPES.ADD,
            bunch: newNotesBunchToAdd,
        },
    }

    boardRepository.setNotesBunch(newNotesBunchToAdd)
    boardRepository.addMove(constructMove(move, boardRepository.getSelectedCell()))
}