import _filter from '@lodash/filter'
import _isEmpty from '@lodash/isEmpty'
import _forEach from '@lodash/forEach'
import _get from '@lodash/get'
import _map from '@lodash/map'

import { PENCIL_STATE } from '@resources/constants'
import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import {
    isMainNumberPresentInAnyHouseOfCell,
    forBoardEachCell,
    getCellHousesInfo,
    isCellEmpty,
    forCellEachNote,
} from '../../utils/util'
import { boardActions } from '../reducers/board.reducers'
import {
    getMainNumbers, getMoves, getNotesInfo, getPossibleNotes, getSelectedCell,
} from '../selectors/board.selectors'
import { getPencilStatus } from '../selectors/boardController.selectors'
import { addMistake } from './refree.actions'
import { getHouseCells } from '../../utils/houseCells'
import { BOARD_MOVES_TYPES } from '../../constants'
import { MainNumbersRecord } from '../../RecordUtilities/boardMainNumbers'
import { NotesRecord } from '../../RecordUtilities/boardNotes'

const {
    setMainNumbers,
    setCellMainNumber,
    eraseCellMainValue,
    setSelectedCell,
    setNotes,
    setNotesBunch,
    eraseNotesBunch,
    setMoves,
    addMove,
    popMove,
    resetState,
    setPossibleNotes,
    setPossibleNotesBunch,
    erasePossibleNotesBunch,
} = boardActions

const constructMove = ({ mainNumber = {}, notes = {} }) => {
    const selectedCell = getSelectedCell(getStoreState())
    return {
        selectedCell,
        mainNumber,
        notes,
    }
}

export const updateMainNumbers = mainNumbers => {
    if (!mainNumbers) return
    invokeDispatch(setMainNumbers(mainNumbers))
}

export const updateSelectedCell = cell => {
    if (!cell) return
    invokeDispatch(setSelectedCell(cell))
}

export const updateNotes = notes => {
    if (!notes) return
    invokeDispatch(setNotes(notes))
}

export const updateMoves = moves => {
    invokeDispatch(setMoves(moves))
}

export const fastPencilAction = () => {
    const newNotesBunchToAdd = getNewNotesBunchToShow()

    if (!newNotesBunchToAdd.length) return

    invokeDispatch(setNotesBunch(newNotesBunchToAdd))

    const move = {
        notes: {
            action: BOARD_MOVES_TYPES.ADD,
            bunch: newNotesBunchToAdd,
        },
    }
    invokeDispatch(addMove(constructMove(move)))

    // so that i can add things in testData.js files
    // if (__DEV__) {
    //     setTimeout(() => {
    //         consoleLog(getMainNumbers(getStoreState()))
    //         consoleLog(getNotesInfo(getStoreState()))
    //     })
    // }
}

const getNewNotesBunchToShow = () => {
    const result = []

    const mainNumbers = getMainNumbers(getStoreState())
    const notes = getNotesInfo(getStoreState())

    forBoardEachCell(({ row, col }) => {
        if (isCellEmpty({ row, col }, mainNumbers)) {
            _filter(
                notes[row][col],
                ({ noteValue, show }) => !show && !isMainNumberPresentInAnyHouseOfCell(noteValue, { row, col }, mainNumbers),
            ).forEach(({ noteValue }) => {
                result.push({ cell: { row, col }, note: noteValue })
            })
        }
    })

    return result
}

const getVisibileNotesBunchInCell = (cell, notes) => _filter(notes[cell.row][cell.col], ({ show }) => show).map(({ noteValue }) => ({
    cell,
    note: noteValue,
}))

const getNotesToRemoveAfterMainNumberInput = (number, cell, notes) => {
    const result = []
    result.push(...getVisibileNotesBunchInCell(cell, notes))

    const cellHouses = getCellHousesInfo(cell)
    cellHouses.forEach(house => {
        getHouseCells(house).forEach(({ row, col }) => {
            const { show } = notes[row][col][number - 1]
            if (show) result.push({ cell: { row, col }, note: number })
        })
    })

    return result
}

