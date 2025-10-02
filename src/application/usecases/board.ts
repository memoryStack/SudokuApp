import _get from '@lodash/get'
import _forEach from '@lodash/forEach'
import _map from '@lodash/map'
import _isEmpty from '@lodash/isEmpty'

import { Board } from '@domain/board/board'

import { isMainNumberPresentInAnyHouseOfCell } from '@domain/board/utils/common'
import { NotesRecord } from '@domain/board/records/notesRecord'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'

import type {
    BoardRepository,
    ToggleNotes,
    Move,
} from '../adapterInterfaces/stateManagers/boardRepository'

import { BOARD_MOVES_TYPES } from '../constants'

import type { Dependencies } from '../type'
import { GameSettingsAdapter } from '@application/adapterInterfaces/gameSettings'
import { SOUNDS, Sound } from '@application/adapterInterfaces/sounds'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import _filter from '@lodash/filter'

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

interface InputNumberUseCaseDependencies extends Omit<Dependencies, 'sound'> {
    sound: {
        mistake: Sound,
        addNumber: Sound,
        removeNumber: Sound,
    }
}

const constructMove = ({ mainNumber = {}, notes = {} }, selectedCell: Cell) => ({
    selectedCell,
    mainNumber,
    notes,
})

// it's actually a util
export const updateUserActivityTime = (dependencies: Dependencies) => {
    const { refreeRepository } = dependencies
    refreeRepository.setLastActivityTime(refreeRepository.getTime())
}

export const fastPencilUseCase = (dependencies: Dependencies) => {
    const { boardRepository, analytics, gameSettingsAdapter } = dependencies
    const mainNumbers = boardRepository.getMainNumbers()
    const notes = boardRepository.getNotes()
    const allowAnyNoteInCell = gameSettingsAdapter.allowAnyNoteInCell()
    const newNotesBunchToAdd = Board.getNewNotesToSpawn(mainNumbers, notes, allowAnyNoteInCell)

    if (!newNotesBunchToAdd.length) return

    const move = {
        notes: {
            action: BOARD_MOVES_TYPES.ADD,
            bunch: newNotesBunchToAdd,
        },
    }
    boardRepository.setNotesBunch(newNotesBunchToAdd)
    boardRepository.addMove(constructMove(move, boardRepository.getSelectedCell()))
    updateUserActivityTime(dependencies)
    analytics?.sendFastPencilClickEvent?.()
}

// TODO: make it isolated from selectedCell
const inputMainNumber = (number: number, cell: Cell, dependencies: InputNumberUseCaseDependencies) => {
    const { boardRepository, refreeRepository, sound } = dependencies
    const selectedCell = cell
    const mainNumbers = boardRepository.getMainNumbers()

    const move: Move = {
        mainNumber: {
            action: BOARD_MOVES_TYPES.ADD,
            value: number,
        },
    }

    if (Board.madeMistake(number, selectedCell, mainNumbers)) {
        const newMistakesCount = refreeRepository.getGameMistakesCount() + 1
        refreeRepository.setGameMistakesCount(newMistakesCount)
        sound?.mistake?.play?.()
    } else {
        const notes = boardRepository.getNotes()
        const notesBunch = Board.getNotesToRemoveAfterMainNumberInput(number, selectedCell, notes)
        boardRepository.eraseNotesBunch(notesBunch)

        move.notes = {
            action: BOARD_MOVES_TYPES.REMOVE,
            bunch: notesBunch,
        }
        sound?.addNumber?.play?.()
    }

    boardRepository.setCellMainNumber({ cell: selectedCell, number })
    boardRepository.addMove(constructMove(move, selectedCell))
}

const inputNoteNumber = (
    number: number,
    boardRepository: BoardRepository,
    gameSettingsAdapter: GameSettingsAdapter,
    sound: InputNumberUseCaseDependencies['sound']
) => {
    const selectedCell = boardRepository.getSelectedCell()
    const mainNumbers = boardRepository.getMainNumbers()
    const allowAnyNoteInCell = gameSettingsAdapter.allowAnyNoteInCell()
    if (!allowAnyNoteInCell && isMainNumberPresentInAnyHouseOfCell(number, selectedCell, mainNumbers)) return

    const notes = boardRepository.getNotes()
    const notesBunch = [{ cell: selectedCell, note: number }]

    const noteAlreadyPresent = NotesRecord.isNotePresentInCell(notes, number, selectedCell)

    if (noteAlreadyPresent) {
        boardRepository.eraseNotesBunch(notesBunch)
        sound?.removeNumber?.play?.()
    } else {
        boardRepository.setNotesBunch(notesBunch)
        sound?.addNumber?.play?.()
    }

    const move = {
        notes: {
            action: noteAlreadyPresent ? BOARD_MOVES_TYPES.REMOVE : BOARD_MOVES_TYPES.ADD,
            bunch: notesBunch,
        },
    }
    boardRepository.addMove(constructMove(move, selectedCell))
}

