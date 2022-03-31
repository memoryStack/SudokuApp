import { useRef, useState, useEffect, useCallback } from 'react'
import { EVENTS, GAME_STATE, PENCIL_STATE } from '../../../resources/constants'
import { addListener, emit, removeListener } from '../../../utils/GlobalEventBus'
import { initBoardData as initMainNumbers, getBlockAndBoxNum, getRowAndCol, consoleLog } from '../../../utils/util'
import { duplicacyPresent } from '../utils/util'
import { cacheGameData, GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { useSelector } from 'react-redux'
import { getHintHCInfo } from '../store/selectors/smartHintHC.selectors'
import { addMistake } from '../store/actions/refree.actions'
import {
    updateMainNumbers,
    updateCellMainNumber,
    removeMainNumber,
    updateSelectedCell,
    updateNotes,
    removeNotesAfterCellFilled,
    removeCellNotes,
    addCellNote,
} from '../store/actions/board.actions'
import { getGameState } from '../store/selectors/gameState.selectors'
import { getPencilStatus } from '../store/selectors/boardController.selectors'
import { getMainNumbers, getNotesInfo, getSelectedCell } from '../store/selectors/board.selectors'

const initBoardData = () => {
    const movesStack = []
    return {
        movesStack,
    }
}

const isPuzzleSolved = mainNumbers => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (!mainNumbers[row][col].value) return false
        }
    }
    return true
}