// can be used as it is
const inputMainNumber = number => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())

    const move = {
        mainNumber: {
            action: BOARD_MOVES_TYPES.ADD,
            value: number,
        },
    }

    if (number !== MainNumbersRecord.getCellSolutionValue(mainNumbers, selectedCell)) addMistake()
    else {
        const notes = getNotesInfo(getStoreState())
        const notesBunch = getNotesToRemoveAfterMainNumberInput(number, selectedCell, notes)

        invokeDispatch(eraseNotesBunch(notesBunch))

        erasePossibleNotesOnNumberInput(number, selectedCell)

        move.notes = {
            action: BOARD_MOVES_TYPES.REMOVE,
            bunch: notesBunch,
        }
    }

    invokeDispatch(setCellMainNumber({ cell: selectedCell, number }))
    invokeDispatch(addMove(constructMove(move)))
}

const inputNoteNumber = number => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    if (isMainNumberPresentInAnyHouseOfCell(number, selectedCell, mainNumbers)) return

    const notes = getNotesInfo(getStoreState())
    const notesBunch = [{ cell: selectedCell, note: number }]

    const { show } = notes[selectedCell.row][selectedCell.col][number - 1]
    if (show) invokeDispatch(eraseNotesBunch(notesBunch))
    else invokeDispatch(setNotesBunch(notesBunch))

    const move = {
        notes: {
            action: show ? BOARD_MOVES_TYPES.REMOVE : BOARD_MOVES_TYPES.ADD,
            bunch: notesBunch,
        },
    }
    invokeDispatch(addMove(constructMove(move)))
}

export const inputNumberAction = number => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    if (MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)) return

    // TODO: check at how many places this pencil state is required
    // if it's more than 1 then move it to store/utils
    const pencilState = getPencilStatus(getStoreState())
    if (pencilState === PENCIL_STATE.ACTIVE) inputNoteNumber(number)
    else inputMainNumber(number)
}

const removeCellNotes = () => {
    const selectedCell = getSelectedCell(getStoreState())
    const notes = getNotesInfo(getStoreState())
    const notesBunch = getVisibileNotesBunchInCell(selectedCell, notes)
    if (!notesBunch.length) return

    removeNotesBunchAndAddMove(notesBunch)
}

const eraseMainNumber = () => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    const cellMainValue = MainNumbersRecord.getCellMainValue(mainNumbers, selectedCell)

    invokeDispatch(eraseCellMainValue(selectedCell))

    const move = {
        mainNumber: {
            action: BOARD_MOVES_TYPES.REMOVE,
            value: cellMainValue,
        },
    }
    invokeDispatch(addMove(constructMove(move)))
}

export const eraseAction = () => {
    if (isMainNumberEligibleToErase()) {
        eraseMainNumber()
    } else {
        removeCellNotesIfEmptyCell()
    }
}

const isMainNumberEligibleToErase = () => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    return MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)
        && !MainNumbersRecord.isCellFilledCorrectly(mainNumbers, selectedCell)
}

const removeCellNotesIfEmptyCell = () => {
    const mainNumbers = getMainNumbers(getStoreState())
    const selectedCell = getSelectedCell(getStoreState())
    if (isCellEmpty(selectedCell, mainNumbers)) removeCellNotes()
}

export const initPossibleNotes = mainNumbers => {
    setTimeout(() => {
        const notes = NotesRecord.initNotes()

        forBoardEachCell(({ row, col }) => {
            const cellNotes = getCellAllPossibleNotes({ row, col }, mainNumbers)
            cellNotes.forEach(({ note }) => {
                notes[row][col][note - 1].show = 1
            })
        })

        invokeDispatch(setPossibleNotes(notes))
    })
}

const getCellAllPossibleNotes = (cell, mainNumbers) => {
    const result = []
    if (!isCellEmpty(cell, mainNumbers)) return result

    forCellEachNote(note => {
        if (!isMainNumberPresentInAnyHouseOfCell(note, cell, mainNumbers)) result.push({ cell, note })
    })

    return result
}

function erasePossibleNotesOnNumberInput(number, selectedCell) {
    const possibleNotesInfo = getPossibleNotes(getStoreState())
    const possibleNotesBunch = getNotesToRemoveAfterMainNumberInput(number, selectedCell, possibleNotesInfo)
    invokeDispatch(erasePossibleNotesBunch(possibleNotesBunch))
}

