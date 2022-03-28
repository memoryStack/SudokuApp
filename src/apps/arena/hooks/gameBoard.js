import { useRef, useState, useEffect, useCallback } from 'react'
import { EVENTS, GAME_STATE, PENCIL_STATE } from '../../../resources/constants'
import { addListener, emit, removeListener } from '../../../utils/GlobalEventBus'
import { initBoardData as initMainNumbers, getBlockAndBoxNum, getRowAndCol, consoleLog } from '../../../utils/util'
import { duplicacyPresent } from '../utils/util'
import { cacheGameData, GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { getSmartHint } from '../utils/smartHint'
import { NO_HINTS_FOUND_POPUP_TEXT } from '../utils/smartHints/constants'
import { invokeDispatch } from '../../../redux/dispatch.helpers'
import { setHints } from '../store/reducers/smartHintHC.reducers'
import { useSelector } from 'react-redux'
import { getHintHCInfo } from '../store/selectors/smartHintHC.selectors'
import { showHints } from '../store/actions/smartHintHC.actions'
import { addMistake } from '../store/actions/refree.actions'
import { updateMainNumbers, updateCellMainNumber, removeMainNumber, updateSelectedCell } from '../store/actions/board.actions'
import { getGameState } from '../store/selectors/gameState.selectors'
import { getPencilStatus } from '../store/selectors/boardController.selectors'
import { getMainNumbers, getSelectedCell } from '../store/selectors/board.selectors'

const initBoardData = () => {
    const movesStack = []
    const mainNumbers = initMainNumbers()
    const notesInfo = new Array(9)
    for (let i = 0; i < 9; i++) {
        const rowNotes = []
        for (let j = 0; j < 9; j++) {
            const boxNotes = new Array(9)
            for (let k = 1; k <= 9; k++) boxNotes[k - 1] = { noteValue: k, show: 0 } // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0] represenstion. but let's ignore it for now
            rowNotes.push(boxNotes)
        }
        notesInfo[i] = rowNotes
    }

    return {
        movesStack,
        notesInfo,
        mainNumbers,
        selectedCell: { row: 0, col: 0 },
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

// TODO: fix the repeated lines in this func
// TODO: add the removed notes in cells other than currentCell to the undo move
//          right now we are just recording the current cells notes only
const removeNotesAfterCellFilled = (notesInfo, num, cell) => {
    const { row, col } = cell
    let notesErasedByMainValue = []
    // remove notes from current cell
    for (let note = 0; note < 9; note++) {
        // taking note's indx
        const { show } = notesInfo[row][col][note]
        if (show) {
            notesErasedByMainValue.push(note + 1)
            notesInfo[row][col][note].show = 0
        }
    }
    if (notesErasedByMainValue.length) notesInfo[row][col] = [...notesInfo[row][col]]

    // remove notes from current row
    for (let row = 0; row < 9; row++) {
        const noteIndx = num - 1
        const { show } = notesInfo[row][col][noteIndx]
        if (show) {
            notesInfo[row][col][noteIndx].show = 0
            notesInfo[row][col] = [...notesInfo[row][col]]
        }
    }

    // remove notes from current col
    for (let col = 0; col < 9; col++) {
        const noteIndx = num - 1
        const { show } = notesInfo[row][col][noteIndx]
        if (show) {
            notesInfo[row][col][noteIndx].show = 0
            notesInfo[row][col] = [...notesInfo[row][col]]
        }
    }

    // remove notes from current block
    const { blockNum } = getBlockAndBoxNum(cell)
    for (let boxNum = 0; boxNum < 9; boxNum++) {
        const { row, col } = getRowAndCol(blockNum, boxNum)
        const noteIndx = num - 1
        const { show } = notesInfo[row][col][noteIndx]
        if (show) {
            notesInfo[row][col][noteIndx].show = 0
            notesInfo[row][col] = [...notesInfo[row][col]]
        }
    }

    return notesErasedByMainValue
}

const useGameBoard = (hints) => {
    
    const gameState = useSelector(getGameState)

    const pencilState = useSelector(getPencilStatus)

    const {
        movesStack: initialmovesStack,
        notesInfo: initialNotes,
    } = useRef(initBoardData()).current

    const movesStack = useRef(initialmovesStack)

    const mainNumbers = useSelector(getMainNumbers)
    const selectedCell = useSelector(getSelectedCell)

    const [notesInfo, updateNotesInfo] = useState(initialNotes)
    const [mainNumbersInstancesCount, setMainNumbersInstancesCount] = useState(new Array(10).fill(0))

    const setBoardData = ({ mainNumbers, notesInfo, selectedCell, movesStack: moves }) => {
        movesStack.current = moves
        const { row = 0, col = 0 } = selectedCell
        updateMainNumbers(mainNumbers)
        updateNotesInfo(notesInfo)
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
                notesInfo[row][col][number - 1].show = 1 - show
                notesInfo[row][col] = [...notesInfo[row][col]]
                noteInserted = true
            } else {
                /**
                 * 1. mark move type and value type and add the number in cell
                 * 2. erase all the notes first and store them in an array for undo operation on the board
                 * 3. check if neeed to show an error msg
                 * 4. check if puzzle is solved or not
                 */

                const mainNumbersDup =  JSON.parse(JSON.stringify(mainNumbers)) // [...mainNumbers]
                // mark move type and valueType and add the number in cell
                moveType = 'insert'
                valueType = 'main'
                mainNumbersDup[row][col].value = number

                // consoleLog('@@@@@@@@ duppp', mainNumbersDup)

                if (number !== mainNumbersDup[row][col].solutionValue) {
                    emit(EVENTS.MADE_MISTAKE) // TODO: remove this event
                    addMistake()
                }
                else {
                    notesErasedByMainValue = removeNotesAfterCellFilled(notesInfo, number, selectedCell)
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
            if (noteInserted || notesErasedByMainValue.length) updateNotesInfo([...notesInfo])
        }

        addListener(EVENTS.INPUT_NUMBER_CLICKED, handler)
        return () => {
            removeListener(EVENTS.INPUT_NUMBER_CLICKED, handler)
        }
    }, [mainNumbers, notesInfo, selectedCell, pencilState])

    useEffect(() => {
        const instancesCountAfterUpdate = new Array(10).fill(0)
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = mainNumbers[row][col].value
                instancesCountAfterUpdate[value]++
            }
        }

        let areEqual = true
        for (let i = 1; i <= 9 && areEqual; i++) {
            if (mainNumbersInstancesCount[i] !== instancesCountAfterUpdate[i]) {
                areEqual = false
            }
        }

        if (!areEqual) setMainNumbersInstancesCount(instancesCountAfterUpdate)
    }, [mainNumbers, mainNumbersInstancesCount])

    // EVENTS.UNDO_CLICKED
    // TODO: i think it would be better if when a mainValue is inserted in the cell
    // then don't erase the already filled notes. becoz if we do redo then we will
    // automatically see those notes without any computation logic
    // TODO: improve these "setStates"
    useEffect(() => {
        const handler = () => {
            if (!movesStack.current.length) return
            const mainNumbersDup = [...mainNumbers]
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
                    updateCellMainNumber({row, col}, value[0])
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

            updateNotesInfo(notesInfoDup)
            // selectCell(nextSelectedCell)
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
            const mainNumbersDup = [...mainNumbers]
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

            // again these three updates are together
            updateNotesInfo(notesInfoDup)
        }

        addListener(EVENTS.ERASER_CLICKED, handler)
        return () => removeListener(EVENTS.ERASER_CLICKED, handler)
    }, [selectedCell, mainNumbers, notesInfo])

    // EVENTS.FAST_PENCIL_CLICKED
    useEffect(() => {
        const handler = () => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (!mainNumbers[row][col].value) {
                        let notesUpdated = false
                        for (let num = 1; num <= 9; num++) {
                            const { show } = notesInfo[row][col][num - 1]
                            if (!show && !duplicacyPresent(num, mainNumbers, { row, col })) {
                                notesUpdated = true
                                notesInfo[row][col][num - 1].show = 1 - show
                            }
                        }
                        if (notesUpdated) notesInfo[row][col] = [...notesInfo[row][col]]
                    }
                }
            }

            consoleLog(JSON.stringify(notesInfo))
            consoleLog('@@@@@@@ main numbers', JSON.stringify(mainNumbers))
            updateNotesInfo([...notesInfo])
        }
        addListener(EVENTS.FAST_PENCIL_CLICKED, handler)
        return () => removeListener(EVENTS.FAST_PENCIL_CLICKED, handler)
    }, [mainNumbers, notesInfo])

    // EVENTS.HINT_CLICKED {it will fill the cell with the solution value directly}
    // useEffect(() => {
    //     const handler = () => {
    //         // if (!hints) return
    //         const { row, col } = selectedCell
    //         if (!mainNumbers[row][col].value)
    //             emit(EVENTS.INPUT_NUMBER_CLICKED, { number: mainNumbers[row][col].solutionValue, isHintUsed: true })
    //     }
    //     addListener(EVENTS.HINT_CLICKED, handler)
    //     return () => removeListener(EVENTS.HINT_CLICKED, handler)
    // }, [selectedCell, mainNumbers, hints])

    const getNoHintsFoundMsg = id => {
        return `no ${NO_HINTS_FOUND_POPUP_TEXT[id]} found. try other hints or try filling some more guesses.`
    }

    // it will provide the smart hint with the step wise step logic
    useEffect(() => {
        const handler = ({ id }) => {
            getSmartHint(mainNumbers, notesInfo, id)
                .then(hints => {
                    consoleLog('@@@@ hintInfo', JSON.stringify(hints))
                    if (hints) showHints(hints)
                    else {
                        emit(EVENTS.SHOW_SNACK_BAR, {
                            msg: getNoHintsFoundMsg(id),
                            visibleTime: 5000,
                        })
                    }
                })
                .catch(error => {
                    consoleLog(error)
                })
        }
        addListener(EVENTS.SHOW_SELECTIVE_HINT, handler)
        return () => removeListener(EVENTS.SHOW_SELECTIVE_HINT, handler)
    }, [mainNumbers, notesInfo])

    useEffect(() => {
        const handler = newCellToBeSelected => newCellToBeSelected && updateSelectedCell_(newCellToBeSelected)
        addListener(EVENTS.SMART_HINTS_HC_CLOSED, handler)
        return () => removeListener(EVENTS.SMART_HINTS_HC_CLOSED, handler)
    }, [mainNumbers, selectedCell])

    const updateSelectedCell_ = ({ row, col }) => {
        if (selectedCell.row !== row || selectedCell.col !== col) updateSelectedCell({ row, col })
    }

    const { show: showSmartHintHC } = useSelector(getHintHCInfo)

    const onCellClick = useCallback(
        cell => {
            if (gameState !== GAME_STATE.ACTIVE || showSmartHintHC) return
            updateSelectedCell_(cell)
        },
        [mainNumbers, gameState, showSmartHintHC, selectedCell],
    )

    return {
        notesInfo,
        onCellClick,
        mainNumbersInstancesCount,
    }
}

export { useGameBoard }