const getSoundConfigs = (dependencies: Dependencies) => {
    const { gameSettingsAdapter, soundAdapter } = dependencies
    const soundsEnabled = gameSettingsAdapter.soundsEnabled()
    const mistakeFeedbackOn = gameSettingsAdapter.showFeedbackOnMistake()

    const soundPlayHandler = (sound: SOUNDS) => {
        return () => {
            if (soundsEnabled) return soundAdapter.play(sound)
            return Promise.resolve()
        }
    }

    return {
        mistake: { play: soundPlayHandler(mistakeFeedbackOn ? SOUNDS.MISTAKE : SOUNDS.NUMBER_INPUT) },
        addNumber: { play: soundPlayHandler(SOUNDS.NUMBER_INPUT) },
        removeNumber: { play: soundPlayHandler(SOUNDS.ERASER_CLICK) },
    }
}

export const inputNumberUseCase = (number: number, fillAsNote: boolean, dependencies: Dependencies) => {
    const { boardRepository } = dependencies
    const soundConfigs = getSoundConfigs(dependencies)
    const selectedCell = boardRepository.getSelectedCell()
    const mainNumbers = boardRepository.getMainNumbers()
    if (MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)) return

    if (fillAsNote) inputNoteNumber(number, boardRepository, dependencies.gameSettingsAdapter, soundConfigs)
    else inputMainNumber(number, selectedCell, { ...dependencies, sound: soundConfigs })
    updateUserActivityTime(dependencies as unknown as Dependencies)
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

export const eraseCellUseCase = (dependencies: Dependencies, sound: Sound) => {
    const { boardRepository, snackBarAdapter } = dependencies
    const mainNumbers = boardRepository.getMainNumbers()
    const selectedCell = boardRepository.getSelectedCell()

    if (Board.isMainNumberNotEligibleToErase(selectedCell, mainNumbers)) {
        snackBarAdapter.show({
            msg: 'Clues can not be removed',
            visibleTime: 5000
        })
        return
    }

    if (Board.isMainNumberEligibleToErase(selectedCell, mainNumbers)) {
        eraseMainNumber(boardRepository)
        sound?.play?.()
    } else {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)) {
            removeCellNotes(boardRepository)
            sound?.play?.()
        }
    }
    updateUserActivityTime(dependencies)
}

export const applyHintUseCase = (applyHintChanges: ApplyHintData, dependencies: Dependencies) => {
    const notesBunch: ToggleNotes = []
    const soundConfigs = getSoundConfigs(dependencies)
    _forEach(applyHintChanges, ({ cell, action }) => {
        if (action.type === BOARD_MOVES_TYPES.ADD) {
            inputMainNumber(action.mainNumber, cell, { ...dependencies, sound: soundConfigs })
        } else {
            notesBunch.push(..._map(_get(action, 'notes'), note => ({ cell, note })))
        }
    })
    if (!_isEmpty(notesBunch)) removeNotesBunchAndAddMove(notesBunch, dependencies.boardRepository)
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

export const undoUseCase = (dependencies: Dependencies) => {
    const { boardRepository, analytics } = dependencies
    const moves = boardRepository.getMoves()
    if (moves.length) {
        const previousMove = moves[moves.length - 1]
        if (!previousMove.selectedCell) boardRepository.setSelectedCell(previousMove.selectedCell)

        undoMainNumber(previousMove, boardRepository)
        undoNotes(previousMove, boardRepository)
        boardRepository.popMove()
        updateUserActivityTime(dependencies)
    }
    analytics?.sendUndoClickEvent?.()
}

export const hideOutNotesWhoseNumbersFilledInHouse = (dependencies: Dependencies) => {
    const { boardRepository } = dependencies
    const mainNumbers = boardRepository.getMainNumbers()
    const notes = boardRepository.getNotes()

    const notesBunch: ToggleNotes = []
    BoardIterators.forBoardEachCell(cell => {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
            _filter(
                NotesRecord.getCellNotes(notes, cell),
                ({ noteValue, show }: Note) => {
                    return show && isMainNumberPresentInAnyHouseOfCell(noteValue, cell, mainNumbers)
                },
            ).forEach(({ noteValue }: Note) => {
                notesBunch.push({ cell, note: noteValue })
            })
        }
    })

    boardRepository.eraseNotesBunch(notesBunch)
}