const addPossibleNotesOnCorrectlyFilledMainNumberErased = (selectedCell, mainNumbersAfterErase) => {
    const numberRemoved = MainNumbersRecord.getCellSolutionValue(mainNumbersAfterErase, selectedCell)

    const possibleNotesBunch = [...getCellAllPossibleNotes(selectedCell, mainNumbersAfterErase)]

    const cellHouses = getCellHousesInfo(selectedCell)
    cellHouses.forEach(house => {
        getHouseCells(house).forEach(cell => {
            const shouldSpawnNoteInCell = !MainNumbersRecord.isCellFilled(mainNumbersAfterErase, selectedCell)
                && !isMainNumberPresentInAnyHouseOfCell(numberRemoved, cell, mainNumbersAfterErase)
            if (shouldSpawnNoteInCell) possibleNotesBunch.push({ cell, note: numberRemoved })
        })
    })

    invokeDispatch(setPossibleNotesBunch(possibleNotesBunch))
}

export const undoAction = () => {
    const moves = getMoves(getStoreState())
    if (!moves.length) return

    const previousMove = moves[moves.length - 1]
    updateSelectedCell(previousMove.selectedCell)
    undoMainNumber(previousMove)
    undoNotes(previousMove)
    invokeDispatch(popMove())
}

const undoMainNumber = previousMove => {
    const mainNumberMove = previousMove.mainNumber
    if (!mainNumberMove.action) return

    if (mainNumberMove.action === BOARD_MOVES_TYPES.ADD) {
        const cell = previousMove.selectedCell
        const mainNumbersBeforeErase = getMainNumbers(getStoreState())
        invokeDispatch(eraseCellMainValue(cell))
        if (MainNumbersRecord.isCellFilledCorrectly(mainNumbersBeforeErase, cell)) {
            const mainNumbersAfterErase = getMainNumbers(getStoreState())
            addPossibleNotesOnCorrectlyFilledMainNumberErased(cell, mainNumbersAfterErase)
        }
    } else {
        // this will be executed only for the mistake made.
        // correct filled numbers are anyway not erasable.
        invokeDispatch(setCellMainNumber({ cell: previousMove.selectedCell, number: mainNumberMove.value }))
    }
}

const undoNotes = previousMove => {
    const notesMove = previousMove.notes
    if (_isEmpty(notesMove)) return

    if (notesMove.action === BOARD_MOVES_TYPES.ADD) {
        invokeDispatch(eraseNotesBunch(notesMove.bunch))
    } else {
        invokeDispatch(setNotesBunch(notesMove.bunch))
    }
}

export const resetStoreState = () => {
    invokeDispatch(
        resetState({
            mainNumbers: MainNumbersRecord.initMainNumbers(),
            selectedCell: { row: 0, col: 0 },
            notes: NotesRecord.initNotes(),
            moves: [],
            possibleNotes: NotesRecord.initNotes(),
        }),
    )
}

export const fillPuzzle = () => {
    const mainNumbers = getMainNumbers(getStoreState())

    forBoardEachCell(cell => {
        if (isCellEmpty(cell, mainNumbers)) invokeDispatch(setCellMainNumber({ cell, number: MainNumbersRecord.getCellSolutionValue(mainNumbers, cell) }))
    })
}

const removeNotesBunchAndAddMove = notesBunch => {
    invokeDispatch(eraseNotesBunch(notesBunch))

    const move = {
        notes: {
            action: BOARD_MOVES_TYPES.REMOVE,
            bunch: notesBunch,
        },
    }
    invokeDispatch(addMove(constructMove(move)))
}

export const applyHintAction = applyHintChanges => {
    /*
        right now if ADD action is present then it will be the only entry.
        so it will not affect in Moves stack as well.
    */
    if (applyHintChanges.length === 1 && _get(applyHintChanges, '0.action.type') === BOARD_MOVES_TYPES.ADD) {
        inputMainNumber(_get(applyHintChanges, '0.action.mainNumber'))
        return
    }

    const notesBunch = []
    _forEach(applyHintChanges, ({ cell, action }) => {
        notesBunch.push(..._map(_get(action, 'notes'), note => ({ cell, note })))
    })

    removeNotesBunchAndAddMove(notesBunch)
}
