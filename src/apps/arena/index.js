import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Animated, Text, StyleSheet, Dimensions } from 'react-native'
import { Board } from './gameBoard'
import { Inputpanel } from './inputPanel'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { emit, addListener, removeListener } from '../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE, LEVEL_DIFFICULTIES, LEVELS_CLUES_INFO, PREVIOUS_GAME, PENCIL_STATE } from '../../resources/constants'
import { Page } from '../components/Page'
import { NextGameMenu } from './nextGameMenu'
import { initBoardData as initMainNumbers, generateNewSudokuPuzzle } from '../../utils/util'
import { CongratsCard } from './puzzleSolvedCongratsCard'
import { getNewPencilState } from './cellActions/pencil'
import { getKey, setKey } from '../../utils/storage'
import { usePrevious } from '../../utils/customHooks'
import { Undo } from './cellActions/undo'
import { Eraser } from './cellActions/eraser'
import { Pencil } from './cellActions/pencil'
import { Hint } from './cellActions/hint'
import { Timer } from './timer'
import { isGameOver } from './utils/util'

const MAX_AVAILABLE_HINTS = 3
const MISTAKES_LIMIT = 3
const { width: windowWidth } = Dimensions.get('window')
const CELL_ACTION_ICON_BOX_DIMENSION = (windowWidth / 100) * 5

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
        paddingTop: 60,
    },
    cellActionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
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
    congratsBackground: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, .8)',
    },
})

// TODO: ise bhi khtm kr duga
// it's not a good architecture to pull the data like this
const gameStateToBeCached = {
    state: undefined,
    mistakes: undefined, // mistakes count
    time: undefined, // timer data
    boardData: undefined,
}

const allKeysSet = (object = {}) => 
    Object.keys(object).every(key => object[key] !== undefined)

const resetObjectKeys = (object = {}) =>
    Object.keys(object).forEach(key => object[key] = undefined)

