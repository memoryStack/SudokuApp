import React, { useState, useCallback, useEffect } from 'react'
import { View } from 'react-native'
import { Styles } from './style'
import { Cell } from './cell'
import { CELL_HEIGHT, INNER_THICK_BORDER_WIDTH, GAME_BOARD_WIDTH, OUTER_THIN_BORDER_WIDTH } from './dimensions'
import { emit, addListener, removeListener } from '../../../utils/GlobalEventBus'
import { EVENTS, LEVEL_DIFFICULTIES, LEVELS_CLUES_INFO, PENCIL_STATE, GAME_STATE } from '../../../resources/constants'
import { initBoardData, generateNewSudokuPuzzle, sameHouseAsSelected, duplicacyPresent } from '../../../utils/util'
import { getNewPencilState } from '../cellActions/pencil/index'

const looper = []
for(let i=0;i<9;i++) {
    if (i%3 === 0 && i !== 0) looper.push(-1)
    looper.push(i)
}

const getThickBorderView = (height, width, key = '') =>
    <View style={[Styles.thickBorder, {height, width}]} key={key} />

const initializeData = () => {
    // going to use the array as a stack
    const movesStack = new Array()
    const mainNumbers = initBoardData()

    const notesInfo = new Array(9)
    for(let i = 0;i < 9;i++) {
        const rowNotes = []
        for(let j = 0;j < 9;j++) {
            const boxNotes = new Array(9)
            for(let k = 1;k <= 9;k++)
                boxNotes[k-1] = {"noteValue": k, "show": 0}
            rowNotes.push(boxNotes)
        }
        notesInfo[i] = rowNotes
    }
    return { movesStack, notesInfo, mainNumbers }
}

