import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { Styles } from './style'
import { Cell } from './cell'
import { CELL_HEIGHT, INNER_THICK_BORDER_WIDTH, GAME_BOARD_WIDTH, OUTER_THIN_BORDER_WIDTH } from './dimensions'
import { emit, addListener, removeListener } from '../../../utils/GlobalEventBus'
import { EVENTS, LEVEL_DIFFICULTIES, LEVELS_CLUES_INFO, PENCIL_STATE, GAME_STATE } from '../../../resources/constants'
import { initBoardData, generateNewSudokuPuzzle, sameHouseAsSelected, duplicacyPresent, deepClone } from '../../../utils/util'
import { getKey, setKey } from '../../../utils/storage'
import { usePrevious } from '../../../utils/customHooks'

const looper = []
for(let i=0;i<9;i++) {
    if (i%3 === 0 && i !== 0) looper.push(-1)
    looper.push(i)
}

const getThickBorderView = (height, width, key = '') =>
    <View style={[Styles.thickBorder, {height, width}]} key={key} />

export const Board = ({ gameState, pencilState, boardData }) => {
    let movesStack = useRef(boardData.movesStack)
    const [mainNumbers, updateMainNumbers] = useState(boardData.mainNumbers)
    const [notesInfo, updateNotesInfo] = useState(boardData.notesInfo)
    const [selectedCell, selectCell] = useState(boardData.selectedCell)
    let selectedCellMainValue = useRef(boardData.mainNumbers[selectedCell.row][selectedCell.col].value)
    const previousGameState = usePrevious(gameState)

    useEffect(() => {
        const { movesStack: moves, notesInfo, mainNumbers, selectedCell } = boardData
        movesStack.current = moves
        updateMainNumbers(mainNumbers)
        updateNotesInfo(notesInfo)
        selectCell(selectedCell)
        selectedCellMainValue.current = mainNumbers[selectedCell.row][selectedCell.col].value
    }, [boardData])

    const onCellClicked = useCallback((row, col) => {
        selectedCellMainValue.current = mainNumbers[row][col].value
        selectCell(selectedCell => {
            if (selectedCell.row !== row || selectedCell.col !== col) return { row, col }
            return selectedCell
        })
    }, [mainNumbers])

    useEffect(() => {
        if (gameState !== GAME_STATE.ACTIVE && previousGameState === GAME_STATE.ACTIVE) {
            const data = {
                mainNumbers,
                notesInfo,
                selectedCell,
                movesStack: movesStack.current,
            }
            emit(EVENTS.SAVE_GAME_STATE, { type: 'boardData', data })
        }        
    }, [gameState, mainNumbers, notesInfo, selectedCell])

    const isPuzzleSolved = () => {
        for (let row=0;row<9;row++) {
            for (let col=0;col<9;col++) {
                if (!mainNumbers[row][col].value) return false
            }
        }
        return true
    }

    // EVENTS.INPUT_NUMBER_CLICKED 
    useEffect(() => {

        const handler = ({ number, isHintUsed = false }) => {
            const { row, col } = selectedCell
            if (mainNumbers[row][col].value) return
            let valueType, moveType
            let notesErasedByMainValue = []

            let notesUpdated = false
            if (pencilState === PENCIL_STATE.ACTIVE && !isHintUsed) {
                // removing the below functionality because it kind of "baby spoon feeds" the user
                // if (duplicacyPresent(row, col, number, mainNumbersDup)) return
                valueType = 'notes'
                const { show } = notesInfo[row][col][number-1]
                moveType = show ? 'erase' : 'insert'
                notesInfo[row][col][number-1].show = 1 - show
                notesUpdated = true
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

                // erase all the notes first and store them in an array for undo operation on the board 
                for (let i=0;i<9;i++) {
                    if (notesInfo[row][col][i].show) {
                        notesErasedByMainValue.push(i+1)
                        notesInfo[row][col][i].show = 0
                        notesUpdated = true
                    }
                }

                if (number !== mainNumbersDup[row][col].solutionValue) emit(EVENTS.MADE_MISTAKE)
                else {
                    if (isHintUsed) emit(EVENTS.HINT_USED_SUCCESSFULLY)
                    if (isPuzzleSolved()) {
                        // first call the hints used successfully so that hints left can be updated prooperly
                        // and correct hints left will be shown in the congrats card
                        // setTimeout is also done because of the above reason
                        setTimeout(() => {
                            emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.OVER_SOLVED)
                        }, 0)
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
            if (notesUpdated) {
                notesInfo[row][col] = deepClone(notesInfo[row][col])
                updateNotesInfo({...notesInfo})
            }
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
                    for(let i=0;i<notesErased.length;i++){
                        const note = notesErased[i]
                        notesInfoDup[row][col][note - 1].show = 1
                    }
                } else {
                    // main value got erased, so fill that value in the cell
                    mainNumbers[row][col].value = value[0]
                }
            } else {
                const notesVisibilityChanges = value
                for(let i=0;i<notesVisibilityChanges.length;i++){
                    const note = notesVisibilityChanges[i]
                    const isVisible = notesInfoDup[row][col][note-1].show
                    notesInfoDup[row][col][note-1].show = 1 - isVisible
                }
            }

            updateMainNumbers(mainNumbersDup)            
            updateNotesInfo(notesInfoDup)
            selectCell({ row, col })

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
                for (let i=0;i<9;i++) {
                    if (cellNotes[i].show) {
                        value.push(i+1)
                        cellNotes[i].show = 0
                    }
                }
                if (value.length) erasedSomeData = true
            }

            // on empty cell erase doesn't make sense
            if (!erasedSomeData) return

            const moveObject = { moveType, valueType, value, row, col }
            
            movesStack.current.push(moveObject)
            
            // again these three updates are together
            updateMainNumbers(mainNumbersDup)
            updateNotesInfo(notesInfoDup)
        }
        
        addListener(EVENTS.ERASER_CLICKED, handler)
        return () => {
            removeListener(EVENTS.ERASER_CLICKED, handler)
        }
    }, [selectedCell, mainNumbers, notesInfo])

    // when hint is clicked 
    useEffect(() => {
        const handler = () => {
            /**
             * 1. place hint if cell doesn't have numbers filled in. doesn't matter if the number filled is correct or wrong
             * 2. if going to use hint then emit 'INPUT_NUMBER_CLICKED' and 'HINT_USED_SUCCESSFULLY' events
             */
            const { row, col } = selectedCell
            if (!mainNumbers[row][col].value) {
                emit(EVENTS.INPUT_NUMBER_CLICKED, { number: mainNumbers[row][col].solutionValue, isHintUsed: true })
            }
        }
        addListener(EVENTS.HINT_CLICKED, handler)
        return () => {
            removeListener(EVENTS.HINT_CLICKED, handler)
        }
    }, [selectedCell, mainNumbers])

    // TODO: need to fix the background color for same value as selected cell's number
    const sameValueAsSelectedBox = (row, col) =>
        selectedCellMainValue.current && selectedCellMainValue.current === mainNumbers[row][col].value
    
    const getMainNumFontColor = (row, col) => {
        if (!mainNumbers[row][col].value) return null
        const isWronglyPlaced = mainNumbers[row][col].value !== mainNumbers[row][col].solutionValue
        if (isWronglyPlaced) return Styles.wronglyFilledNumColor
        if (!mainNumbers[row][col].isClue) return Styles.userFilledNumColor
        return Styles.clueNumColor
    }

    const getBoxBackgroundColor = (row, col) => {
        if (gameState === GAME_STATE.INACTIVE) return null
        const { row: selectedCellRow = 0, col: selectedCellCol = 0  } = selectedCell || {}
        const isSameHouseAsSelected = sameHouseAsSelected(row, col, selectedCellRow, selectedCellCol)
        const isSameValueAsSelected = sameValueAsSelectedBox(row, col)
        const isSelected = selectedCellRow === row && selectedCellCol === col
        
        if (isSelected) return Styles.selectedCellBGColor
        if (isSameHouseAsSelected && isSameValueAsSelected) return Styles.sameHouseSameValueBGColor
        if (isSameHouseAsSelected) return Styles.sameHouseCellBGColor
        if (!isSameHouseAsSelected && isSameValueAsSelected) return Styles.diffHouseSameValueBGColor
        return null
    }

    const renderRow = (row, key) => {
        let rowElementsKeyCounter = 0
        return (
            <View style={Styles.rowStyle} key={key}>
                {
                    looper.map((col) => {
                        const elementKey = `${rowElementsKeyCounter++}`
                        if (col === -1) return getThickBorderView(CELL_HEIGHT, INNER_THICK_BORDER_WIDTH, elementKey)
                        return (
                            <View
                                style={Styles.cellContainer}
                                key={elementKey}
                            >
                                <Cell
                                    row={row}
                                    col={col}
                                    cellBGColor={getBoxBackgroundColor(row, col)}
                                    mainValueFontColor={getMainNumFontColor(row, col)}
                                    cellMainValue={mainNumbers[row][col].value}
                                    cellNotes={notesInfo[row][col]}
                                    onCellClicked={onCellClicked}
                                    gameState={gameState}
                                />
                            </View>
                        )
                    })
                }
            </View>
        )
    }
    
    const getBoard = () => {
        let keyCounter = 0
        return (
            <View style={Styles.board}> 
                {
                    looper.map( row => {
                        const elementKey = `${keyCounter++}`
                        if (row === -1) return getThickBorderView(INNER_THICK_BORDER_WIDTH, GAME_BOARD_WIDTH - 2 * OUTER_THIN_BORDER_WIDTH, elementKey)
                        return renderRow(row, elementKey)
                    })
                }
            </View>
        )
    }

    return getBoard()
}
