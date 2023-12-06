import _filter from '@lodash/filter'
import _isEmpty from '@lodash/isEmpty'
import _forEach from '@lodash/forEach'
import _get from '@lodash/get'
import _map from '@lodash/map'

import { PENCIL_STATE } from '@resources/constants'
import { emit } from '@utils/GlobalEventBus'
import { EVENTS } from '../../../../constants/events'
import { getStoreState } from '../../../../redux/dispatch.helpers'
import {
    isMainNumberPresentInAnyHouseOfCell,
    getCellHousesInfo,
} from '../../utils/util'
import {
    getMainNumbers, getMoves, getNotesInfo, getSelectedCell,
} from '../selectors/board.selectors'
import { getPencilStatus } from '../selectors/boardController.selectors'
import { getHouseCells } from '../../utils/houseCells'
import { BOARD_MOVES_TYPES } from '../../constants'
import { MainNumbersRecord } from '../../RecordUtilities/boardMainNumbers'
import { NotesRecord } from '../../RecordUtilities/boardNotes'
import { BoardIterators } from '../../utils/classes/boardIterators'

const constructMove = ({ mainNumber = {}, notes = {} }) => {
    const selectedCell = getSelectedCell(getStoreState())
    return {
        selectedCell,
        mainNumber,
        notes,
    }
}

const getNewNotesBunchToShow = () => {
    const result = []

    const mainNumbers = getMainNumbers(getStoreState())
    const notes = getNotesInfo(getStoreState())

    BoardIterators.forBoardEachCell(cell => {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
            _filter(
                NotesRecord.getCellNotes(notes, cell),
                ({ noteValue, show }) => !show && !isMainNumberPresentInAnyHouseOfCell(noteValue, cell, mainNumbers),
            ).forEach(({ noteValue }) => {
                result.push({ cell, note: noteValue })
            })
        }
    })

    return result
}

export const fastPencilAction = () => {
    const newNotesBunchToAdd = getNewNotesBunchToShow()

    if (!newNotesBunchToAdd.length) return {}

    const move = {
        notes: {
            action: BOARD_MOVES_TYPES.ADD,
            bunch: newNotesBunchToAdd,
        },
    }

    return {
        notesBunch: newNotesBunchToAdd,
        move: constructMove(move),
    }
}

const getVisibileNotesBunchInCell = (cell, notes) => _filter(NotesRecord.getCellNotes(notes, cell), ({ show }) => show)
    .map(({ noteValue }) => ({ cell, note: noteValue }))

const getNotesToRemoveAfterMainNumberInput = (number, cell, notes) => {
    const result = []
    result.push(...getVisibileNotesBunchInCell(cell, notes))

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

const inputMainNumber = (number, dependencies) => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())

    const move = {
        mainNumber: {
            action: BOARD_MOVES_TYPES.ADD,
            value: number,
        },
    }

    const { boardRepository, refreeRepository } = dependencies

    if (number !== MainNumbersRecord.getCellSolutionValue(mainNumbers, selectedCell)) {
        const currentMistakesCount = refreeRepository.getGameMistakesCount()
        refreeRepository.setGameMistakesCount(currentMistakesCount + 1)
    } else {
        const notes = getNotesInfo(getStoreState())
        const notesBunch = getNotesToRemoveAfterMainNumberInput(number, selectedCell, notes)
        boardRepository.eraseNotesBunch(notesBunch)

        move.notes = {
            action: BOARD_MOVES_TYPES.REMOVE,
            bunch: notesBunch,
        }
    }

    boardRepository.setCellMainNumber({ cell: selectedCell, number })
    boardRepository.addMove(constructMove(move))
}

const inputNoteNumber = (number, boardRepository) => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    if (isMainNumberPresentInAnyHouseOfCell(number, selectedCell, mainNumbers)) return

    const notes = getNotesInfo(getStoreState())
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
    boardRepository.addMove(constructMove(move))
}

export const inputNumberAction = (number, dependencies) => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    if (MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)) return

    // TODO: check at how many places this pencil state is required
    // if it's more than 1 then move it to store/utils
    const pencilState = getPencilStatus(getStoreState())
    if (pencilState === PENCIL_STATE.ACTIVE) inputNoteNumber(number, dependencies.boardRepository)
    else inputMainNumber(number, dependencies)
}

const removeCellNotes = boardRepository => {
    const selectedCell = getSelectedCell(getStoreState())
    const notes = getNotesInfo(getStoreState())
    const notesBunch = getVisibileNotesBunchInCell(selectedCell, notes)
    if (!notesBunch.length) return

    removeNotesBunchAndAddMove(notesBunch, boardRepository)
}

const eraseMainNumber = boardRepository => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
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
    boardRepository.addMove(constructMove(move))
}

export const eraseAction = boardRepository => {
    if (isMainNumberNotEligibleToErase()) {
        emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
            msg: 'Clues or Correctly filled cells can not be removed',
            visibleTime: 5000,
        })
        return
    }

    if (isMainNumberEligibleToErase()) {
        eraseMainNumber(boardRepository)
    } else {
        const mainNumbers = getMainNumbers(getStoreState())
        const selectedCell = getSelectedCell(getStoreState())
        if (!MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)) removeCellNotes(boardRepository)
    }
}

const isMainNumberNotEligibleToErase = () => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    return MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)
        && MainNumbersRecord.isCellFilledCorrectly(mainNumbers, selectedCell)
}

const isMainNumberEligibleToErase = () => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    return MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)
        && !MainNumbersRecord.isCellFilledCorrectly(mainNumbers, selectedCell)
}

export const undoAction = boardRepository => {
    const moves = getMoves(getStoreState())
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
    const mainNumbers = getMainNumbers(getStoreState())

    BoardIterators.forBoardEachCell(cell => {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
            boardRepository.setCellMainNumber({
                cell,
                number: MainNumbersRecord.getCellSolutionValue(mainNumbers, cell),
            })
        }
    })
}

const removeNotesBunchAndAddMove = (notesBunch, boardRepository) => {
    const move = {
        notes: {
            action: BOARD_MOVES_TYPES.REMOVE,
            bunch: notesBunch,
        },
    }
    boardRepository.addMove(constructMove(move))
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
