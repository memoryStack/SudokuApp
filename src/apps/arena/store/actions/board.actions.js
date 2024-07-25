import _filter from '@lodash/filter'
import _isEmpty from '@lodash/isEmpty'
import _forEach from '@lodash/forEach'
import _get from '@lodash/get'
import _map from '@lodash/map'

import { PENCIL_STATE } from '@resources/constants'
import { emit } from '@utils/GlobalEventBus'
import { EVENTS } from '../../../../constants/events'

import { BOARD_MOVES_TYPES } from '../../constants'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { NotesRecord } from '@domain/board/records/notesRecord'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import { Board } from '@domain/board/board'
import { isMainNumberPresentInAnyHouseOfCell } from '@domain/board/utils/common'

const constructMove = ({ mainNumber = {}, notes = {} }, selectedCell) => ({
    selectedCell,
    mainNumber,
    notes,
})

export const fastPencilAction = boardRepository => {
    const mainNumbers = boardRepository.getMainNumbers()
    const notes = boardRepository.getNotes()
    const newNotesBunchToAdd = Board.getNewNotesToSpawn(mainNumbers, notes)

    if (!newNotesBunchToAdd.length) return {}

    const move = {
        notes: {
            action: BOARD_MOVES_TYPES.ADD,
            bunch: newNotesBunchToAdd,
        },
    }

    return {
        notesBunch: newNotesBunchToAdd,
        move: constructMove(move, boardRepository.getSelectedCell()),
    }
}

const inputMainNumber = (number, dependencies) => {
    const { boardRepository, refreeRepository } = dependencies

    const selectedCell = boardRepository.getSelectedCell()
    const mainNumbers = boardRepository.getMainNumbers()

    const move = {
        mainNumber: {
            action: BOARD_MOVES_TYPES.ADD,
            value: number,
        },
    }

    if (Board.madeMistake(number, selectedCell, mainNumbers)) {
        const currentMistakesCount = refreeRepository.getGameMistakesCount()
        refreeRepository.setGameMistakesCount(currentMistakesCount + 1)
    } else {
        const notes = boardRepository.getNotes()
        const notesBunch = Board.getNotesToRemoveAfterMainNumberInput(number, selectedCell, notes)
        boardRepository.eraseNotesBunch(notesBunch)

        move.notes = {
            action: BOARD_MOVES_TYPES.REMOVE,
            bunch: notesBunch,
        }
    }

    boardRepository.setCellMainNumber({ cell: selectedCell, number })
    boardRepository.addMove(constructMove(move, selectedCell))
}

const inputNoteNumber = (number, boardRepository) => {
    const selectedCell = boardRepository.getSelectedCell()
    const mainNumbers = boardRepository.getMainNumbers()
    if (isMainNumberPresentInAnyHouseOfCell(number, selectedCell, mainNumbers)) return

    const notes = boardRepository.getNotes()
    const notesBunch = [{ cell: selectedCell, note: number }]

    const noteAlreadyPresent = NotesRecord.isNotePresentInCell(notes, number, selectedCell)

    if (noteAlreadyPresent) {
        boardRepository.eraseNotesBunch(notesBunch)
    } else {
        boardRepository.setNotesBunch(notesBunch)
    }

    const move = {
        notes: {
            action: noteAlreadyPresent ? BOARD_MOVES_TYPES.REMOVE : BOARD_MOVES_TYPES.ADD,
            bunch: notesBunch,
        },
    }
    boardRepository.addMove(constructMove(move, selectedCell))
}

export const inputNumberAction = (number, dependencies) => {
    const { boardRepository } = dependencies
    const selectedCell = boardRepository.getSelectedCell()
    const mainNumbers = boardRepository.getMainNumbers()
    if (MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)) return

    // TODO: check at how many places this pencil state is required
    // if it's more than 1 then move it to store/utils
    const { boardControllerRepository } = dependencies
    const pencilState = boardControllerRepository.getPencil()
    if (pencilState === PENCIL_STATE.ACTIVE) inputNoteNumber(number, boardRepository)
    else inputMainNumber(number, dependencies)
}

