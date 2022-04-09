import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import { PENCIL_STATE } from '../../../../resources/constants'
import { getBlockAndBoxNum, initMainNumbers } from '../../../../utils/util'
import { HOUSE_TYPE } from '../../utils/smartHints/constants'
import { duplicacyPresent, initNotes, isCellEmpty } from '../../utils/util'
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
    const mainNumbers = getMainNumbers(getStoreState())
    const notesInfo = getNotesInfo(getStoreState())

    const bunch = []
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (!mainNumbers[row][col].value) {
                for (let num = 1; num <= 9; num++) {
                    const { show } = notesInfo[row][col][num - 1]
                    if (!show && !duplicacyPresent(num, mainNumbers, { row, col })) {
                        bunch.push({ cell: { row, col }, note: num })
                    }
                }
            }
        }
    }

    if (!bunch.length) return

    invokeDispatch(setNotesBunch(bunch))

    const move = {
        notes: {
            action: MOVES_TYPES.ADD,
            bunch,
        },
    }
    invokeDispatch(addMove(constructMove(move)))
}

const MOVES_TYPES = {
    ADD: 'ADD',
    REMOVE: 'REMOVE',
}

const getVisibileNotesBunchInCell = (cell, notesInfo) => {
    const result = []
    for (let note = 0; note < 9; note++) {
        const { show } = notesInfo[cell.row][cell.col][note]
        if (show) result.push({ cell, note: note + 1 })
    }
    return result
}

// TODO: this can be moved to utils
// or do i have this func in utils ?
const getCellHousesInfo = cell => {
    const result = [
        {
            type: HOUSE_TYPE.ROW,
            num: cell.row,
        },
        {
            type: HOUSE_TYPE.COL,
            num: cell.col,
        },
        {
            type: HOUSE_TYPE.BLOCK,
            num: getBlockAndBoxNum(cell).blockNum,
        },
    ]
    return result
}

const getNotesToRemoveAfterMainNumberInput = (number, cell, notesInfo) => {
    const result = []
    result.push(...getVisibileNotesBunchInCell(cell, notesInfo))

    const cellHouses = getCellHousesInfo(cell)
    cellHouses.forEach(({ type, num }) => {
        getHouseCells(type, num).forEach(({ row, col }) => {
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

const removeCellNotes = cell => {
    const notesInfo = getNotesInfo(getStoreState())
    const notesBunch = getVisibileNotesBunchInCell(cell, notesInfo)
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
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())

    const cellMainValue = mainNumbers[selectedCell.row][selectedCell.col].value
    const shouldEraseMainValue =
        cellMainValue && cellMainValue !== mainNumbers[selectedCell.row][selectedCell.col].solutionValue
    if (shouldEraseMainValue) {
        eraseMainNumber()
    } else if (!cellMainValue) {
        removeCellNotes(selectedCell)
    }
}

export const initPossibleNotes = mainNumbers => {
    setTimeout(() => {
        const notes = initNotes()
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cellNotes = getCellAllPossibleNotes({ row, col }, mainNumbers)
                cellNotes.forEach(({ note }) => {
                    notes[row][col][note - 1].show = 1
                })
            }
        }

        invokeDispatch(setPossibleNotes(notes))
    })
}

const getCellAllPossibleNotes = (cell, mainNumbers) => {
    const result = []
    if (!isCellEmpty(cell, mainNumbers)) return result

    for (let num = 1; num <= 9; num++) {
        if (!duplicacyPresent(num, mainNumbers, cell)) {
            result.push({ cell, note: num })
        }
    }
    return result
}

function erasePossibleNotesOnNumberInput(number, selectedCell) {
    const possibleNotesInfo = getPossibleNotes(getStoreState())
    const possibleNotesBunch = getNotesToRemoveAfterMainNumberInput(number, selectedCell, possibleNotesInfo)
    invokeDispatch(erasePossibleNotesBunch(possibleNotesBunch))
}

const addPossibleNotesOnMainNumberErased = (selectedCell, wasCorrectValue, mainNumbers) => {
    if (!wasCorrectValue) return

    const numberRemoved = mainNumbers[selectedCell.row][selectedCell.col].solutionValue
    const possibleNotesBunch = [...getCellAllPossibleNotes(selectedCell, mainNumbers)]

    const cellHouses = getCellHousesInfo(selectedCell)
    cellHouses.forEach(({ type, num: houseNum }) => {
        getHouseCells(type, houseNum).forEach(cell => {
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

    undoSelectedCell()
    undoMainNumber()
    undoNotes()

    invokeDispatch(popMove())

    function undoSelectedCell() {
        const previousSelectedCell = previousMove.selectedCell
        updateSelectedCell(previousSelectedCell)
    }

    function undoMainNumber() {
        const mainNumberMove = previousMove.mainNumber
        if (!mainNumberMove.action) return

        if (mainNumberMove.action === MOVES_TYPES.ADD) {
            const cell = previousMove.selectedCell
            const mainNumbersBeforeErase = getMainNumbers(getStoreState())
            invokeDispatch(eraseCellMainValue(cell))

            // TODO: may be we can extract this check and make it a util func
            const wasCorrectValue =
                mainNumbersBeforeErase[cell.row][cell.col].value ===
                mainNumbersBeforeErase[cell.row][cell.col].solutionValue
            const mainNumbersAfterErase = getMainNumbers(getStoreState())
            addPossibleNotesOnMainNumberErased(cell, wasCorrectValue, mainNumbersAfterErase)
        } else {
            // this will be executed only for the mistake made.
            // correct filled numbers are anyway not erasable.
            invokeDispatch(setCellMainNumber({ cell: previousMove.selectedCell, number: mainNumberMove.value }))
        }
    }

    function undoNotes() {
        const notesMove = previousMove.notes
        if (!notesMove.action) return

        if (notesMove.action === MOVES_TYPES.ADD) {
            invokeDispatch(eraseNotesBunch(notesMove.bunch))
        } else {
            invokeDispatch(setNotesBunch(notesMove.bunch))
        }
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
