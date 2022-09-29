import _filter from 'lodash/src/utils/filter'
import _isEmpty from 'lodash/src/utils/isEmpty'

import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import { PENCIL_STATE } from '../../../../resources/constants'
import {
    duplicacyPresent,
    forBoardEachCell,
    getCellHousesInfo,
    initNotes,
    isCellCorrectlyFilled,
    isCellEmpty,
    initMainNumbers,
    forCellEachNote,
} from '../../utils/util'
import { boardActions } from '../reducers/board.reducers'
import { getMainNumbers, getMoves, getNotesInfo, getPossibleNotes, getSelectedCell } from '../selectors/board.selectors'
import { getPencilStatus } from '../selectors/boardController.selectors'
import { addMistake } from './refree.actions'
import { getHouseCells } from '../../utils/houseCells'

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
            action: MOVES_TYPES.ADD,
            bunch: newNotesBunchToAdd,
        },
    }
    invokeDispatch(addMove(constructMove(move)))
}

const getNewNotesBunchToShow = () => {
    const result = []

    const mainNumbers = getMainNumbers(getStoreState())
    const notesInfo = getNotesInfo(getStoreState())

    forBoardEachCell(({ row, col }) => {
        if (isCellEmpty({ row, col }, mainNumbers)) {
            _filter(notesInfo[row][col], ({ noteValue, show }) => {
                return !show && !duplicacyPresent(noteValue, mainNumbers, { row, col })
            }).forEach(({ noteValue }) => {
                result.push({ cell: { row, col }, note: noteValue })
            })
        }
    })

    return result
}

const MOVES_TYPES = {
    ADD: 'ADD',
    REMOVE: 'REMOVE',
}

const getVisibileNotesBunchInCell = (cell, notesInfo) => {
    return _filter(notesInfo[cell.row][cell.col], ({ show }) => {
        return show
    }).map(({ noteValue }) => {
        return {
            cell,
            note: noteValue,
        }
    })
}

const getNotesToRemoveAfterMainNumberInput = (number, cell, notesInfo) => {
    const result = []
    result.push(...getVisibileNotesBunchInCell(cell, notesInfo))

    const cellHouses = getCellHousesInfo(cell)
    cellHouses.forEach((house) => {
        getHouseCells(house).forEach(({ row, col }) => {
            const { show } = notesInfo[row][col][number - 1]
            if (show) result.push({ cell: { row, col }, note: number })
        })
    })

    return result
}

const inputMainNumber = number => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())

    const move = {
        mainNumber: {
            action: MOVES_TYPES.ADD,
            value: number,
        },
    }

    invokeDispatch(setCellMainNumber({ cell: selectedCell, number }))

    if (number !== mainNumbers[selectedCell.row][selectedCell.col].solutionValue) addMistake()
    else {
        const notesInfo = getNotesInfo(getStoreState())
        const notesBunch = getNotesToRemoveAfterMainNumberInput(number, selectedCell, notesInfo)
        invokeDispatch(eraseNotesBunch(notesBunch))

        erasePossibleNotesOnNumberInput(number, selectedCell)

        move.notes = {
            action: MOVES_TYPES.REMOVE,
            bunch: notesBunch,
        }
    }

    invokeDispatch(addMove(constructMove(move)))
}

// TODO: break it down
const inputNoteNumber = number => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    if (duplicacyPresent(number, mainNumbers, selectedCell)) return

    const notesInfo = getNotesInfo(getStoreState())
    const notesBunch = [{ cell: selectedCell, note: number }]

    const { show } = notesInfo[selectedCell.row][selectedCell.col][number - 1]
    if (show) invokeDispatch(eraseNotesBunch(notesBunch))
    else invokeDispatch(setNotesBunch(notesBunch))

    const move = {
        notes: {
            action: show ? MOVES_TYPES.REMOVE : MOVES_TYPES.ADD,
            bunch: notesBunch,
        },
    }
    invokeDispatch(addMove(constructMove(move)))
}