export const Board = ({ gameState }) => {
    
    const { movesStack: initialMovesStack, notesInfo: initialNotesInfo, mainNumbers: initialMainNumbers } = initializeData()
    const [mainNumbers, updateMainNumbers] = useState(initialMainNumbers) // two dimentional array 
    const [notesInfo, updateNotesInfo] = useState(initialNotesInfo)
    const [movesStack, updateMovesStack] = useState(initialMovesStack)
    const [selectedCell, selectCell] = useState({ row: 0, col: 0 }) // let's have a radom cell for newGame SelectCell (just for fun)
    const [selectedCellMainValue, setSelectedCellMainValue] = useState(0) // does this have to be a state variable ??  idts
    const [gameDifficultyLevel, setGameDifficultyLevel] = useState('')
    const [pencilState, setPencilState] = useState(PENCIL_STATE.INACTIVE) // use 'useRef' hook here to initialize the value of variable from the cache for the first render
    
    // EVENTS.PENCIL_CLICKED
    useEffect(() => {
        const handler = () => {
            setPencilState(getNewPencilState(pencilState))
        }
        addListener(EVENTS.PENCIL_CLICKED, handler)
        return () => {
            removeListener(EVENTS.PENCIL_CLICKED, handler)
        }
    }, [pencilState])

    // TODO: the cleanup here is not working when killig the app. let's discuss this
    // hook for starting new game
    useEffect(() => {
        const handler = async ({ difficultyLevel }) => {
            const time = Date.now()
            console.log('@@@@@@ geenerate puzzle')
            if (!difficultyLevel) return
            // "minClues" becoz sometimes for the expert type of levels we get more than desired clues
            const minClues = LEVELS_CLUES_INFO[difficultyLevel]
            const { movesStack, notesInfo, mainNumbers } = initializeData()
            await generateNewSudokuPuzzle(minClues, notesInfo, mainNumbers)

            console.log('@@@@@@@@ new puzzle', JSON.stringify(mainNumbers))
            console.log('@@@@@@@@ time taken is', Date.now() - time)

            // TODO: setState only if component is alive, (something i newly learned)
            setGameDifficultyLevel(difficultyLevel)
            selectCell({ row: 0, col: 0 })
            updateNotesInfo(notesInfo)
            updateMainNumbers(mainNumbers)
            updateMovesStack(movesStack)
            if (pencilState === PENCIL_STATE.ACTIVE) setPencilState(PENCIL_STATE.INACTIVE)
            
            emit(EVENTS.NEW_GAME_STARTED, { difficultyLevel })

        }
        addListener(EVENTS.START_NEW_GAME, handler)
        return () => {
            removeListener(EVENTS.START_NEW_GAME, handler)
        }
    }, [])

    // EVENTS.RESTART_GAME
    useEffect(() => {
        const handler = () => {
            emit(EVENTS.START_NEW_GAME, { difficultyLevel: gameDifficultyLevel })
        }
        addListener(EVENTS.RESTART_GAME, handler)
        return () => {
            removeListener(EVENTS.RESTART_GAME, handler)
        }
    }, [gameDifficultyLevel])

    // using it only when the component will render first time only
    useEffect(() => {
        // get data from cache for previous game if present 
        // else start new game for previous played level or easy one
        const cachedGameMainNumbers = null
        const cachedGameNotesInfo = null
        if (!cachedGameMainNumbers || !cachedGameNotesInfo) {
            // TODO: read from cache which level user successfully solved previously
            const newGameDifficultyLevel = null || LEVEL_DIFFICULTIES.EASY
            emit(EVENTS.START_NEW_GAME, { difficultyLevel: newGameDifficultyLevel })
        }
    }, [])        

    const onCellClicked = useCallback((row, col) => {
        if (selectedCell.row !== row || selectedCell.col !== col) {
            selectCell({ row, col })
            setSelectedCellMainValue(mainNumbers[row][col].value) // read it from the boardData later on

        }
    }, [selectedCell, mainNumbers])

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
            
            const mainNumbersDup = [...mainNumbers]
            const notesInfoDup = [...notesInfo]
            const movesStackDup = [...movesStack]
            if (pencilState === PENCIL_STATE.ACTIVE && !isHintUsed) {
                // if pencil is already selected then insert the value as notes
                if (duplicacyPresent(row, col, number, mainNumbersDup)) return
                valueType = 'notes'
                const { show } = notesInfoDup[row][col][number-1]
                moveType = show ? 'erase' : 'insert'
                notesInfoDup[row][col][number-1].show = 1 - show
            } else {
                /**
                 * 1. mark move type and value type and add the number in cell
                 * 2. erase all the notes first and store them in an array for undo operation on the board 
                 * 3. check if neeed to show an error msg
                 * 4. check if puzzle is solved or not
                */ 

                // mark move type and valueType and add the number in cell
                moveType = 'insert'
                valueType = 'main'
                mainNumbersDup[row][col].value = number

                // erase all the notes first and store them in an array for undo operation on the board 
                for(let i=0;i<9;i++){
                    if(notesInfoDup[row][col][i].show){
                        notesErasedByMainValue.push(i+1)
                        notesInfoDup[row][col][i].show = 0
                    }
                }

                if (number !== mainNumbersDup[row][col].solutionValue) emit(EVENTS.MADE_MISTAKE)
                else if (isPuzzleSolved()) emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.OVER_SOLVED)
            }

            const moveObject = {
                moveType: moveType,
                valueType: valueType,
                value: [number], // why is this an array ??
                notesErased: notesErasedByMainValue,
                row,
                col,
            }

            movesStackDup.push(moveObject)
            // i guess it would be better to put these three in a object
            // becoz these get updated together most of the time
            updateMainNumbers(mainNumbersDup)
            updateNotesInfo(notesInfoDup)
            updateMovesStack(movesStackDup)
        }

        addListener(EVENTS.INPUT_NUMBER_CLICKED, handler)
        return () => {
            removeListener(EVENTS.INPUT_NUMBER_CLICKED, handler)
        }
    }, [mainNumbers, notesInfo, movesStack, selectedCell, pencilState])

    // EVENTS.UNDO_CLICKED
    // TODO: i think it would be better if when a mainValue is inserted in the cell 
    // then don't erase the already filled notes. becoz if we do redo then we will 
    // automatically see those notes without any computation logic
    useEffect(() => {
        const handler = () => {
            if (!movesStack.length) return
            const movesStackDup = [...movesStack]
            const mainNumbersDup = [...mainNumbers]
            const notesInfoDup = [...notesInfo]
            const moveInfoToUndo = movesStackDup.pop(movesStackDup)
            

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
            updateMovesStack(movesStackDup)
            updateNotesInfo(notesInfoDup)
            selectCell({ row, col })

            emit(EVENTS.UNDO_USED_SUCCESSFULLY)
        }
        addListener(EVENTS.UNDO_CLICKED, handler)
        return () => {
            removeListener(EVENTS.UNDO_CLICKED, handler)
        }
    }, [movesStack, notesInfo, mainNumbers])
    
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
            const movesStackDup = [...movesStack]
            const notesInfoDup = [...notesInfo]
            let erasedSomeData = false
            
            if (mainNumbers[row][col].value && !mainNumbers[row][col].isClue) {
                erasedSomeData = true
                moveType = 'erase'
                valueType = 'main'
                value = [mainNumbers[row][col].value]
                mainNumbersDup[row][col].value = 0
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
            movesStackDup.push(moveObject)
            // again these three updates are together
            updateMainNumbers(mainNumbersDup)
            updateNotesInfo(notesInfoDup)
            updateMovesStack(movesStackDup)
        }
        
        addListener(EVENTS.ERASER_CLICKED, handler)
        return () => {
            removeListener(EVENTS.ERASER_CLICKED, handler)
        }
    }, [selectedCell, mainNumbers, movesStack, notesInfo])

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
                emit(EVENTS.HINT_USED_SUCCESSFULLY)
            }
        }
        addListener(EVENTS.HINT_CLICKED, handler)
        return () => {
            removeListener(EVENTS.HINT_CLICKED, handler)
        }
    }, [selectedCell, mainNumbers])

    // TODO: need to fix the background color for same value as selected cell's number
    const sameValueAsSelectedBox = (row, col) =>
        selectedCellMainValue && selectedCellMainValue === mainNumbers[row][col].value
    
    const getMainNumFontColor = (row, col) => {
        if (!mainNumbers[row][col].value) return null
        const isWronglyPlaced = mainNumbers[row][col].value !== mainNumbers[row][col].solutionValue
        if (isWronglyPlaced) return Styles.wronglyFilledNumColor
        if (!mainNumbers[row][col].isClue) return Styles.userFilledNumColor
        return Styles.clueNumColor
    }

    const getBoxBackgroundColor = (row, col) => {
        if (gameState !== GAME_STATE.ACTIVE) return null
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
                { // TODO: give this looper a proper name
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
