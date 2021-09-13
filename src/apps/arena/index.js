import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Animated, Text, StyleSheet, Dimensions } from 'react-native'
import { Board } from './gameBoard'
import { Inputpanel } from './inputPanel'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { emit, addListener, removeListener } from '../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE, LEVEL_DIFFICULTIES, LEVELS_CLUES_INFO, PREVIOUS_GAME, PENCIL_STATE } from '../../resources/constants'
import { Page } from '../components/Page'
import { CUSTOMIZE_YOUR_PUZZLE_TITLE } from './nextGameMenu'
import { initBoardData as initMainNumbers, generateNewSudokuPuzzle, getBlockAndBoxNum, getRowAndCol } from '../../utils/util'
import { GameOverCard } from './gameOverCard'
import { getNewPencilState } from './cellActions/pencil'
import { getKey, setKey } from '../../utils/storage'
import { usePrevious } from '../../utils/customHooks'
import { Undo } from './cellActions/undo'
import { Pencil } from './cellActions/pencil'
import { FastPencil } from './cellActions/fastPencil'
import { Hint } from './cellActions/hint'
import { Timer } from './timer'
import { isGameOver, shouldSaveGameState, duplicacyPresent } from './utils/util'
import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'
import { CustomPuzzle } from './customPuzzle'

const MAX_AVAILABLE_HINTS = 3
const MISTAKES_LIMIT = 3
const { width: windowWidth } = Dimensions.get('window')
export const CELL_ACTION_ICON_BOX_DIMENSION = (windowWidth / 100) * 5
const CUSTOMIZED_PUZZLE_LEVEL_TITLE = 'Customized Puzzle'
let timeTaken = 0
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    newGameButtonContainer: {
        alignSelf: 'flex-start',
        height: 40,
        width: 120,
        marginTop: 16,
        marginBottom: 8,
        marginLeft: windowWidth * 0.03,
    },
    refereeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '94%',
        marginBottom: 4,
    },
    refereeTextStyles: {
        fontSize: 14,
    },
    gameOverCardAbsoluteBG: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    gameOverAnimatedBG: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, .8)',
    },
    cellActionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    inputPanelContainer: {
        width: '100%',
        marginVertical: 20,
    },
})

const initBoardData = () => {
    const movesStack = []
    const mainNumbers = initMainNumbers()
    const notesInfo = new Array(9)
    for(let i = 0;i < 9;i++) {
        const rowNotes = []
        for(let j = 0;j < 9;j++) {
            const boxNotes = new Array(9)
            for(let k = 1;k <= 9;k++)
                boxNotes[k-1] = { noteValue: k, show: 0 } // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0] represenstion. but let's ignore it for now
            rowNotes.push(boxNotes)
        }
        notesInfo[i] = rowNotes
    }

    return {
        movesStack,
        notesInfo,
        mainNumbers,
        selectedCell: {row: 0, col: 0},
    }
}

const initRefereeData = (level = LEVEL_DIFFICULTIES.EASY) => {
    return {
        level,
        mistakes: 0,
        time: { hours: 0, minutes: 0, seconds: 0 }
    }
}

const initCellActionsData = () => {
    return {
        pencilState: PENCIL_STATE.INACTIVE,
        hints: MAX_AVAILABLE_HINTS,
    }
}

// default or empty state
const initComponentsDefaultState = () => {
    return {
        referee: initRefereeData(),
        cellActionsData: initCellActionsData(),
        boardData: initBoardData(),
    }
}

const getNewTime = ({ hours = 0, minutes = 0, seconds = 0 }) => {
    seconds++
    if (seconds === 60) {
        minutes++
        seconds = 0
    }
    if (minutes === 60) {
        hours++
        minutes = 0
    }
    return { hours, minutes, seconds }
}

