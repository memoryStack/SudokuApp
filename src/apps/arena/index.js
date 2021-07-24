import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Modal, AppState } from 'react-native'
import { Board } from './gameBoard'
import { GameReferee } from './gameReferee'
import { GAME_BOARD_WIDTH } from './gameBoard/dimensions' // make it a global constant lateron
import { Inputpanel } from './inputPanel'
import { CellActions } from './cellActions'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { emit, addListener, removeListener } from '../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE, LEVEL_DIFFICULTIES, LEVELS_CLUES_INFO, PREVIOUS_GAME, PREVIOUS_GAME_STATUS, PENCIL_STATE } from '../../resources/constants'
import { Page } from '../components/Page'
import { NextGameMenu } from './nextGameMenu'
import { noOperationFunction, initBoardData as initMainNumbers, generateNewSudokuPuzzle } from '../../utils/util'
import { CongratsCard } from './puzzleSolvedCongratsCard'
import { getNewPencilState } from './cellActions/pencil'
import { getKey, setKey } from '../../utils/storage'
import { usePrevious } from '../../utils/customHooks'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
        paddingTop: 16,
    },
})

const solvedGameStats = {
    time: undefined,
    difficultyLevel: undefined,
    mistakes: undefined,
    hintsUsed: undefined,
}

const gameStateToBeCached = {
    state: undefined,
    mistakes: undefined, // mistakes count
    time: undefined, // timer data
    boardData: undefined,
    hints: undefined,
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
                boxNotes[k-1] = {"noteValue": k, "show": 0} // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0] represenstionn. but let's ignore it for not
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
        hints: 3,
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

const Arena_ = () => {

    const [gameState, setGameState] = useState(GAME_STATE.INACTIVE)
    const [pageHeight, setPageHeight] = useState(0)
    const [showGameSolvedCard, setGameSolvedCard] = useState(false)
    const previousGameState = usePrevious(gameState)

    const { referee: initialRefereeData, cellActionsData: initialCellActionsData, boardData: initialBoardData } = useRef(initComponentsDefaultState()).current
    const [refereeData, setRefereeData] = useState(initialRefereeData)
    const [boardData, setBoardData] = useState(initialBoardData)
    const [cellActionsData, setCellActionsData] = useState(initialCellActionsData)

    useEffect(() => {
        const handler = () => setCellActionsData(cellActionsData => ({...cellActionsData, pencilState: getNewPencilState(cellActionsData.pencilState)}))
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
                setBoardData(boardData)
                setCellActionsData(cellActionsData)
                setGameState(GAME_STATE.ACTIVE)
            }
        } else {
            emit(EVENTS.START_NEW_GAME, { difficultyLevel: refereeData.level })
        }
    }, [])
    
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
                setCellActionsData(initCellActionsData())
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
                setRefereeData(initRefereeData(refereeData.level))
                setBoardData({...initBoardData(), mainNumbers: mainNumbersClone})
                setCellActionsData(initCellActionsData())
            }
            onNewGameStarted()
        }
        addListener(EVENTS.RESTART_GAME, handler)
        return () => {
            removeListener(EVENTS.RESTART_GAME, handler)
            componentUnmounted = true
        }
    }, [refereeData, boardData])

    // listen for changing game state. and it should be only one listener through out the Arena screen
    useEffect(() => {
        const handler = newState =>
            newState && setGameState(newState)
        addListener(EVENTS.CHANGE_GAME_STATE, handler)
        return () => removeListener(EVENTS.CHANGE_GAME_STATE, handler)
    }, [])

    const onNewGameStarted = () =>
        gameState !== GAME_STATE.ACTIVE && setGameState(GAME_STATE.ACTIVE)

    useEffect(() => {
        const handler = ({type: statType, data}) => {
            if (!statType) return
            solvedGameStats[statType] = data
            if (allKeysSet(solvedGameStats)) {
                setGameSolvedCard(true)
                // TODO: save all the stats to storage
            }
        }
        addListener(EVENTS.SOLVED_PUZZLE_STAT, handler)
        return () => removeListener(EVENTS.SOLVED_PUZZLE_STAT, handler)
    }, [])

    // TODO: find out what will happen if i am navigating back from "Arena" screen to some other screen
    //      is that case getting hhandled ??
    // DDD: new finding
    //      the callback to useEffect "() =>" i wrote it like "async () =>" mistakenly and because of this 
    //      the addListener works but not removeListener. lol
    useEffect(() => {
        const handler = ({type, data}) => {
            if (!type) return
            gameStateToBeCached[type] = data
            if (allKeysSet(gameStateToBeCached)) {
                const { state, mistakes, time, boardData, hints } = gameStateToBeCached
                setKey(PREVIOUS_GAME, {
                    state,
                    referee: {
                        level: refereeData.level,
                        mistakes,
                        time,
                    },
                    boardData,
                    cellActionsData: {
                        pencilState: cellActionsData.pencilState,
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
    }, [refereeData, cellActionsData])

    // lol. had to pass gameState like this. couldn't make dependency array above like
    // [gameState, refereeData, cellActionsData]
    // TODO: i really need to learn some architectures man. this should be my next step in my learning
    useEffect(() => {
        if (gameState !== GAME_STATE.ACTIVE && previousGameState === GAME_STATE.ACTIVE) 
            emit(EVENTS.SAVE_GAME_STATE, { type: 'state', data: gameState })
    }, [gameState])

    const hideCongratsModal = useCallback(() => {
        setGameSolvedCard(false)
        resetObjectKeys(solvedGameStats)
        setTimeout(() => {
            emit(EVENTS.OPEN_NEXT_GAME_MENU)
        }, 300) // just so that sb kuch fast fast sa na ho
    }, [])

    const onParentLayout = useCallback(({ nativeEvent: { layout: { height = 0 } = {} } = {} }) => { 
        setPageHeight(height)
    }, [])

    const handleGameInFocus = useCallback(() => {
        emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.ACTIVE)
    }, [])

    const handleGameOutOfFocus = useCallback(() => {
        emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.INACTIVE)
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
                <GameReferee gameState={gameState} refereeData={refereeData} />
                <Board 
                    boardData={boardData}
                    gameState={gameState}
                    pencilState={cellActionsData.pencilState} 
                />
                <View style={{ marginVertical: 20 }}>
                    <Inputpanel gameState={gameState} />
                </View>
                <CellActions gameState={gameState} cellActionsData={cellActionsData} />
                {
                    pageHeight ? 
                        <NextGameMenu 
                            parentHeight={pageHeight}
                            gameState={gameState}
                        /> 
                    : null
                }
                <Modal
                    animationType={'fade'}
                    visible={showGameSolvedCard}
                    transparent={true}
                    onRequestClose={hideCongratsModal}
                >
                    <Touchable
                        touchable={TouchableTypes.opacity}
                        activeOpacity={1}
                        style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, .8)' }}
                        onPress={hideCongratsModal}
                    >
                        <CongratsCard stats={solvedGameStats} openNextGameMenu={hideCongratsModal} />
                    </Touchable>
                </Modal>
            </View>
        </Page>
    )
}

export const Arena = React.memo(Arena_)