const useGameBoard = hints => {

    const pencilState = useSelector(getPencilStatus)

    const { movesStack: initialmovesStack } = useRef(initBoardData()).current

    const movesStack = useRef(initialmovesStack)

    const mainNumbers = useSelector(getMainNumbers)
    const selectedCell = useSelector(getSelectedCell)
    const notesInfo = useSelector(getNotesInfo)

    const setBoardData = ({ mainNumbers, notesInfo, selectedCell, movesStack: moves }) => {
        movesStack.current = moves
        updateMainNumbers(mainNumbers)
        updateNotes(notesInfo)
        updateSelectedCell(selectedCell)
    }

    useEffect(() => {
        const handler = previousGameData => {
            setBoardData(previousGameData[GAME_DATA_KEYS.BOARD_DATA])
        }
        addListener(EVENTS.RESUME_PREVIOUS_GAME, handler)
        return () => removeListener(EVENTS.RESUME_PREVIOUS_GAME, handler)
    }, [])

    useEffect(() => {
        let componentUnmounted = false
        const handler = () => {
            const mainNumbersClone = [...mainNumbers]
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (!mainNumbersClone[row][col].isClue) mainNumbersClone[row][col].value = 0
                }
            }
            if (!componentUnmounted) setBoardData({ ...initBoardData(), mainNumbers: mainNumbersClone })
        }
        addListener(EVENTS.RESTART_GAME, handler)
        return () => {
            removeListener(EVENTS.RESTART_GAME, handler)
            componentUnmounted = true
        }
    }, [mainNumbers])

    useEffect(() => {
        const handler = ({ mainNumbers }) => {
            setBoardData({ ...initBoardData(), mainNumbers })
        }
        addListener(EVENTS.START_NEW_GAME, handler)
        return () => {
            removeListener(EVENTS.START_NEW_GAME, handler)
        }
    }, [])

    useEffect(() => {
        const handler = () => {
            const boardData = {
                mainNumbers,
                notesInfo,
                movesStack: movesStack.current,
                selectedCell,
            }
            cacheGameData(GAME_DATA_KEYS.BOARD_DATA, boardData)
        }

        addListener(EVENTS.CACHE_GAME_DATA, handler)
        return () => removeListener(EVENTS.CACHE_GAME_DATA, handler)
    }, [mainNumbers, notesInfo, movesStack, selectedCell])

    // EVENTS.INPUT_NUMBER_CLICKED
    useEffect(() => {
        const handler = ({ number, isHintUsed = false }) => {
            const { row, col } = selectedCell
            if (mainNumbers[row][col].value) return
            let valueType, moveType
            let notesErasedByMainValue = []

            let noteInserted = false
            if (pencilState === PENCIL_STATE.ACTIVE && !isHintUsed) {
                // removing the below functionality because it kind of "baby spoon feeds" the user
                // let's keep it for now and and we can keep it as a part of settings later on
                if (duplicacyPresent(number, mainNumbers, { row, col })) return
                valueType = 'notes'
                const { show } = notesInfo[row][col][number - 1]
                moveType = show ? 'erase' : 'insert'
                addCellNote({ row, col }, number)
                noteInserted = true
            } else {
                /**
                 * 1. mark move type and value type and add the number in cell
                 * 2. erase all the notes first and store them in an array for undo operation on the board
                 * 3. check if neeed to show an error msg
                 * 4. check if puzzle is solved or not
                 */

                const mainNumbersDup = [...mainNumbers]
                // mark move type and valueType and add the number in cell
                moveType = 'insert'
                valueType = 'main'
                mainNumbersDup[row][col].value = number

                // consoleLog('@@@@@@@@ duppp', mainNumbersDup)

                if (number !== mainNumbersDup[row][col].solutionValue) {
                    emit(EVENTS.MADE_MISTAKE) // TODO: remove this event
                    addMistake()
                } else {
                    notesErasedByMainValue = removeNotesAfterCellFilled(number, selectedCell)
                    if (isHintUsed) emit(EVENTS.HINT_USED_SUCCESSFULLY)
                    if (isPuzzleSolved(mainNumbersDup)) {
                        // a little delay is better
                        setTimeout(() => {
                            emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.OVER_SOLVED)
                        }, 500)
                    }
                }
                updateCellMainNumber(selectedCell, number)
            }

            const moveObject = {
                moveType: moveType,
                valueType: valueType,
                value: [number], // why is this an array ??
                notesErased: notesErasedByMainValue,
                row,
                col,
            }

            movesStack.current.push(moveObject)
        }

        addListener(EVENTS.INPUT_NUMBER_CLICKED, handler)
        return () => {
            removeListener(EVENTS.INPUT_NUMBER_CLICKED, handler)
        }
    }, [mainNumbers, notesInfo, selectedCell, pencilState])

    // EVENTS.UNDO_CLICKED
    // TODO: i think it would be better if when a mainValue is inserted in the cell
    // then don't erase the already filled notes. becoz if we do redo then we will
    // automatically see those notes without any computation logic
    // TODO: improve these "setStates"
    useEffect(() => {
        const handler = () => {
            if (!movesStack.current.length) return
            const notesInfoDup = [...notesInfo]
            const moveInfoToUndo = movesStack.current.pop()

            const { row, col, moveType, valueType, value } = moveInfoToUndo

            if (valueType === 'main') {
                if (moveType === 'insert') {
                    // hide the main value
                    removeMainNumber({ row, col })
                    // show the notes erased when this value inserted
                    const { notesErased } = moveInfoToUndo
                    for (let i = 0; i < notesErased.length; i++) {
                        const note = notesErased[i]
                        notesInfoDup[row][col][note - 1].show = 1
                    }
                } else {
                    // main value got erased, so fill that value in the cell
                    updateCellMainNumber({ row, col }, value[0])
                }
            } else {
                const notesVisibilityChanges = value
                for (let i = 0; i < notesVisibilityChanges.length; i++) {
                    const note = notesVisibilityChanges[i]
                    notesInfoDup[row][col][note - 1].show = 1 - notesInfoDup[row][col][note - 1].show
                }
            }

            const nextSelectedCell = { row, col }

            if (movesStack.current.length) {
                const len = movesStack.current.length
                const { row, col } = movesStack.current[len - 1]
                nextSelectedCell.row = row
                nextSelectedCell.col = col
            }

            // updateNotesInfo(notesInfoDup)

            updateSelectedCell(selectedCell)

            emit(EVENTS.UNDO_USED_SUCCESSFULLY)
        }
        addListener(EVENTS.UNDO_CLICKED, handler)
        return () => {
            removeListener(EVENTS.UNDO_CLICKED, handler)
        }
    }, [notesInfo, mainNumbers])

    // EVENTS.ERASER_CLICKED
    useEffect(() => {
        const handler = () => {
            /**
             * 1. if main number is present then remove it only if the number is not clue
             * 2. check if any notes are present or not. if present then remove the notes
             * 3. return if none of above happened
             */

            consoleLog('@@@@@', JSON.stringify(notesInfo))

            const { row, col } = selectedCell
            let moveType, valueType, value
            const notesInfoDup = [...notesInfo]
            let erasedSomeData = false

            if (mainNumbers[row][col].value && !mainNumbers[row][col].isClue) {
                erasedSomeData = true
                moveType = 'erase'
                valueType = 'main'
                value = [mainNumbers[row][col].value]
                removeMainNumber(selectedCell)
            } else if (!mainNumbers[row][col].value) {
                const cellNotes = notesInfoDup[row][col]
                value = [] // will store the notes to be removed (basically the notes which are visible right now)
                for (let i = 0; i < 9; i++) {
                    if (cellNotes[i].show) {
                        value.push(i + 1)
                        cellNotes[i].show = 0
                    }
                }
                if (value.length) erasedSomeData = true
            }

            // on empty cell erase doesn't make sense
            if (!erasedSomeData) return

            // TODO: group cell row, col here as well
            const moveObject = { moveType, valueType, value, row, col }
            movesStack.current.push(moveObject)
            removeCellNotes(selectedCell)
        }

        addListener(EVENTS.ERASER_CLICKED, handler)
        return () => removeListener(EVENTS.ERASER_CLICKED, handler)
    }, [selectedCell, mainNumbers, notesInfo])

    useEffect(() => {
        const handler = newCellToBeSelected => newCellToBeSelected && updateSelectedCell_(newCellToBeSelected)
        addListener(EVENTS.SMART_HINTS_HC_CLOSED, handler)
        return () => removeListener(EVENTS.SMART_HINTS_HC_CLOSED, handler)
    }, [mainNumbers, selectedCell])

    const updateSelectedCell_ = ({ row, col }) => {
        if (selectedCell.row !== row || selectedCell.col !== col) updateSelectedCell({ row, col })
    }
        
}

export { useGameBoard }
