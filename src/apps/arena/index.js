import React, {
    useState, useCallback, useEffect, useRef,
} from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { GAME_STATE } from '@resources/constants'
import { fonts } from '@resources/fonts/font'
import { Touchable } from '../components/Touchable' // TODO: make linter catch issues like this
import { Page } from '../components/Page'
import { NextGameMenu } from './nextGameMenu'
import { GameOverCard } from './gameOverCard'
import { CustomPuzzle } from './customPuzzle'
import SmartHintHC from './smartHintHC'
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
import { usePrevious } from '../../utils/customHooks'
import { consoleLog } from '../../utils/util'
import { Button } from '../../components/button'
import { fillPuzzle } from './store/actions/board.actions'
import { getHintHCInfo } from './store/selectors/smartHintHC.selectors'
import { GameState } from './utils/classes/gameState'
import { HEADER_ITEMS_PRESS_HANDLERS_KEYS, HEADER_ITEMS } from '../../navigation/route.constants'

const MAX_AVAILABLE_HINTS = 3
const styles = StyleSheet.create({
    page: {
        display: 'flex',
        backgroundColor: 'white',
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        paddingTop: 24,
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

const Arena_ = ({
    navigation, route, onAction, showCustomPuzzleHC, showGameSolvedCard, showNextGameMenu,
}) => {
    const [pageHeight, setPageHeight] = useState(0)

    const gameState = useSelector(getGameState)

    consoleLog('@@@@@ gs', gameState)

    const previousGameState = usePrevious(gameState)

    const fadeAnim = useRef(new Animated.Value(0))

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
    }, [onAction])

    useEffect(() => {
        if (new GameState(gameState).isGameOver()) {
            onAction({ type: ACTION_TYPES.ON_GAME_OVER, payload: fadeAnim.current })
        }
    }, [gameState, onAction])

    const onParentLayout = useCallback(({ nativeEvent: { layout: { height = 0 } = {} } = {} }) => {
        setPageHeight(height)
    }, [])

    // What is it doing and why ?
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

    const onStartCustomPuzzle = useCallback(
        mainNumbers => {
            onAction({
                type: ACTION_TYPES.ON_START_CUSTOM_PUZZLE,
                payload: mainNumbers,
            })
        },
        [onAction],
    )

    const onCustomPuzzleHCClosed = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_CUSTOM_PUZZLE_HC_CLOSE })
    }, [onAction])

    const hideCongratsModal = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_HIDE_GAME_OVER_CARD, payload: fadeAnim.current })
    }, [onAction])

    // eslint-disable-next-line no-shadow
    const isPuzzlePresent = (currentGameState, previousGameState) => {
        const currentGameStateObj = new GameState(currentGameState)
        return (
            currentGameStateObj.isGameActive()
            || (currentGameStateObj.isGameSelecting() && new GameState(previousGameState).isGameOver())
        )
    }

    const handleSharePuzzleClick = useCallback(() => {
        if (isPuzzlePresent(gameState, previousGameState)) {
            onAction({ type: ACTION_TYPES.ON_SHARE_CLICK })
        }
    }, [gameState, previousGameState])

    useEffect(() => {
        navigation.isFocused()
            && navigation.setParams({
                [HEADER_ITEMS_PRESS_HANDLERS_KEYS[HEADER_ITEMS.SHARE]]: handleSharePuzzleClick,
            })
    }, [navigation, handleSharePuzzleClick])

    const onNewGameMenuItemClick = useCallback(
        item => {
            onAction({ type: ACTION_TYPES.ON_NEW_GAME_MENU_ITEM_PRESS, payload: item })
        },
        [onAction],
    )

    const onNewGameMenuClosed = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_NEW_GAME_MENU_CLOSE })
    }, [onAction])

    const renderFillPuzzleBtn = () => {
        if (!__DEV__) return null
        return <Button text="Fill" onClick={fillPuzzle} />
    }

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

    const renderInputPanel = () => (
        <View style={styles.inputPanelContainer}>
            <GameInputPanel />
        </View>
    )

    const renderSmartHintHC = () => {
        if (!(pageHeight && showSmartHint)) return null
        return <SmartHintHC parentHeight={pageHeight} />
    }

    const renderGameOverCard = () => {
        if (!showGameSolvedCard) return null

        return (
            <Touchable
                activeOpacity={1}
                style={styles.gameOverCardAbsoluteBG}
                onPress={hideCongratsModal}
            >
                <Animated.View style={[styles.gameOverAnimatedBG, { opacity: fadeAnim.current }]}>
                    <GameOverCard
                        stats={{
                            mistakes,
                            difficultyLevel,
                            time,
                            hintsUsed: MAX_AVAILABLE_HINTS - 2,
                        }}
                        openNextGameMenu={hideCongratsModal}
                    />
                </Animated.View>
            </Touchable>
        )
    }

    return (
        <Page style={styles.page} onFocus={handleGameInFocus} onBlur={handleGameOutOfFocus} onLayout={onParentLayout}>
            <View style={styles.contentContainer}>
                {renderFillPuzzleBtn()}
                <Refree />
                <PuzzleBoard />
                {/* TODO: it can be named better */}
                <BoardController />
                {renderInputPanel()}
            </View>
            {renderSmartHintHC()}
            {renderHintsMenu()}
            {renderNextGameMenu()}
            {renderCustomPuzzleHC()}
            {renderGameOverCard()}
        </Page>
    )
}

export const Arena = React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(Arena_))

Arena_.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
    onAction: PropTypes.func,
    showCustomPuzzleHC: PropTypes.bool,
    showGameSolvedCard: PropTypes.bool,
    showNextGameMenu: PropTypes.bool,
}

Arena_.defaultProps = {
    navigation: {},
    route: {},
    onAction: _noop,
    showCustomPuzzleHC: false,
    showGameSolvedCard: false,
    showNextGameMenu: false,
}