const removeCellNotes = boardRepository => {
    const selectedCell = boardRepository.getSelectedCell()
    const notes = boardRepository.getNotes()
    const notesBunch = NotesRecord.getCellVisibleNotesList(notes, selectedCell)
        .map((noteValue) => ({ cell: selectedCell, note: noteValue }))

    if (!notesBunch.length) return

    removeNotesBunchAndAddMove(notesBunch, boardRepository)
}

const eraseMainNumber = boardRepository => {
    const selectedCell = boardRepository.getSelectedCell()
    const mainNumbers = boardRepository.getMainNumbers()
    const cellMainValue = MainNumbersRecord.getCellMainValue(mainNumbers, selectedCell)

    boardRepository.setCellMainNumber({
        cell: selectedCell,
        number: 0,
    })

    const move = {
        mainNumber: {
            action: BOARD_MOVES_TYPES.REMOVE,
            value: cellMainValue,
        },
    }
    boardRepository.addMove(constructMove(move, selectedCell))
}

export const eraseAction = boardRepository => {
    const mainNumbers = boardRepository.getMainNumbers()
    const selectedCell = boardRepository.getSelectedCell()

    if (Board.isMainNumberNotEligibleToErase(selectedCell, mainNumbers)) {
        emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
            msg: 'Clues or Correctly filled cells can not be removed',
            visibleTime: 5000,
        })
        return
    }

    if (Board.isMainNumberEligibleToErase(selectedCell, mainNumbers)) {
        eraseMainNumber(boardRepository)
    } else {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)) removeCellNotes(boardRepository)
    }
}

export const undoAction = boardRepository => {
    const moves = boardRepository.getMoves()
    if (!moves.length) return

    const previousMove = moves[moves.length - 1]
    if (!previousMove.selectedCell) boardRepository.setSelectedCell(previousMove.selectedCell)

    undoMainNumber(previousMove, boardRepository)
    undoNotes(previousMove, boardRepository)
    boardRepository.popMove()
}

const undoMainNumber = (previousMove, boardRepository) => {
    const mainNumberMove = previousMove.mainNumber
    if (!mainNumberMove.action) return

    if (mainNumberMove.action === BOARD_MOVES_TYPES.ADD) {
        boardRepository.setCellMainNumber({ cell: previousMove.selectedCell, number: 0 })
    } else {
        // this will be executed only for the mistake made.
        // correct filled numbers are anyway not erasable.
        boardRepository.setCellMainNumber({
            cell: previousMove.selectedCell,
            number: mainNumberMove.value,
        })
    }
}

const undoNotes = (previousMove, boardRepository) => {
    const notesMove = previousMove.notes
    if (_isEmpty(notesMove)) return

    if (notesMove.action === BOARD_MOVES_TYPES.ADD) {
        boardRepository.eraseNotesBunch(notesMove.bunch)
    } else {
        boardRepository.setNotesBunch(notesMove.bunch)
    }
}

export const fillPuzzle = boardRepository => {
    Board.getEmptyCellsAndTheirSolution(boardRepository.getMainNumbers())
        .forEach(({ cell, solution }) => {
            boardRepository.setCellMainNumber({
                cell,
                number: solution,
            })
        })
}

const removeNotesBunchAndAddMove = (notesBunch, boardRepository) => {
    const move = {
        notes: {
            action: BOARD_MOVES_TYPES.REMOVE,
            bunch: notesBunch,
        },
    }
    boardRepository.addMove(constructMove(move, boardRepository.getSelectedCell()))
    boardRepository.eraseNotesBunch(notesBunch)
}

export const applyHintAction = (applyHintChanges, dependencies) => {
    /*
        right now if ADD action is present then it will be the only entry.
        so it will not affect in Moves stack as well.
    */
    if (applyHintChanges.length === 1 && _get(applyHintChanges, '0.action.type') === BOARD_MOVES_TYPES.ADD) {
        inputMainNumber(_get(applyHintChanges, '0.action.mainNumber'), dependencies)
        return
    }

    const notesBunch = []
    _forEach(applyHintChanges, ({ cell, action }) => {
        notesBunch.push(..._map(_get(action, 'notes'), note => ({ cell, note })))
    })

    removeNotesBunchAndAddMove(notesBunch, dependencies.boardRepository)
}
