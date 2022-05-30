import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { GAME_STATE } from '../../resources/constants'
import { Page } from '../components/Page'
import { NextGameMenu } from './nextGameMenu'
import { GameOverCard } from './gameOverCard'
import { isGameOver } from './utils/util'
import { CustomPuzzle } from './customPuzzle'
import SmartHintHC from './smartHintHC'
import { fonts } from '../../resources/fonts/font'
import { ShareIcon } from '../../resources/svgIcons/share'
import { LeftArrow } from '../../resources/svgIcons/leftArrow'
import { HintsMenu } from './hintsMenu'
import Refree from './refree'
import { getDifficultyLevel, getMistakes, getTime } from './store/selectors/refree.selectors'
import { getGameState } from './store/selectors/gameState.selectors'
import { BoardController } from './cellActions'
import { getHintsMenuVisibilityStatus } from './store/selectors/boardController.selectors'
import { GameInputPanel } from './GameInputPanel'
import { PuzzleBoard } from './PuzzleBoard'
import withActions from '../../utils/hocs/withActions'
import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import { useCacheGameState } from './hooks/useCacheGameState'
import { GAME_DATA_KEYS } from './utils/cacheGameHandler'
import { updateGameState } from './store/actions/gameState.actions'
import { usePrevious, useToggle } from '../../utils/customHooks/commonUtility'
import { consoleLog } from '../../utils/util'
import { Button } from '../../components/button'
import { fillPuzzle } from './store/actions/board.actions'
import { getHintHCInfo } from './store/selectors/smartHintHC.selectors'

const MAX_AVAILABLE_HINTS = 3
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

