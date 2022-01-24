import { useRef, useState, useEffect, useCallback } from 'react'
import { EVENTS, GAME_STATE, PENCIL_STATE } from '../../../resources/constants'
import { addListener, emit, removeListener } from '../../../utils/GlobalEventBus'
import { initBoardData as initMainNumbers, getBlockAndBoxNum, getRowAndCol, consoleLog } from '../../../utils/util'
import { duplicacyPresent } from '../utils/util'
import { cacheGameData, GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { getSmartHint } from '../utils/smartHint'

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

const useGameBoard = (gameState, pencilState, hints) => {
    const {
        movesStack: initialmovesStack,
        notesInfo: initialNotes,
        mainNumbers: initialMainNumbers,
        selectedCell: initialSelectedCell,
    } = useRef(initBoardData()).current

    const movesStack = useRef(initialmovesStack)
    const [mainNumbers, updateMainNumbers] = useState(initialMainNumbers)
    const [notesInfo, updateNotesInfo] = useState(initialNotes)
    const [selectedCell, selectCell] = useState(initialSelectedCell)
    const [smartHintInfo, setSmartHintData] = useState({ show: false, hints: [], currentHintNum: 0 })
    const selectedCellMainValue = useRef(mainNumbers[selectedCell.row][selectedCell.col].value)

    const setBoardData = ({ mainNumbers, notesInfo, selectedCell, movesStack: moves }) => {
        movesStack.current = moves
        const { row = 0, col = 0 } = selectedCell
        selectedCellMainValue.current = mainNumbers[row][col].value
        updateMainNumbers(mainNumbers)
        updateNotesInfo(notesInfo)
        selectCell(selectedCell)
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

                const mainNumbersDup = [...mainNumbers]
                // mark move type and valueType and add the number in cell
                moveType = 'insert'
                valueType = 'main'
                mainNumbersDup[row][col].value = number

                if (number !== mainNumbersDup[row][col].solutionValue) emit(EVENTS.MADE_MISTAKE)
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
                selectedCellMainValue.current = number
                updateMainNumbers(mainNumbersDup)
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
                    mainNumbersDup[row][col].value = 0
                    // show the notes erased when this value inserted
                    const { notesErased } = moveInfoToUndo
                    for (let i = 0; i < notesErased.length; i++) {
                        const note = notesErased[i]
                        notesInfoDup[row][col][note - 1].show = 1
                    }
                } else {
                    // main value got erased, so fill that value in the cell
                    mainNumbersDup[row][col].value = value[0]
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

            updateMainNumbers(mainNumbersDup)
            updateNotesInfo(notesInfoDup)
            selectCell(nextSelectedCell)
            selectedCellMainValue.current = mainNumbersDup[nextSelectedCell.row][nextSelectedCell.col].value

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
                mainNumbersDup[row][col].value = 0
                selectedCellMainValue.current = mainNumbersDup[row][col].value
            } else {
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
            updateMainNumbers(mainNumbersDup)
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

    // it will provide the smart hint with the step wise step logic

    const onNextHintClick = useCallback(() => {
        setSmartHintData(hintsData => {
            const nextHintNum = hintsData.currentHintNum + 1
            return {
                ...hintsData,
                currentHintNum: nextHintNum,
            }
        })
    }, [])

    const onPrevHintClick = useCallback(() => {
        setSmartHintData(hintsData => {
            const prevHintNum = hintsData.currentHintNum - 1
            return {
                ...hintsData,
                currentHintNum: prevHintNum,
            }
        })
    }, [])

    useEffect(() => {
        const handler = () => {
            getSmartHint(selectedCell, mainNumbers, notesInfo)
                .then(hints => {
                    __DEV__ && console.log('@@@@ hintInfo', JSON.stringify(hints))
                    if (hints) setSmartHintData({ show: true, hints, currentHintNum: 1 })
                })
                .catch(error => {
                    __DEV__ && console.log(error)
                })
        }
        addListener(EVENTS.HINT_CLICKED, handler)
        return () => removeListener(EVENTS.HINT_CLICKED, handler)
    }, [selectedCell, mainNumbers, notesInfo])

    useEffect(() => {
        const handler = () => {
            setSmartHintData({ show: false, hints: [], currentHintNum: 0 })
        }
        addListener(EVENTS.SMART_HINTS_HC_CLOSED, handler)
        return () => removeListener(EVENTS.SMART_HINTS_HC_CLOSED, handler)
    }, [])

    const onCellClick = useCallback(
        ({ row, col }) => {
            if (gameState !== GAME_STATE.ACTIVE || smartHintInfo.show) return
            selectedCellMainValue.current = mainNumbers[row][col].value
            selectCell(selectedCell => {
                if (selectedCell.row !== row || selectedCell.col !== col) return { row, col }
                return selectedCell
            })
        },
        [mainNumbers, gameState, smartHintInfo],
    )

    return {
        mainNumbers,
        notesInfo,
        selectedCell,
        selectedCellMainValue: selectedCellMainValue.current,
        onCellClick,
        smartHintInfo: {
            show: smartHintInfo.show,
            info: smartHintInfo.currentHintNum ? smartHintInfo.hints[smartHintInfo.currentHintNum - 1] : {},
            nextHintClick: onNextHintClick,
            prevHintClick: onPrevHintClick,
            currentHintNum: smartHintInfo.currentHintNum,
            totalHintsCount: smartHintInfo.hints.length,
        },
    }
}

export { useGameBoard }
