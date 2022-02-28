import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { View, Animated, Text, StyleSheet, Dimensions } from 'react-native'
import { Board } from './gameBoard'
import { Inputpanel } from './inputPanel'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { addListener, emit, removeListener } from '../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE, DEEPLINK_HOST_NAME } from '../../resources/constants'
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
import { SHARE, SOMETHING_WENT_WRONG } from '../../resources/stringLiterals'
import { noOperationFunction, rgba } from '../../utils/util'
import { fonts } from '../../resources/fonts/font'
import { ShareIcon } from '../../resources/svgIcons/share'
import { LeftArrow } from '../../resources/svgIcons/leftArrow'
import { useToggle } from '../../utils/customHooks'
import { HintsMenu } from './hintsMenu'

const { width: windowWidth } = Dimensions.get('window')
export const CELL_ACTION_ICON_BOX_DIMENSION = (windowWidth / 100) * 5
const HEADER_ICONS_TOUCHABLE_HIT_SLOP = { top: 16, right: 16, bottom: 16, left: 16 }
const HEADER_ICON_FILL = 'rgba(0, 0, 0, .8)'
const HEADER_ICON_DIMENSION = 32
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
        fontFamily: fonts.regular,
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
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 40,
    },
})

const Arena_ = ({ navigation, route }) => {
    const [pageHeight, setPageHeight] = useState(0)
    const [showGameSolvedCard, setGameSolvedCard] = useState(false)
    const { gameState, showNextGameMenu, setShowNextGameMenu, showCustomPuzzleHC, closeCustomPuzzleHC } =
        useManageGame(route)

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
                selectCellOnClose,
            } = {},
            nextHintClick,
            prevHintClick,
            currentHintNum,
            totalHintsCount,
        } = {},
    } = useGameBoard(gameState, pencilState, hints)

    // TODO: i couldn't use this logic to update the cell after hint HC is closed
    // it's because i am using useEffect in usePrevious hook and it results in infinite
    // re-rendering. dig up the reason why this is happening. (URGENT)
    // have to change this usePrevious
    // const smartHintWasVisible = usePrevious(showSmartHint, true)
    // const smartHintFocusedCell = usePrevious(selectCellOnClose)
    // if (smartHintWasVisible && !showSmartHint) {
    //     // select the cell on which smart hint HC was closed
    //     consoleLog('@@@@@@ selectcellonclose', smartHintFocusedCell)
    //     // onCellClick(smartHintFocusedCell)
    // }

    const { MISTAKES_LIMIT, mistakes, time, difficultyLevel, onTimerClick } = useReferee(gameState, showSmartHint)

    // for game over halfcard animation
    const fadeAnim = useRef(new Animated.Value(0)).current

    // show game over card
    useEffect(() => {
        if (isGameOver(gameState)) setGameSolvedCard(true)
    }, [gameState])

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
        emit(EVENTS.SMART_HINTS_HC_CLOSED, selectCellOnClose)
    }, [selectCellOnClose])

    const handleSharePuzzleClick = useCallback(() => {
        let puzzleString = ''

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const num = mainNumbers[row][col].isClue ? mainNumbers[row][col].value : 0
                puzzleString = `${puzzleString}${num}`
            }
        }

        const options = {
            message: 'Solve This Sudoku Challenge',
            url: `${DEEPLINK_HOST_NAME}${puzzleString}`,
        }
        Share.open(options)
            .then(noOperationFunction, noOperationFunction)
            .catch(error => {
                __DEV__ && console.log(error)
                emit(EVENTS.SHOW_SNACK_BAR, { msg: SOMETHING_WENT_WRONG })
            })
    }, [mainNumbers])

    const handleBackPress = useCallback(() => {
        navigation.goBack()
    }, [navigation])

    const header = useMemo(() => {
        return (
            <View style={styles.headerButtonsContainer}>
                <Touchable
                    touchable={TouchableTypes.opacity}
                    onPress={handleBackPress}
                    hitSlop={HEADER_ICONS_TOUCHABLE_HIT_SLOP}
                >
                    <LeftArrow width={HEADER_ICON_DIMENSION} height={HEADER_ICON_DIMENSION} fill={HEADER_ICON_FILL} />
                </Touchable>
                <Touchable
                    touchable={TouchableTypes.opacity}
                    onPress={handleSharePuzzleClick}
                    hitSlop={HEADER_ICONS_TOUCHABLE_HIT_SLOP}
                >
                    <ShareIcon width={HEADER_ICON_DIMENSION} height={HEADER_ICON_DIMENSION} fill={HEADER_ICON_FILL} />
                </Touchable>
            </View>
        )
    }, [handleBackPress, handleSharePuzzleClick])

    const renderRefreeView = () => {
        return (
            <View style={styles.refereeContainer}>
                <Text style={styles.refereeTextStyles}>{`Mistakes: ${mistakes} / ${MISTAKES_LIMIT}`}</Text>
                <Text style={styles.refereeTextStyles}>{difficultyLevel}</Text>
                <Timer gameState={gameState} time={time} onClick={onTimerClick} />
            </View>
        )
    }

    const [showHintsMenu, setHintsMenuVisibility] = useToggle(false)
    useEffect(() => {
        addListener(EVENTS.HINT_CLICKED, setHintsMenuVisibility)
        return () => removeListener(EVENTS.HINT_CLICKED, setHintsMenuVisibility)
    }, [setHintsMenuVisibility])

    const renderHintsMenu = () => {
        if (!showHintsMenu) return null
        return <HintsMenu visibilityToggler={setHintsMenuVisibility} />
    }

    return (
        <Page onFocus={handleGameInFocus} onBlur={handleGameOutOfFocus} navigation={navigation}>
            <View style={styles.container} onLayout={onParentLayout}>
                {header}
                {renderRefreeView()}
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
                    <CustomPuzzle parentHeight={pageHeight} onCustomPuzzleClosed={closeCustomPuzzleHC} />
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
                        nextHintClick={nextHintClick}
                        prevHintClick={prevHintClick}
                        currentHintNum={currentHintNum}
                        totalHintsCount={totalHintsCount}
                    />
                ) : null}
                {renderHintsMenu()}
            </View>
        </Page>
    )
}

export const Arena = React.memo(Arena_)
