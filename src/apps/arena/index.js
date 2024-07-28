import React, {
    useState, useCallback, useEffect, useRef,
} from 'react'
import { View, Animated } from 'react-native'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { GAME_STATE } from '@resources/constants'
import Button from '@ui/molecules/Button'
import { useStyles } from '@utils/customHooks/useStyles'

import { Timer } from '@utils/classes/timer'
import { useDependency } from '../../hooks/useDependency'
import { HEADER_ITEMS, HEADER_ITEMS_PRESS_HANDLERS_KEYS } from '../../navigation/headerSection/headerSection.constants'
import { usePrevious } from '../../utils/customHooks'
import withActions from '../../utils/hocs/withActions'

import { Touchable } from '../components/Touchable'
import { Page } from '../components/Page'

import { getDifficultyLevel, getMistakes, getTime } from './store/selectors/refree.selectors'
import { getGameState } from './store/selectors/gameState.selectors'
import { BoardController } from './cellActions'
import { getAvailableHintsCount, getHintsMenuVisibilityStatus } from './store/selectors/boardController.selectors'
import { GameInputPanel } from './GameInputPanel'
import { PuzzleBoard } from './PuzzleBoard'
import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import { useCacheGameState } from './hooks/useCacheGameState'
import { GAME_DATA_KEYS } from './utils/cacheGameHandler'

import { getShowSmartHint } from './store/selectors/smartHintHC.selectors'
import { DEFAULT_STATE as REFREE_DEFAULT_STATE } from './refree/refree.constants'
import { GameState } from '@application/utils/gameState'
import { ARENA_PAGE_TEST_ID, GAME_OVER_CARD_OVERLAY_TEST_ID, SMART_HEIGHT_HC_MAX_HEIGHT } from './constants'
import GameResultCard from './GameResultCard'
import { NextGameMenu } from './nextGameMenu'
import { CustomPuzzle } from './customPuzzle'
import SmartHintHC from './smartHintHC'
import { HintsMenu } from './hintsMenu'
import Refree from './refree'

import { getStyles } from './arena.styles'
import { fillPuzzleUseCase } from '@application/usecases/board'
import { MENU_ITEMS_LABELS } from './nextGameMenu/nextGameMenu.constants'