const Arena_ = ({ navigation, route }) => {

    const [gameState, setGameState] = useState(GAME_STATE.INACTIVE)
    const [pageHeight, setPageHeight] = useState(0)
    const [showGameSolvedCard, setGameSolvedCard] = useState(false)
    const previousGameState = usePrevious(gameState)

    const { referee: initialRefereeData, cellActionsData: initialCellActionsData, boardData: initialBoardData } = useRef(initComponentsDefaultState()).current
    // referee state variables
    const timerId = useRef(null)
    const [mistakes, setMistakes] = useState(initialRefereeData.mistakes)
    const [difficultyLevel, setDifficultyLevel] = useState(initialRefereeData.difficultyLevel)
    const [time, setTime] = useState(initialRefereeData.time)

    // cell Actions state variables
    const [hints, setHints] = useState(initialCellActionsData.hints)
    const [pencilState, setPencilState] = useState(initialCellActionsData.pencilState)
    
    // board state variables
    let movesStack = useRef(initialBoardData.movesStack)
    const [mainNumbers, updateMainNumbers] = useState(initialBoardData.mainNumbers)
    const [notesInfo, updateNotesInfo] = useState(initialBoardData.notesInfo)
    const [selectedCell, selectCell] = useState(initialBoardData.selectedCell)
    const selectedCellMainValue = useRef(initialBoardData.mainNumbers[selectedCell.row][selectedCell.col].value)

    const [showCustomPuzzleHC, setShowCustomPuzzleHC] = useState(false)

    // for game over halfcard animation
    const fadeAnim = useRef(new Animated.Value(0)).current

    // EVENTS.PENCIL_CLICKED
    useEffect(() => {
        const handler = () => setPencilState(pencilState => getNewPencilState(pencilState))
        addListener(EVENTS.PENCIL_CLICKED, handler)
        return () => {
            removeListener(EVENTS.PENCIL_CLICKED, handler)
        }
    }, [])
    
    const resetCellActions = () => {
        const { pencilState, hints } = initCellActionsData()
        setPencilState(pencilState)
        setHints(hints)
    }

    const setBoardData = ({ mainNumbers, notesInfo, selectedCell, movesStack: moves }) => {
        movesStack.current = moves
        const {row = 0, col = 0} = selectedCell
        selectedCellMainValue.current = mainNumbers[row][col].value
        updateMainNumbers(mainNumbers)
        updateNotesInfo(notesInfo)
        selectCell(selectedCell)
    }

    const setRefereeData = ({ mistakes, level, time }) => {
        setTime(time)
        setDifficultyLevel(level)
        setMistakes(mistakes)
    }

    useEffect(() => {
        let componentUnmounted = false
        const handler = ({ difficultyLevel }) => {
            const time = Date.now()
            if (!difficultyLevel) return
            // "minClues" becoz sometimes for the expert type of levels we get more than desired clues
            const minClues = LEVELS_CLUES_INFO[difficultyLevel]
            const boardData = initBoardData()
            // now as i changed the position of "timeTaken" reading after the puzzle has 
            // been generated looks like that puzzle algo was never a big issue. it was just the setStates latency
            // TODO: Research on this setState issue.
            RNSudokuPuzzle.getSudokuPuzzle(minClues)
            .then(({ clues, solution }) => {
                if (!componentUnmounted) {
                    timeTaken = Date.now() - time
                    let cellNo = 0;
                    for (let row=0;row<9;row++) {
                        for (let col=0;col<9;col++) {
                            const cellvalue = clues[cellNo]
                            boardData.mainNumbers[row][col] = {
                                value: cellvalue,
                                solutionValue: solution[cellNo],
                                isClue: cellvalue !== 0,
                            }
                            cellNo++
                        }
                    }
                    setBoardData(boardData)
                    setRefereeData(initRefereeData(difficultyLevel))
                    resetCellActions()
                    onNewGameStarted()
                    console.log('@@@@@@@@ time taken is to generate new puzzle is', timeTaken)
                }
            })

            // puzzle generator in JS
            // generateNewSudokuPuzzle(minClues, boardData.mainNumbers)
            // .then(() => {
            //     if (!componentUnmounted) {
            //         timeTaken = Date.now() - time
            //         setBoardData(boardData)
            //         setRefereeData(initRefereeData(difficultyLevel))
            //         resetCellActions()
            //         onNewGameStarted()
            //     }
            //     console.log('@@@@@@@@ time taken is to generate new puzzle is', timeTaken)
            // })
        }
        addListener(EVENTS.START_NEW_GAME, handler)
        return () => {
            removeListener(EVENTS.START_NEW_GAME, handler)
            componentUnmounted = true
        }
    }, [])

    // resume previous game or start new game of previously solved level
    useEffect(() => {
        if (gameState !== GAME_STATE.INACTIVE) return
        const { params: { selectedGameMenuItem = LEVEL_DIFFICULTIES.EASY } = {} } = route || {}
        if (selectedGameMenuItem === 'resume') {
            getKey(PREVIOUS_GAME).then(previousGame => {
                if (previousGame) {
                    const { state, referee, boardData, cellActionsData } = previousGame
                    if (state !== GAME_STATE.INACTIVE) {
                        // TODO: for this case we should show a nudge to the user becasue
                        // we are starting a new puzzle while the user was expecting
                        // a previous puzzle to be resumed
                        emit(EVENTS.START_NEW_GAME, { difficultyLevel: referee.level })
                    } else {
                        setRefereeData(referee)
                        setBoardData(boardData)
                        setGameState(GAME_STATE.ACTIVE)
                        const { hints, pencilState } = cellActionsData
                        setPencilState(pencilState)
                        setHints(hints)
                    }
                } else {
                    emit(EVENTS.START_NEW_GAME, { difficultyLevel: initialRefereeData.level })
                }
            }).catch(err => {
                __DEV__ && console.log(err)
            })
        } else if (selectedGameMenuItem === CUSTOMIZE_YOUR_PUZZLE_TITLE) {
            setShowCustomPuzzleHC(true)
        } else {
            emit(EVENTS.START_NEW_GAME, { difficultyLevel: selectedGameMenuItem })
        }
    }, [route])

    const onCustomPuzzleValiditySuccessful = useCallback(({mainNumbers}) => {
        const boardData = initBoardData()
        boardData.mainNumbers = mainNumbers
        setBoardData(boardData)
        setRefereeData(initRefereeData(CUSTOMIZED_PUZZLE_LEVEL_TITLE))
        resetCellActions()
        onNewGameStarted()
    }, [])

    // EVENTS.RESTART_GAME
    useEffect(() => {
        let componentUnmounted = false
        const handler = () => {
            const mainNumbersClone = [...mainNumbers]
            for(let row=0;row<9;row++)
                for(let col=0;col<9;col++)
                    if (!mainNumbersClone[row][col].isClue) mainNumbersClone[row][col].value = 0
            if (!componentUnmounted) { // setState only when component is alive
                setRefereeData(initRefereeData(difficultyLevel))
                setBoardData({...initBoardData(), mainNumbers: mainNumbersClone})
                resetCellActions()
            }
            onNewGameStarted()
        }
        addListener(EVENTS.RESTART_GAME, handler)
        return () => {
            removeListener(EVENTS.RESTART_GAME, handler)
            componentUnmounted = true
        }
    }, [difficultyLevel, mainNumbers])

    // listen for changing game state. and it should be only one listener through out the Arena screen
    useEffect(() => {
        const handler = newState => newState && setGameState(newState)
        addListener(EVENTS.CHANGE_GAME_STATE, handler)
        return () => removeListener(EVENTS.CHANGE_GAME_STATE, handler)
    }, [])

    // EVENTS.MADE_MISTAKE
    useEffect(() => {
        let componentUnmounted = false
        const handler = () => {
            let totalMistakes = mistakes + 1
            if (!componentUnmounted) {
                setMistakes(totalMistakes)
                totalMistakes === MISTAKES_LIMIT && emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.OVER_UNSOLVED)
            }
        }
        addListener(EVENTS.MADE_MISTAKE, handler)
        return () => {
            removeListener(EVENTS.MADE_MISTAKE, handler)
            componentUnmounted = true
        }
    }, [mistakes])

    const onNewGameStarted = () =>
        gameState !== GAME_STATE.ACTIVE && setGameState(GAME_STATE.ACTIVE)

    // show game over card
    useEffect(() => {
        if (isGameOver(gameState)) setGameSolvedCard(true)
    }, [gameState])

    useEffect(() => {
        if (shouldSaveGameState(gameState, previousGameState)) {
            const localGameStateToBeCached = {
                state: gameState,
                referee: {
                    level: difficultyLevel,
                    mistakes,
                    time,
                },
                boardData: {
                    mainNumbers,
                    notesInfo,
                    movesStack: movesStack.current,
                    selectedCell,
                },
                cellActionsData: {
                    pencilState,
                    hints,
                }
            }
            setKey(PREVIOUS_GAME, localGameStateToBeCached)
            .catch(error => {
                __DEV__ && console.log(error)
            })
        }
    }, [gameState, pencilState, hints, time, mistakes, difficultyLevel, mainNumbers, notesInfo, selectedCell])

    // EVENTS.HINT_USED_SUCCESSFULLY
    useEffect(() => {
        const handler = () => setHints(hints => hints-1)
        addListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
        return () => removeListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
    }, [])

    // TODO: can this be converted to a custom hook. just for challenging myself and fun
    // timer logic
    const updateTime = () => timerId.current && setTime(time => getNewTime(time))

    const startTimer = () => timerId.current = setInterval(updateTime, 1000) // 1 sec

    const stopTimer = () => {
        if (timerId.current) timerId.current = clearInterval(timerId.current)
    }

    const onTimerClick = useCallback(() => {
        // un-clickable if the game has finished
        if (isGameOver(gameState)) return
        let gameNewState = gameState === GAME_STATE.ACTIVE ? GAME_STATE.INACTIVE : GAME_STATE.ACTIVE
        emit(EVENTS.CHANGE_GAME_STATE, gameNewState)
    }, [gameState]) 

    useEffect(() => {
        if (gameState === GAME_STATE.ACTIVE) startTimer()
        else stopTimer()
    }, [gameState])

    // board handlers
    const isPuzzleSolved = () => {
        for (let row=0;row<9;row++) {
            for (let col=0;col<9;col++) {
                if (!mainNumbers[row][col].value) return false
            }
        }
        return true
    }

    // TODO: fix the repeated lines in this func
    // TODO: add the removed notes in cells other than currentCell to the undo move
    //          right now we are just recording the current cells notes only
    const removeNotesAfterCellFilled = (row, col, num) => {
        let notesErasedByMainValue = []
        // remove notes from current cell
        for (let note=0;note<9;note++) { // taking note's indx
            const { show } = notesInfo[row][col][note]
            if (show) {
                notesErasedByMainValue.push(note+1)
                notesInfo[row][col][note].show = 0
            }
        }
        if (notesErasedByMainValue.length) notesInfo[row][col] = [...notesInfo[row][col]]

        // remove notes from current row
        for (let row=0;row<9;row++) {
            const noteIndx = num - 1
            const { show } = notesInfo[row][col][noteIndx]
            if (show) {
                notesInfo[row][col][noteIndx].show = 0
                notesInfo[row][col] = [...notesInfo[row][col]]
            }
        }
        
        // remove notes from current col
        for (let col=0;col<9;col++) {
            const noteIndx = num - 1
            const { show } = notesInfo[row][col][noteIndx]
            if (show) {
                notesInfo[row][col][noteIndx].show = 0
                notesInfo[row][col] = [...notesInfo[row][col]]
            }
        }
        
        // remove notes from current block
        const { blockNum } = getBlockAndBoxNum(row, col)
        for (let boxNum=0;boxNum<9;boxNum++) {
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
                if (duplicacyPresent(row, col, number, mainNumbers)) return
                valueType = 'notes'
                const { show } = notesInfo[row][col][number-1]
                moveType = show ? 'erase' : 'insert'
                notesInfo[row][col][number-1].show = 1 - show
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
                    notesErasedByMainValue = removeNotesAfterCellFilled(row, col, number)
                    if (isHintUsed) emit(EVENTS.HINT_USED_SUCCESSFULLY)
                    if (isPuzzleSolved()) emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.OVER_SOLVED)
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
            if (noteInserted ||  notesErasedByMainValue.length) updateNotesInfo([...notesInfo])
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
                    for(let i=0;i<notesErased.length;i++){
                        const note = notesErased[i]
                        notesInfoDup[row][col][note - 1].show = 1
                    }
                } else {
                    // main value got erased, so fill that value in the cell
                    mainNumbersDup[row][col].value = value[0]
                }
            } else {
                const notesVisibilityChanges = value
                for(let i=0;i<notesVisibilityChanges.length;i++){
                    const note = notesVisibilityChanges[i]
                    notesInfoDup[row][col][note-1].show = 1 - notesInfoDup[row][col][note-1].show
                }
            }

            const nextSelectedCell = { row, col }

            if (movesStack.current.length) {
                const len = movesStack.current.length
                const { row, col } = movesStack.current[len-1]
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
        return () => removeListener(EVENTS.ERASER_CLICKED, handler)
    }, [selectedCell, mainNumbers, notesInfo])

    // EVENTS.FAST_PENCIL_CLICKED
    useEffect(() => {
        const handler = () => {
            for (let row=0;row<9;row++) {
                for (let col=0;col<9;col++) {
                    if (!mainNumbers[row][col].value) {
                        let notesUpdated = false
                        for (let num=1;num<=9;num++) {
                            const { show } = notesInfo[row][col][num-1]
                            if (!show && !duplicacyPresent(row, col, num, mainNumbers)) {
                                notesUpdated = true
                                notesInfo[row][col][num-1].show = 1 - show
                            }
                        }
                        if (notesUpdated) notesInfo[row][col] = [...notesInfo[row][col]]
                    }
                }
            }
            updateNotesInfo([...notesInfo])
        }
        addListener(EVENTS.FAST_PENCIL_CLICKED, handler)
        return () => removeListener(EVENTS.FAST_PENCIL_CLICKED, handler)
    }, [mainNumbers, notesInfo])

    useEffect(() => {
        const handler = () => setShowCustomPuzzleHC(true)
        addListener(EVENTS.OPEN_CUSTOM_PUZZLE_INPUT_VIEW, handler)
        return () => removeListener(EVENTS.OPEN_CUSTOM_PUZZLE_INPUT_VIEW, handler)
    }, [])

    const handleCustomPuzzleClosed = useCallback(() => {
        setShowCustomPuzzleHC(false)
    }, [])

    // when hint is clicked 
    useEffect(() => {
        const handler = () => {
            const { row, col } = selectedCell
            if (!mainNumbers[row][col].value)
                emit(EVENTS.INPUT_NUMBER_CLICKED, { number: mainNumbers[row][col].solutionValue, isHintUsed: true })
        }
        addListener(EVENTS.HINT_CLICKED, handler)
        return () => removeListener(EVENTS.HINT_CLICKED, handler)
    }, [selectedCell, mainNumbers])

    const handleCellClicked = useCallback((row, col) => {
        selectedCellMainValue.current = mainNumbers[row][col].value
        selectCell(selectedCell => {
            if (selectedCell.row !== row || selectedCell.col !== col) return { row, col }
            return selectedCell
        })
    }, [mainNumbers])

    const onParentLayout = useCallback(({ nativeEvent: { layout: { height = 0 } = {} } = {} }) => { 
        setPageHeight(height)
    }, [])

    const handleGameInFocus = useCallback(() => {
        // if the menu is opened let's keep it that way only
        if (gameState !== GAME_STATE.INACTIVE || (showCustomPuzzleHC)) return
        emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.ACTIVE)
    }, [gameState, showCustomPuzzleHC])

    const handleGameOutOfFocus = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.INACTIVE)
    }, [gameState])

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setGameSolvedCard(false)
        })
    }

    useEffect(() => {
        if (showGameSolvedCard) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start()
        }
    }, [showGameSolvedCard])

    const hideCongratsModal = useCallback(() => {
        fadeOut()
    }, [])

    return (
        <Page
            onFocus={handleGameInFocus}
            onBlur={handleGameOutOfFocus}
            navigation={navigation}
        >
            <View
                style={styles.container} 
                onLayout={onParentLayout}
            >
                <Text style={styles.refereeTextStyles}>{timeTaken}</Text>
                <View style={styles.refereeContainer}>
                    <Text style={styles.refereeTextStyles}>{`Mistakes: ${mistakes} / ${MISTAKES_LIMIT}`}</Text>
                    <Text style={styles.refereeTextStyles}>{difficultyLevel}</Text>
                    <Timer gameState={gameState} time={time} onClick={onTimerClick} />
                </View>
                <Board
                    gameState={gameState}
                    mainNumbers={mainNumbers}
                    notesInfo={notesInfo}
                    selectedCell={selectedCell}
                    selectedCellMainValue={selectedCellMainValue.current}
                    onCellClick={handleCellClicked}
                />
                <View style={styles.cellActionsContainer}>
                    <Undo iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} gameState={gameState} />
                    {/* <Eraser iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} gameState={gameState} /> */}
                    <Pencil iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} gameState={gameState} pencilState={pencilState} />
                    <FastPencil iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} gameState={gameState} />
                    <Hint iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} gameState={gameState} hints={hints} />
                </View>
                <View style={styles.inputPanelContainer}>
                    <Inputpanel gameState={gameState} />
                </View>
                {
                    pageHeight && showCustomPuzzleHC ?
                        <CustomPuzzle
                            parentHeight={pageHeight}
                            onCustomPuzzleClosed={handleCustomPuzzleClosed}
                            onPuzzleValiditySuccessful={onCustomPuzzleValiditySuccessful}
                        />
                    : null
                }
                {
                    showGameSolvedCard ?
                        <Touchable
                            touchable={TouchableTypes.opacity}
                            activeOpacity={1}
                            style={styles.gameOverCardAbsoluteBG}
                            onPress={hideCongratsModal}
                        >
                            <Animated.View
                                style={[styles.gameOverAnimatedBG, { opacity: fadeAnim }]}
                            >
                                <GameOverCard
                                    gameState={gameState}
                                    stats={{mistakes, difficultyLevel, time, hintsUsed: MAX_AVAILABLE_HINTS - hints}}
                                    openNextGameMenu={hideCongratsModal}
                                />
                            </Animated.View>
                        </Touchable>
                    : null
                }
            </View>
        </Page>
    )
}

export const Arena = React.memo(Arena_)
