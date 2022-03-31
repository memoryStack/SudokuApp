import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { Board } from './gameBoard'
import { Inputpanel } from './inputPanel'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { emit } from '../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE, DEEPLINK_HOST_NAME } from '../../resources/constants'
import { Page } from '../components/Page'
import { NextGameMenu } from './nextGameMenu'
import { GameOverCard } from './gameOverCard'
import { isGameOver } from './utils/util'
import { CustomPuzzle } from './customPuzzle'
import { useCellActions, MAX_AVAILABLE_HINTS } from './hooks/cellActions'
import { useReferee } from './hooks/referee'
import { useGameBoard } from './hooks/gameBoard'
import { useManageGame } from './hooks/gameHandler'
import SmartHintHC from './smartHintHC'
import Share from 'react-native-share'
import { SHARE, SOMETHING_WENT_WRONG } from '../../resources/stringLiterals'
import { consoleLog, noOperationFunction, rgba } from '../../utils/util'
import { fonts } from '../../resources/fonts/font'
import { ShareIcon } from '../../resources/svgIcons/share'
import { LeftArrow } from '../../resources/svgIcons/leftArrow'
import { HintsMenu } from './hintsMenu'
import { useSelector } from 'react-redux'
import Refree from './refree'
import { getDifficultyLevel, getMistakes, getTime } from './store/selectors/refree.selectors'
import { getGameState } from './store/selectors/gameState.selectors'
import { BoardController } from './cellActions'
import { getMainNumbers, getNotesInfo } from './store/selectors/board.selectors'
import { getHintsMenuVisibilityStatus } from './store/selectors/boardController.selectors'
import { GameInputPanel } from './GameInputPanel'

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
    const { showNextGameMenu, setShowNextGameMenu, showCustomPuzzleHC, closeCustomPuzzleHC } = useManageGame(route)

    const { hints } = useCellActions()

    useGameBoard(hints)

    const { MISTAKES_LIMIT } = useReferee()

    // for game over halfcard animation
    const fadeAnim = useRef(new Animated.Value(0)).current

    const gameState = useSelector(getGameState)
    const mainNumbers = useSelector(getMainNumbers)

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

    const showHintsMenu = useSelector(getHintsMenuVisibilityStatus)

    const renderHintsMenu = () => {
        if (!showHintsMenu) return null
        return <HintsMenu />
    }

    const mistakes = useSelector(getMistakes)
    const difficultyLevel = useSelector(getDifficultyLevel)

    const time = useSelector(getTime)

    const notesInfo = useSelector(getNotesInfo)

    return (
        <Page onFocus={handleGameInFocus} onBlur={handleGameOutOfFocus} navigation={navigation}>
            <View style={styles.container} onLayout={onParentLayout}>
                {header}
                <Refree maxMistakesLimit={MISTAKES_LIMIT} />
                <Board notesInfo={notesInfo} />
                {/* TODO: it can be named better */}
                <BoardController />
                <View style={styles.inputPanelContainer}>
                    <GameInputPanel />
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
                                stats={{ mistakes, difficultyLevel, time, hintsUsed: MAX_AVAILABLE_HINTS - hints }}
                                openNextGameMenu={hideCongratsModal}
                            />
                        </Animated.View>
                    </Touchable>
                ) : null}
                <SmartHintHC parentHeight={pageHeight} />
                {renderHintsMenu()}
            </View>
        </Page>
    )
}

export const Arena = React.memo(Arena_)