const Arena_ = ({
    navigation, route, onAction, showCustomPuzzleHC, showGameSolvedCard, showNextGameMenu,
}) => {
    const dependencies = useDependency()

    const styles = useStyles(getStyles)

    const [pageHeight, setPageHeight] = useState(0)

    const gameState = useSelector(getGameState)

    const previousGameState = usePrevious(gameState)

    const fadeAnim = useRef(new Animated.Value(0))

    const { refreeRepository } = dependencies
    const timer = useRef(new Timer(refreeRepository.setTime, refreeRepository.getTime)).current

    const boardControllersRef = useRef(null)

    const showHintsMenu = useSelector(getHintsMenuVisibilityStatus)

    const showSmartHint = useSelector(getShowSmartHint)

    const [smartHintHCHeight, setSmartHintHCHeight] = useState(0)

    const mistakes = useSelector(getMistakes)
    const difficultyLevelID = useSelector(getDifficultyLevel)
    const time = useSelector(getTime)

    useCacheGameState(GAME_DATA_KEYS.STATE, gameState)

    const hintsLeft = useSelector(getAvailableHintsCount)

    // TODO: putting "route" in dependency array here fails test-cases
    useEffect(() => {
        const { params: { puzzleUrl = '', selectedGameMenuItem = '' } = {} } = route || {}
        if (puzzleUrl) {
            onAction({ type: ACTION_TYPES.ON_INIT_SHARED_PUZZLE, payload: { puzzleUrl, dependencies } })
        } else {
            onAction({ type: ACTION_TYPES.ON_NEW_GAME_MENU_ITEM_PRESS, payload: { selectedGameMenuItem, dependencies } })
        }
    }, [onAction, dependencies])

    useEffect(() => {
        if (!showSmartHint || !pageHeight || smartHintHCHeight) return

        boardControllersRef.current && boardControllersRef.current.measure((_x, _y, _width, _height, _pageX, _pageY) => {
            setSmartHintHCHeight(Math.min(pageHeight - _pageY, SMART_HEIGHT_HC_MAX_HEIGHT))
        })
    }, [showSmartHint, smartHintHCHeight, pageHeight])

    useEffect(() => {
        if (new GameState(gameState).isGameOver()) {
            onAction({ type: ACTION_TYPES.ON_GAME_OVER, payload: fadeAnim.current })
        }
    }, [gameState, onAction])

    const onParentLayout = useCallback(e => {
        const { nativeEvent: { layout: { height = 0 } = {} } = {} } = e
        setPageHeight(height)
    }, [])

    // What is it doing and why ?
    // this is business logic put in UI
    useEffect(() => {
        const { gameStateRepository } = dependencies
        return () => gameStateRepository.setGameState(GAME_STATE.GAME_SELECT)
    }, [dependencies])

    const handleGameInFocus = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_IN_FOCUS, payload: { gameState, dependencies } })
    }, [onAction, gameState, dependencies])

    const handleGameOutOfFocus = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_OUT_OF_FOCUS, payload: { gameState, dependencies } })
    }, [onAction, gameState, dependencies])

    const onCustomPuzzleHCClosed = () => onAction({ type: ACTION_TYPES.ON_CUSTOM_PUZZLE_HC_CLOSE })

    const hideCongratsModal = useCallback(() => {
        onAction({
            type: ACTION_TYPES.ON_HIDE_GAME_OVER_CARD,
            payload: { fadeAnim: fadeAnim.current, dependencies },
        })
    }, [onAction, dependencies])

    const isPuzzlePresent = (currentGameState, _previousGameState) => {
        const currentGameStateObj = new GameState(currentGameState)
        return (
            currentGameStateObj.isGameActive()
            || (currentGameStateObj.isGameSelecting() && new GameState(_previousGameState).isGameOver())
        )
    }

    const handleSharePuzzleClick = useCallback(() => {
        if (isPuzzlePresent(gameState, previousGameState)) {
            onAction({ type: ACTION_TYPES.ON_SHARE_CLICK, payload: { dependencies } })
        }
    }, [onAction, gameState, previousGameState, dependencies])

    useEffect(() => {
        navigation.isFocused()
            && navigation.setParams({
                [HEADER_ITEMS_PRESS_HANDLERS_KEYS[HEADER_ITEMS.SHARE]]: handleSharePuzzleClick,
            })
    }, [navigation, handleSharePuzzleClick])

    const onNewGameMenuItemClick = useCallback(item => {
        onAction({
            type: ACTION_TYPES.ON_NEW_GAME_MENU_ITEM_PRESS,
            payload: { selectedGameMenuItem: item, dependencies },
        })
    }, [onAction, dependencies])

    const onNewGameMenuClosed = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_NEW_GAME_MENU_CLOSE })
    }, [onAction])

    useEffect(() => {
        if (new GameState(gameState).isGameActive()) timer.startTimer()
        else timer.stopTimer()
    }, [gameState])

    const renderFillPuzzleBtn = () => {
        if (!__DEV__) return null
        return <Button label="Fill" onPress={() => fillPuzzleUseCase(dependencies.boardRepository)} />
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
            <GameInputPanel dependencies={dependencies} />
        </View>
    )

    const renderSmartHintHC = () => {
        if (!(pageHeight && showSmartHint && smartHintHCHeight)) return null

        return <SmartHintHC parentHeight={pageHeight} height={smartHintHCHeight} />
    }

    const renderGameOverCard = () => {
        if (!showGameSolvedCard) return null

        return (
            <Touchable
                activeOpacity={1}
                style={styles.gameOverCardAbsoluteBG}
                onPress={hideCongratsModal}
                testID={GAME_OVER_CARD_OVERLAY_TEST_ID}
            >
                <Animated.View style={[styles.gameOverAnimatedBG, { opacity: fadeAnim.current }]}>
                    <GameResultCard
                        stats={{
                            mistakes,
                            difficultyLevel: MENU_ITEMS_LABELS[difficultyLevelID],
                            time,
                            hintsUsed: REFREE_DEFAULT_STATE.maxMistakesLimit - hintsLeft,
                        }}
                        openNextGameMenu={hideCongratsModal}
                    />
                </Animated.View>
            </Touchable>
        )
    }

    return (
        <Page
            testID={ARENA_PAGE_TEST_ID}
            style={styles.page}
            onFocus={handleGameInFocus}
            onBlur={handleGameOutOfFocus}
            onLayout={onParentLayout}
        >
            <View style={styles.contentContainer}>
                {renderFillPuzzleBtn()}
                <Refree timer={timer} />
                <PuzzleBoard />
                {/* TODO: it can be named better */}
                <BoardController refFromParent={boardControllersRef} />
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