export const inputNumberAction = number => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    if (mainNumbers[selectedCell.row][selectedCell.col].value) return

    // TODO: check at how many places this pencil state is required
    // if it's more than 1 then move it to store/utils
    const pencilState = getPencilStatus(getStoreState())
    if (pencilState === PENCIL_STATE.ACTIVE) inputNoteNumber(number)
    else inputMainNumber(number)
}

const removeCellNotes = () => {
    const selectedCell = getSelectedCell(getStoreState())
    const notesInfo = getNotesInfo(getStoreState())
    const notesBunch = getVisibileNotesBunchInCell(selectedCell, notesInfo)
    if (!notesBunch.length) return

    invokeDispatch(eraseNotesBunch(notesBunch))

    const move = {
        notes: {
            action: MOVES_TYPES.REMOVE,
            bunch: notesBunch,
        },
    }
    invokeDispatch(addMove(constructMove(move)))
}

const eraseMainNumber = () => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    const cellMainValue = mainNumbers[selectedCell.row][selectedCell.col].value
    invokeDispatch(eraseCellMainValue(selectedCell))

    const move = {
        mainNumber: {
            action: MOVES_TYPES.REMOVE,
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
    const cellMainValue = mainNumbers[selectedCell.row][selectedCell.col].value
    return cellMainValue && cellMainValue !== mainNumbers[selectedCell.row][selectedCell.col].solutionValue
}

const removeCellNotesIfEmptyCell = () => {
    const mainNumbers = getMainNumbers(getStoreState())
    const selectedCell = getSelectedCell(getStoreState())
    if (isCellEmpty(selectedCell, mainNumbers)) removeCellNotes()
}

export const initPossibleNotes = mainNumbers => {
    setTimeout(() => {
        const notes = initNotes()

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
        if (!duplicacyPresent(note, mainNumbers, cell)) result.push({ cell, note })
    })

    return result
}

function erasePossibleNotesOnNumberInput(number, selectedCell) {
    const possibleNotesInfo = getPossibleNotes(getStoreState())
    const possibleNotesBunch = getNotesToRemoveAfterMainNumberInput(number, selectedCell, possibleNotesInfo)
    invokeDispatch(erasePossibleNotesBunch(possibleNotesBunch))
}

const addPossibleNotesOnMainNumberErased = (selectedCell, mainNumbers) => {
    const numberRemoved = mainNumbers[selectedCell.row][selectedCell.col].solutionValue
    const possibleNotesBunch = [...getCellAllPossibleNotes(selectedCell, mainNumbers)]

    const cellHouses = getCellHousesInfo(selectedCell)
    cellHouses.forEach((house) => {
        getHouseCells(house).forEach(cell => {
            if (!mainNumbers[cell.row][cell.col].value && !duplicacyPresent(numberRemoved, mainNumbers, cell)) {
                possibleNotesBunch.push({ cell, note: numberRemoved })
            }
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

    if (mainNumberMove.action === MOVES_TYPES.ADD) {
        const cell = previousMove.selectedCell
        const mainNumbersBeforeErase = getMainNumbers(getStoreState())
        invokeDispatch(eraseCellMainValue(cell))
        if (isCellCorrectlyFilled(mainNumbersBeforeErase[cell.row][cell.col])) {
            const mainNumbersAfterErase = getMainNumbers(getStoreState())
            addPossibleNotesOnMainNumberErased(cell, mainNumbersAfterErase)
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

    if (notesMove.action === MOVES_TYPES.ADD) {
        invokeDispatch(eraseNotesBunch(notesMove.bunch))
    } else {
        invokeDispatch(setNotesBunch(notesMove.bunch))
    }
}

export const resetStoreState = () => {
    invokeDispatch(
        resetState({
            mainNumbers: initMainNumbers(),
            selectedCell: { row: 0, col: 0 },
            notesInfo: initNotes(),
            moves: [],
            possibleNotes: initNotes(),
        }),
    )
}

export const fillPuzzle = () => {
    const mainNumbers = getMainNumbers(getStoreState())

    forBoardEachCell(cell => {
        if (isCellEmpty(cell, mainNumbers))
            invokeDispatch(setCellMainNumber({ cell, number: mainNumbers[cell.row][cell.col].solutionValue }))
    })
}