const initBoardData = () => {
    const movesStack = []
    const mainNumbers = initMainNumbers()
    const notesInfo = new Array(9)
    for(let i = 0;i < 9;i++) {
        const rowNotes = []
        for(let j = 0;j < 9;j++) {
            const boxNotes = new Array(9)
            for(let k = 1;k <= 9;k++)
                boxNotes[k-1] = { noteValue: k, show: 0 } // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0] represenstionn. but let's ignore it for not
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

const Arena_ = () => {

    const [gameState, setGameState] = useState(GAME_STATE.INACTIVE)
    const [pageHeight, setPageHeight] = useState(0)
    const [showGameSolvedCard, setGameSolvedCard] = useState(false)
    const previousGameState = usePrevious(gameState)

    const { referee: initialRefereeData, cellActionsData: initialCellActionsData, boardData: initialBoardData } = useRef(initComponentsDefaultState()).current
    const [boardData, setBoardData] = useState(initialBoardData)
    const [hints, setHints] = useState(initialCellActionsData.hints)
    const [mistakes, setMistakes] = useState(initialRefereeData.mistakes)
    const [difficultyLevel, setDifficultyLevel] = useState(initialRefereeData.difficultyLevel)
    const [time, setTime] = useState(initialRefereeData.time)
    const [pencilState, setPencilState] = useState(initialCellActionsData.pencilState)
    const timerId = useRef(null)

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

    // resume previous game or start new game of previously solved level
    useEffect(async () => {
        const previousGame = await getKey(PREVIOUS_GAME)
        if (previousGame) {
            const { state, referee, boardData, cellActionsData } = previousGame
            console.log('@@@@@@ got game from cache', previousGame)
            if (state !== GAME_STATE.INACTIVE) {
                emit(EVENTS.START_NEW_GAME, { difficultyLevel: referee.level })
            } else {
                setRefereeData(referee)

                const { hints, pencilState } = cellActionsData
                setPencilState(pencilState)
                setHints(hints)

                setBoardData(boardData)
                setGameState(GAME_STATE.ACTIVE)
            }
        } else {
            emit(EVENTS.START_NEW_GAME, { difficultyLevel: initialRefereeData.level })
        }
    }, [])
    
    const resetCellActions = () => {
        const { pencilState, hints } = initCellActionsData()
        setPencilState(pencilState)
        setHints(hints)
    }

    const setRefereeData = ({ mistakes, level, time }) => {
        setTime(time)
        setDifficultyLevel(level)
        setMistakes(mistakes)
    }

    useEffect(() => {
        let componentUnmounted = false
        const handler = async ({ difficultyLevel }) => {
            const time = Date.now()
            if (!difficultyLevel) return
            // "minClues" becoz sometimes for the expert type of levels we get more than desired clues
            const minClues = LEVELS_CLUES_INFO[difficultyLevel]
            const boardData = initBoardData()
            await generateNewSudokuPuzzle(minClues, boardData.notesInfo, boardData.mainNumbers)

            console.log('@@@@@@@@ new puzzle', JSON.stringify(boardData.mainNumbers))
            console.log('@@@@@@@@ time taken is', Date.now() - time)

            if (!componentUnmounted) {
                setRefereeData(initRefereeData(difficultyLevel))

                setBoardData(boardData)
                resetCellActions()
            }
            onNewGameStarted()
        }
        addListener(EVENTS.START_NEW_GAME, handler)
        return () => {
            removeListener(EVENTS.START_NEW_GAME, handler)
            componentUnmounted = true
        }
    }, [])
    
    // EVENTS.RESTART_GAME
    useEffect(() => {
        let componentUnmounted = false
        const handler = () => {
            const mainNumbersClone = [...boardData.mainNumbers]
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
    }, [difficultyLevel, boardData])

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

    // TODO: find out what will happen if i am navigating back from "Arena" screen to some other screen
    //      is that case getting hhandled ??
    // DDD: new finding
    //      the callback to useEffect "() =>" i wrote it like "async () =>" mistakenly and because of this 
    //      the addListener works but not removeListener. lol
    // NEXT BIG TODO:
    useEffect(() => {
        const handler = ({type, data}) => {
            if (!type) return
            gameStateToBeCached[type] = data
            if (allKeysSet(gameStateToBeCached)) {
                const { state, mistakes, time, boardData } = gameStateToBeCached
                setKey(PREVIOUS_GAME, {
                    state,
                    referee: {
                        level: refereeData.level,
                        mistakes,
                        time,
                    },
                    boardData,
                    cellActionsData: {
                        pencilState: pencilState,
                        hints,
                    }
                }).then(() => {
                    resetObjectKeys(gameStateToBeCached)
                }).catch(error => __DEV__ && console.log(error))
            }
        }
        addListener(EVENTS.SAVE_GAME_STATE, handler)
        return () => {
            removeListener(EVENTS.SAVE_GAME_STATE, handler)
        }
    }, [pencilState, hints])

    // EVENTS.HINT_USED_SUCCESSFULLY
    useEffect(() => {
        const handler = () => setHints(hints => hints-1)
        addListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
        return () => {
            removeListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
        }
    }, [])

    // lol. had to pass gameState like this. couldn't make dependency array above like
    // [gameState, refereeData, cellActionsData]
    // TODO: i really need to learn some architectures man. this should be my next step in my learning
    useEffect(() => {
        if (gameState !== GAME_STATE.ACTIVE && previousGameState === GAME_STATE.ACTIVE) 
            emit(EVENTS.SAVE_GAME_STATE, { type: 'state', data: gameState })
    }, [gameState])

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

    const onParentLayout = useCallback(({ nativeEvent: { layout: { height = 0 } = {} } = {} }) => { 
        setPageHeight(height)
    }, [])

    const handleGameInFocus = useCallback(() => {
        emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.ACTIVE)
    }, [])

    const handleGameOutOfFocus = useCallback(() => {
        emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.INACTIVE)
    }, [])

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setGameSolvedCard(false)
            setTimeout(() => {
                emit(EVENTS.OPEN_NEXT_GAME_MENU)
            }, 100) // just so that sb kuch fast fast sa na ho
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
        >
            <View
                style={styles.container} 
                onLayout={onParentLayout}
            >
                <View style={styles.refereeContainer}>
                    <Text style={styles.refereeTextStyles}>{`Mistakes: ${mistakes} / ${MISTAKES_LIMIT}`}</Text>
                    <Text style={styles.refereeTextStyles}>{difficultyLevel}</Text>
                    <Timer gameState={gameState} time={time} onClick={onTimerClick} />
                </View>
                <Board 
                    boardData={boardData}
                    gameState={gameState}
                    pencilState={pencilState}
                />
                <View style={{ marginVertical: 20 }}>
                    <Inputpanel gameState={gameState} />
                </View>
                <View style={styles.cellActionsContainer}>
                    <Undo iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} gameState={gameState} />
                    <Eraser iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} gameState={gameState} />
                    <Pencil iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} gameState={gameState} pencilState={pencilState} />
                    <Hint iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} gameState={gameState} hints={hints} />
                </View>
                {
                    pageHeight ? 
                        <NextGameMenu 
                            parentHeight={pageHeight}
                            gameState={gameState}
                        /> 
                    : null
                }
                {
                    showGameSolvedCard ?
                        <Touchable
                            touchable={TouchableTypes.opacity}
                            activeOpacity={1}
                            style={{ top: 0, bottom: 0, left: 0, right: 0, position: 'absolute' }}
                            onPress={hideCongratsModal}
                        >
                            <Animated.View
                                style={[styles.congratsBackground, { opacity: fadeAnim }]}
                            >
                                <CongratsCard
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