const Arena_ = ({ navigation, route, onAction, showCustomPuzzleHC, showGameSolvedCard, showNextGameMenu }) => {
    const [pageHeight, setPageHeight] = useState(0)

    const gameState = useSelector(getGameState)

    consoleLog('@@@@@ gs', gameState)

    const previousGameState = usePrevious(gameState)

    const fadeAnim = useRef(new Animated.Value(0)).current

    const showHintsMenu = useSelector(getHintsMenuVisibilityStatus)

    const { show: showSmartHint } = useSelector(getHintHCInfo)

    const mistakes = useSelector(getMistakes)
    const difficultyLevel = useSelector(getDifficultyLevel)
    const time = useSelector(getTime)

    useCacheGameState(GAME_DATA_KEYS.STATE, gameState)

    useEffect(() => {
        const { params: { puzzleUrl = '', selectedGameMenuItem = '' } = {} } = route || {}
        if (puzzleUrl) {
            onAction({ type: ACTION_TYPES.ON_INIT_SHARED_PUZZLE, payload: puzzleUrl })
        } else {
            onAction({ type: ACTION_TYPES.ON_NEW_GAME_MENU_ITEM_PRESS, payload: selectedGameMenuItem })
        }
    }, [route, onAction])

    useEffect(() => {
        if (isGameOver(gameState))
            onAction({ type: ACTION_TYPES.ON_GAME_OVER, payload: fadeAnim })
    }, [gameState, onAction])

    const onParentLayout = useCallback(({ nativeEvent: { layout: { height = 0 } = {} } = {} }) => {
        setPageHeight(height)
    }, [])

    useEffect(() => {
        const resetGameState = () => updateGameState(GAME_STATE.GAME_SELECT)
        return resetGameState
    }, [])

    const handleGameInFocus = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_IN_FOCUS, payload: gameState })
    }, [onAction, gameState])

    const handleGameOutOfFocus = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_OUT_OF_FOCUS, payload: gameState })
    }, [onAction, gameState])

    const onStartCustomPuzzle = useCallback(mainNumbers => {
        onAction({
            type: ACTION_TYPES.ON_START_CUSTOM_PUZZLE,
            payload: mainNumbers,
        })
    }, [onAction])

    const onCustomPuzzleHCClosed = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_CUSTOM_PUZZLE_HC_CLOSE })
    }, [onAction])

    const hideCongratsModal = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_HIDE_GAME_OVER_CARD, payload: fadeAnim })
    }, [])

    const handleSharePuzzleClick = useCallback(() => {
        const puzzleAvailableToShare = gameState === GAME_STATE.ACTIVE || (gameState === GAME_STATE.GAME_SELECT && isGameOver(previousGameState))
        if (puzzleAvailableToShare) onAction({ type: ACTION_TYPES.ON_SHARE_CLICK })
    }, [gameState, previousGameState])

    const handleBackPress = () => onAction({ type: ACTION_TYPES.ON_BACK_PRESS })

    const onNewGameMenuItemClick = useCallback(item => {
        onAction({ type: ACTION_TYPES.ON_NEW_GAME_MENU_ITEM_PRESS, payload: item })
    }, [onAction])

    const onNewGameMenuClosed = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_NEW_GAME_MENU_CLOSE })
    }, [onAction])

    const renderFillPuzzleBtn = () => {
        if (!__DEV__) return null
        return (
            <Button
                text={'Fill'}
                onClick={fillPuzzle}
            />
        )
    }

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

                {renderFillPuzzleBtn()}

                <Touchable
                    touchable={TouchableTypes.opacity}
                    onPress={handleSharePuzzleClick}
                    hitSlop={HEADER_ICONS_TOUCHABLE_HIT_SLOP}
                >
                    <ShareIcon width={HEADER_ICON_DIMENSION} height={HEADER_ICON_DIMENSION} fill={HEADER_ICON_FILL} />
                </Touchable>
            </View>
        )
    }, [handleSharePuzzleClick])

    const renderHintsMenu = () => {
        if (!showHintsMenu) return null
        return <HintsMenu />
    }

    const renderCustomPuzzleHC = () => {
        if (!(pageHeight && showCustomPuzzleHC)) return null
        return (
            <CustomPuzzle
                parentHeight={pageHeight}
                onCustomPuzzleClosed={onCustomPuzzleHCClosed}
                startCustomPuzzle={onStartCustomPuzzle}
            />
        )
    }

    const renderNextGameMenu = () => {
        if (!(pageHeight && showNextGameMenu)) return null
        return (
            <NextGameMenu
                parentHeight={pageHeight}
                onMenuClosed={onNewGameMenuClosed}
                menuItemClick={onNewGameMenuItemClick}
            />
        )
    }

    const renderInputPanel = () => {
        return (
            <View style={styles.inputPanelContainer}>
                <GameInputPanel />
            </View>
        )
    }

    const renderSmartHintHC = () => {
        if (!(pageHeight && showSmartHint)) return null
        return <SmartHintHC parentHeight={pageHeight} />
    }
    
    return (
        <Page onFocus={handleGameInFocus} onBlur={handleGameOutOfFocus} navigation={navigation}>
            <View style={styles.container} onLayout={onParentLayout}>
                {header}
                <Refree />
                <PuzzleBoard />
                {/* TODO: it can be named better */}
                <BoardController />
                {renderInputPanel()}
                {renderNextGameMenu()}
                {renderCustomPuzzleHC()}
                {showGameSolvedCard ? (
                    <Touchable
                        touchable={TouchableTypes.opacity}
                        activeOpacity={1}
                        style={styles.gameOverCardAbsoluteBG}
                        onPress={hideCongratsModal}
                    >
                        <Animated.View style={[styles.gameOverAnimatedBG, { opacity: fadeAnim }]}>
                            <GameOverCard
                                stats={{ mistakes, difficultyLevel, time, hintsUsed: MAX_AVAILABLE_HINTS - 2 }}
                                openNextGameMenu={hideCongratsModal}
                            />
                        </Animated.View>
                    </Touchable>
                ) : null}
                {renderSmartHintHC()}
                {renderHintsMenu()}
            </View>
        </Page>
    )
}

export const Arena = React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(Arena_))
