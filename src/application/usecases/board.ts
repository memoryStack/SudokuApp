
import { Board } from '@domain/board/board'

import type {
    BoardRepository,
    State,
    CellMainNumber,
    ToggleNotes,
    Move,
} from '../adapterInterfaces/stateManagers/boardRepository'

import type {
    BoardControllerRepository
} from '../adapterInterfaces/stateManagers/boardControllerRepository'

import type {
    RefreeRepository
} from '../adapterInterfaces/stateManagers/refreeRepository'

import { BOARD_MOVES_TYPES, PENCIL_STATE } from '../constants'
import { isMainNumberPresentInAnyHouseOfCell } from '@domain/board/utils/common'
import { NotesRecord } from '@domain/board/records/notesRecord'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { emit } from '@utils/GlobalEventBus'
import { EVENTS } from 'src/constants/events'
import _get from '@lodash/get'
import _forEach from '@lodash/forEach'
import _map from '@lodash/map'
import _isEmpty from '@lodash/isEmpty'

type StateManagersDependencies = {
    boardRepository: BoardRepository,
    boardControllerRepository: BoardControllerRepository,
    refreeRepository: RefreeRepository,
}

type AddMainNumberHintAction = {
    cell: Cell
    action: {
        type: string
        mainNumber: MainNumberValue
    }
}

type NotesRemovalHintAction = {
    cell: Cell
    action: {
        type: string
        notes: NoteValue[]
    }
}

// TODO: export these types from here and use them in hintTransformers folder and 
// anywhere else
type ApplyHintData = AddMainNumberHintAction[] | NotesRemovalHintAction[]

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

const inputMainNumber = (number: number, dependencies: StateManagersDependencies) => {
    const { boardRepository, refreeRepository } = dependencies

    const selectedCell = boardRepository.getSelectedCell()
    const mainNumbers = boardRepository.getMainNumbers()

    const move: Move = {
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

const inputNoteNumber = (number: number, boardRepository: BoardRepository) => {
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

export const inputNumberUseCase = (number: number, dependencies: StateManagersDependencies) => {
    const { boardRepository } = dependencies
    const selectedCell = boardRepository.getSelectedCell()
    const mainNumbers = boardRepository.getMainNumbers()
    if (MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)) return

    const { boardControllerRepository } = dependencies
    const pencilState = boardControllerRepository.getPencil()
    if (pencilState === PENCIL_STATE.ACTIVE) inputNoteNumber(number, boardRepository)
    else inputMainNumber(number, dependencies)
}

const removeNotesBunchAndAddMove = (notesBunch: ToggleNotes, boardRepository: BoardRepository) => {
    const move = {
        notes: {
            action: BOARD_MOVES_TYPES.REMOVE,
            bunch: notesBunch,
        },
    }
    boardRepository.addMove(constructMove(move, boardRepository.getSelectedCell()))
    boardRepository.eraseNotesBunch(notesBunch)
}

const removeCellNotes = (boardRepository: BoardRepository) => {
    const selectedCell = boardRepository.getSelectedCell()
    const notes = boardRepository.getNotes()
    const notesBunch = NotesRecord.getCellVisibleNotesList(notes, selectedCell)
        .map((noteValue) => ({ cell: selectedCell, note: noteValue }))

    if (!notesBunch.length) return

    removeNotesBunchAndAddMove(notesBunch, boardRepository)
}

const eraseMainNumber = (boardRepository: BoardRepository) => {
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

export const eraseCellUseCase = (boardRepository: BoardRepository) => {
    const mainNumbers = boardRepository.getMainNumbers()
    const selectedCell = boardRepository.getSelectedCell()

    if (Board.isMainNumberNotEligibleToErase(selectedCell, mainNumbers)) {
        // TODO: DEPENDENCY ROLE BROKE
        // this calling should happen via dependency
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

export const applyHintUseCase = (applyHintChanges: ApplyHintData, dependencies: StateManagersDependencies) => {
    if (_get(applyHintChanges, '0.action.type') === BOARD_MOVES_TYPES.ADD) {
        inputMainNumber(_get(applyHintChanges, '0.action.mainNumber'), dependencies)
        return
    }

    const notesBunch: ToggleNotes = []
    _forEach(applyHintChanges, ({ cell, action }) => {
        notesBunch.push(..._map(_get(action, 'notes'), note => ({ cell, note })))
    })

    removeNotesBunchAndAddMove(notesBunch, dependencies.boardRepository)
}

export const fillPuzzleUseCase = (boardRepository: BoardRepository) => {
    Board.getEmptyCellsAndTheirSolution(boardRepository.getMainNumbers())
        .forEach(({ cell, solution }) => {
            boardRepository.setCellMainNumber({
                cell,
                number: solution,
            })
        })
}

const undoMainNumber = (previousMove: any, boardRepository: BoardRepository) => {
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

const undoNotes = (previousMove: any, boardRepository: BoardRepository) => {
    const notesMove = previousMove.notes
    if (_isEmpty(notesMove)) return

    if (notesMove.action === BOARD_MOVES_TYPES.ADD) {
        boardRepository.eraseNotesBunch(notesMove.bunch)
    } else {
        boardRepository.setNotesBunch(notesMove.bunch)
    }
}

export const undoUseCase = (boardRepository: BoardRepository) => {
    const moves = boardRepository.getMoves()
    if (!moves.length) return

    const previousMove = moves[moves.length - 1]
    if (!previousMove.selectedCell) boardRepository.setSelectedCell(previousMove.selectedCell)

    undoMainNumber(previousMove, boardRepository)
    undoNotes(previousMove, boardRepository)
    boardRepository.popMove()
}
