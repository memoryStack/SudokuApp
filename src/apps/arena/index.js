import React, { useState, useCallback, useEffect, useRef, useReducer } from 'react'
import { View, Animated, Text, StyleSheet, Dimensions } from 'react-native'
import { Board } from './gameBoard'
import { Inputpanel } from './inputPanel'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { emit, addListener, removeListener } from '../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE } from '../../resources/constants'
import { Page } from '../components/Page'
import { NextGameMenu } from './nextGameMenu'
import { GameOverCard } from './gameOverCard'
import { Undo } from './cellActions/undo'
import { Pencil } from './cellActions/pencil'
import { FastPencil } from './cellActions/fastPencil'
import { Hint } from './cellActions/hint'
import { Timer } from './timer'
import { isGameOver } from './utils/util'
import { Button } from '../../components/button'
import { CustomPuzzle } from './customPuzzle'
import { useCellActions, MAX_AVAILABLE_HINTS } from './hooks/cellActions'
import { useReferee } from './hooks/referee'
import { useGameBoard } from './hooks/gameBoard'
import { useManageGame } from './hooks/gameHandler'
import SmartHintHC from './smartHintHC'
import Share from 'react-native-share'
import { NEW_GAME, SHARE, SOMETHING_WENT_WRONG } from '../../resources/stringLiterals'
import { noOperationFunction } from '../../utils/util'

const { width: windowWidth } = Dimensions.get('window')
export const CELL_ACTION_ICON_BOX_DIMENSION = (windowWidth / 100) * 5
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
    sudokuBoardContainer: {
        zIndex: 1,
    },
    headerButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
})

const Arena_ = () => {
    const [pageHeight, setPageHeight] = useState(0)
    const [showGameSolvedCard, setGameSolvedCard] = useState(false)
    const { gameState, showNextGameMenu, setShowNextGameMenu } = useManageGame()

    const { pencilState, hints, onPencilClick, onHintClick, onFastPencilClick, onUndoClick } = useCellActions(gameState)

    const {
        mainNumbers,
        notesInfo,
        selectedCell,
        selectedCellMainValue,
        onCellClick,
        smartHintInfo: {
            show: showSmartHint,
            info: {
                cellsToFocusData = {},
                techniqueInfo: { title: smartHintTitle = '', logic: smartHintLogic = '' } = {},
            } = {},
        } = {},
    } = useGameBoard(gameState, pencilState, hints)

    const { MISTAKES_LIMIT, mistakes, time, difficultyLevel, onTimerClick } = useReferee(gameState, showSmartHint)

    const [showCustomPuzzleHC, setShowCustomPuzzleHC] = useState(false)

    // for game over halfcard animation
    const fadeAnim = useRef(new Animated.Value(0)).current

    // show game over card
    useEffect(() => {
        if (isGameOver(gameState)) setGameSolvedCard(true)
    }, [gameState])

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
        if (gameState !== GAME_STATE.INACTIVE || showCustomPuzzleHC || showNextGameMenu) return
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

    const onNewGameMenuClosed = useCallback(
        (optionSelectedFromMenu = false) => {
            setShowNextGameMenu(false)
            // when game is solved or over, i don't want the game state to be changed
            // user should start the next game
            if (gameState !== GAME_STATE.INACTIVE) return
            !optionSelectedFromMenu && emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.ACTIVE)
        },
        [gameState],
    )

    const onSmartHintHCClosed = useCallback(() => {
        emit(EVENTS.SMART_HINTS_HC_CLOSED)
    }, [])

    const handleSharePuzzleClick = useCallback(() => {
        let puzzleString = ''

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                puzzleString = `${puzzleString}${mainNumbers[row][col].value}`
            }
        }

        const options = {
            message: 'Solve This Sudoku Challenge',
            url: `https://www.amazing-sudoku.com/puzzle/${puzzleString}`,
        }
        Share.open(options)
            .then(noOperationFunction, noOperationFunction)
            .catch(error => {
                __DEV__ && console.log(error)
                emit(EVENTS.SHOW_SNACK_BAR, { msg: SOMETHING_WENT_WRONG })
            })
    }, [mainNumbers])

    return (
        <Page onFocus={handleGameInFocus} onBlur={handleGameOutOfFocus}>
            <View style={styles.container} onLayout={onParentLayout}>
                <View style={styles.headerButtonsContainer}>
                    <Button
                        onClick={newGameButtonClick}
                        containerStyle={styles.newGameButtonContainer}
                        text={NEW_GAME}
                    />
                    <Button
                        onClick={handleSharePuzzleClick}
                        containerStyle={styles.newGameButtonContainer}
                        text={SHARE}
                    />
                </View>
                <View style={styles.refereeContainer}>
                    <Text style={styles.refereeTextStyles}>{`Mistakes: ${mistakes} / ${MISTAKES_LIMIT}`}</Text>
                    <Text style={styles.refereeTextStyles}>{difficultyLevel}</Text>
                    <Timer gameState={gameState} time={time} onClick={onTimerClick} />
                </View>
                <View style={showSmartHint ? styles.sudokuBoardContainer : null}>
                    <Board
                        gameState={gameState}
                        mainNumbers={mainNumbers}
                        notesInfo={notesInfo}
                        selectedCell={selectedCell}
                        selectedCellMainValue={selectedCellMainValue}
                        onCellClick={onCellClick}
                        showSmartHint={showSmartHint}
                        smartHintCellsHighlightInfo={cellsToFocusData}
                    />
                </View>
                <View style={styles.cellActionsContainer}>
                    <Undo iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} onClick={onUndoClick} />
                    <Pencil
                        iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION}
                        pencilState={pencilState}
                        onClick={onPencilClick}
                    />
                    <FastPencil iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} onClick={onFastPencilClick} />
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
                {pageHeight && showNextGameMenu ? (
                    <NextGameMenu parentHeight={pageHeight} onMenuClosed={onNewGameMenuClosed} />
                ) : null}
                {pageHeight && showCustomPuzzleHC ? (
                    <CustomPuzzle parentHeight={pageHeight} onCustomPuzzleClosed={handleCustomPuzzleClosed} />
                ) : null}
                {showGameSolvedCard ? (
                    <Touchable
                        touchable={TouchableTypes.opacity}
                        activeOpacity={1}
                        style={styles.gameOverCardAbsoluteBG}
                        onPress={hideCongratsModal}
                    >
                        <Animated.View style={[styles.gameOverAnimatedBG, { opacity: fadeAnim }]}>
                            <GameOverCard
                                gameState={gameState}
                                stats={{ mistakes, difficultyLevel, time, hintsUsed: MAX_AVAILABLE_HINTS - hints }}
                                openNextGameMenu={hideCongratsModal}
                            />
                        </Animated.View>
                    </Touchable>
                ) : null}
                {showSmartHint ? (
                    <SmartHintHC
                        parentHeight={pageHeight}
                        title={smartHintTitle}
                        logic={smartHintLogic}
                        onSmartHintHCClosed={onSmartHintHCClosed}
                    />
                ) : null}
            </View>
        </Page>
    )
}

export const Arena = React.memo(Arena_)
