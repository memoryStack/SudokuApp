import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Animated, Text, StyleSheet, Dimensions } from 'react-native'
import { Board } from './gameBoard'
import { Inputpanel } from './inputPanel'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { emit, addListener, removeListener } from '../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE, LEVEL_DIFFICULTIES, LEVELS_CLUES_INFO, PREVIOUS_GAME } from '../../resources/constants'
import { Page } from '../components/Page'
import { NextGameMenu } from './nextGameMenu'
import { GameOverCard } from './gameOverCard'
import { getKey, setKey } from '../../utils/storage'
import { usePrevious } from '../../utils/customHooks'
import { Undo } from './cellActions/undo'
import { Pencil } from './cellActions/pencil'
import { FastPencil } from './cellActions/fastPencil'
import { Hint } from './cellActions/hint'
import { Timer } from './timer'
import { isGameOver } from './utils/util'
import { NewGameButton } from './newGameButton'
import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'
import { CustomPuzzle } from './customPuzzle'
import { useCellActions, MAX_AVAILABLE_HINTS } from './hooks/cellActions';
import { useReferee } from './hooks/referee';
import { useGameBoard } from './hooks/gameBoard';

const { width: windowWidth } = Dimensions.get('window')
export const CELL_ACTION_ICON_BOX_DIMENSION = (windowWidth / 100) * 5
const CUSTOMIZED_PUZZLE_LEVEL_TITLE = 'Customized Puzzle'
let timeTaken = 0
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
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

const Arena_ = () => {

    const [gameState, setGameState] = useState(GAME_STATE.INACTIVE)
    const [pageHeight, setPageHeight] = useState(0)
    const [showGameSolvedCard, setGameSolvedCard] = useState(false)
    const previousGameState = usePrevious(gameState)

    const {
        pencilState,
        hints,
        onPencilClick,
        onHintClick,
        onFastPencilClick,
        onUndoClick,
    } = useCellActions(gameState)
    
    const {
        mainNumbers,
        notesInfo,
        selectedCell,
        selectedCellMainValue,
        onCellClick,
    } = useGameBoard(gameState, pencilState)

    const {
        MISTAKES_LIMIT,
        mistakes,
        time,
        difficultyLevel,
        onTimerClick,
    } = useReferee(gameState)

    const [showNextGameMenu, setShowNextGameMenu] = useState(false)
    const [showCustomPuzzleHC, setShowCustomPuzzleHC] = useState(false)

    // for game over halfcard animation
    const fadeAnim = useRef(new Animated.Value(0)).current

    // resume previous game or start new game of previously solved level
    useEffect(async () => {
        const previousGame = await getKey(PREVIOUS_GAME)
        if (previousGame) {
            const { state } = previousGame
            if (state !== GAME_STATE.INACTIVE) {
                // emit(EVENTS.START_NEW_GAME, { difficultyLevel: referee.level })
            } else {
                // setBoardData(boardData)
                setGameState(GAME_STATE.ACTIVE)
            }
        } else {
            emit(EVENTS.START_NEW_GAME, { difficultyLevel: LEVEL_DIFFICULTIES.EASY })
        }
    }, [])
    
    const resetCellActions = () => {
    }

    const setBoardData = ({ mainNumbers, notesInfo, selectedCell, movesStack: moves }) => {
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

    useEffect(() => {
        const handler = ({ mainNumbers }) => {
            // drag the customPuzzle HC and we can simply unmount the
            // next game menu from view hirerechy
            setShowNextGameMenu(false)
            const boardData = initBoardData()
            boardData.mainNumbers = mainNumbers
            setBoardData(boardData)
            resetCellActions()
            onNewGameStarted()
        }
        addListener(EVENTS.START_CUSTOM_PUZZLE_GAME, handler)
        return () => {
            removeListener(EVENTS.START_CUSTOM_PUZZLE_GAME, handler)
        }
    }, [])

    // listen for changing game state. and it should be only one listener through out the Arena screen
    useEffect(() => {
        const handler = newState => newState && setGameState(newState)
        addListener(EVENTS.CHANGE_GAME_STATE, handler)
        return () => removeListener(EVENTS.CHANGE_GAME_STATE, handler)
    }, [])

    const onNewGameStarted = () =>
        gameState !== GAME_STATE.ACTIVE && setGameState(GAME_STATE.ACTIVE)

    // show game over card
    useEffect(() => {
        if (isGameOver(gameState)) setGameSolvedCard(true)
    }, [gameState])

    useEffect(() => {
    }, [gameState, pencilState, hints, time, mistakes, difficultyLevel, mainNumbers, notesInfo, selectedCell])

    useEffect(() => {
        const handler = () => setShowCustomPuzzleHC(true)
        addListener(EVENTS.OPEN_CUSTOM_PUZZLE_INPUT_VIEW, handler)
        return () => removeListener(EVENTS.OPEN_CUSTOM_PUZZLE_INPUT_VIEW, handler)
    }, [])

    const handleCustomPuzzleClosed = useCallback(() => {
        setShowCustomPuzzleHC(false)
    }, [])

    const onParentLayout = useCallback(({ nativeEvent: { layout: { height = 0 } = {} } = {} }) => { 
        setPageHeight(height)
    }, [])

    const handleGameInFocus = useCallback(() => {
        // if the menu is opened let's keep it that way only
        if (gameState !== GAME_STATE.INACTIVE || (showCustomPuzzleHC || showNextGameMenu)) return
        emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.ACTIVE)
    }, [gameState, showCustomPuzzleHC, showGameSolvedCard])

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
            setTimeout(() => setShowNextGameMenu(true), 100) // just so that sb kuch fast fast sa na ho
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

    const newGameButtonClick = useCallback(() => {
        setShowNextGameMenu(true)
        // when game is solved or over, i don't want the game state to be changed
        // user should start the next game
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.INACTIVE)
    }, [gameState])

    const onNewGameMenuClosed = useCallback((optionSelectedFromMenu = false) => {
        setShowNextGameMenu(false)
        // when game is solved or over, i don't want the game state to be changed
        // user should start the next game
        if (gameState !== GAME_STATE.INACTIVE) return
        !optionSelectedFromMenu && emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.ACTIVE)
    }, [gameState])

    return (
        <Page
            onFocus={handleGameInFocus}
            onBlur={handleGameOutOfFocus}
        >
            <View
                style={styles.container} 
                onLayout={onParentLayout}
            >
                <NewGameButton
                    onClick={newGameButtonClick}
                    containerStyle={styles.newGameButtonContainer}
                />
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
                    selectedCellMainValue={selectedCellMainValue}
                    onCellClick={onCellClick}
                />
                <View style={styles.cellActionsContainer}>
                    <Undo
                        iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION}
                        onClick={onUndoClick}
                    />
                    <Pencil
                        iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION}
                        pencilState={pencilState}
                        onClick={onPencilClick}
                    />
                    <FastPencil
                        iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION}
                        onClick={onFastPencilClick}
                    />
                    <Hint
                        iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION}
                        gameState={gameState}
                        hints={hints}
                        onClick={onHintClick}
                    />
                </View>
                <View style={styles.inputPanelContainer}>
                    <Inputpanel gameState={gameState} />
                </View>
                {
                    pageHeight && showNextGameMenu ?
                        <NextGameMenu
                            parentHeight={pageHeight}
                            onMenuClosed={onNewGameMenuClosed}
                        /> 
                    : null
                }
                {
                    pageHeight && showCustomPuzzleHC ?
                        <CustomPuzzle
                            parentHeight={pageHeight}
                            onCustomPuzzleClosed={handleCustomPuzzleClosed}
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
