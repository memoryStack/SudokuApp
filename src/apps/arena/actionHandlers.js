import { Animated } from 'react-native'
import Share from 'react-native-share'

import _isEmpty from '@lodash/isEmpty'
import _findIndex from '@lodash/findIndex'
import _isInteger from '@lodash/isInteger'
import _noop from '@lodash/noop'

import {
    SOMETHING_WENT_WRONG,
} from '@resources/stringLiterals'
import {
    GAME_STATE,
    DEEPLINK_HOST_NAME,
} from '@resources/constants'

import { emit } from '../../utils/GlobalEventBus'

import { consoleLog } from '../../utils/util'

import { EVENTS } from '../../constants/events'
import { GameState } from '@application/utils/gameState'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import { handleMenuItemPress as handleMenuItemPressUseCase } from '@application/usecases/newGameMenu'

import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { handleInitSharedPuzzle } from '@application/usecases/startSharedPuzzle'

const _handleInitSharedPuzzle = async ({ params: { puzzleUrl, dependencies } }) => {
    handleInitSharedPuzzle(puzzleUrl, dependencies)
}

const handleMenuItemPress = ({ setState, params: { selectedGameMenuItem, dependencies } }) => {
    const customPuzzleInputToggler = {
        open: () => setState({ showCustomPuzzleHC: true }),
        close: () => setState({ showCustomPuzzleHC: false })
    }
    handleMenuItemPressUseCase(selectedGameMenuItem, { ...dependencies, customPuzzleInputToggler })
}

const handleCustomPuzzleHCClose = ({ setState }) => {
    setState({ showCustomPuzzleHC: false })
}

// TODO: take it out
const handleSharePuzzle = ({ params: { dependencies } }) => {
    const { boardRepository } = dependencies
    const mainNumbers = boardRepository.getMainNumbers()

    let puzzleString = ''
    BoardIterators.forBoardEachCell(({ row, col }) => {
        const num = MainNumbersRecord.isClueCell(mainNumbers, { row, col })
            ? MainNumbersRecord.getCellMainValue(mainNumbers, { row, col }) : 0
        puzzleString = `${puzzleString}${num}`
    })

    const options = {
        message: 'Solve This Sudoku Challenge',
        url: `${DEEPLINK_HOST_NAME}${puzzleString}`,
    }
    Share.open(options)
        .then(_noop, _noop)
        .catch(error => {
            consoleLog(error)
            emit(EVENTS.LOCAL.SHOW_SNACK_BAR, { msg: SOMETHING_WENT_WRONG })
        })
}

// TODO: these also needs to be moved out
const handleScreenOutOfFocus = ({ params: { gameState, dependencies } }) => {
    if (!new GameState(gameState).isGameActive()) return

    const { gameStateRepository } = dependencies
    gameStateRepository.setGameState(GAME_STATE.INACTIVE)
}

// TODO: these also needs to be moved out
const handleScreenInFocus = ({ params: { gameState, dependencies } }) => {
    // this is basically resuming the paused game
    // it's responsibilities should be, pause the game and persist the state of game
    if (!new GameState(gameState).isGameInactive()) return
    const { gameStateRepository } = dependencies
    gameStateRepository.setGameState(GAME_STATE.ACTIVE)
}

const handleHideGameOverCard = ({ setState, params: { fadeAnim, dependencies } }) => {
    Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
    }).start(() => {
        setState({ showGameSolvedCard: false })
        setTimeout(() => {
            setState({ showNextGameMenu: true })

            const { gameStateRepository } = dependencies
            gameStateRepository.setGameState(GAME_STATE.GAME_SELECT)
        }, 100)
    })
}

const handleNewGameMenuClose = ({ setState }) => {
    setState({ showNextGameMenu: false })
}

const handleGameOver = ({ setState, params: fadeAnim }) => {
    setState({ showGameSolvedCard: true }, () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start()
    })
}

const ACTION_TYPES = {
    ON_SHARE_CLICK: 'ON_SHARE_CLICK',
    ON_INIT_SHARED_PUZZLE: 'ON_INIT_SHARED_PUZZLE',
    ON_NEW_GAME_MENU_ITEM_PRESS: 'ON_NEW_GAME_MENU_ITEM_PRESS',
    ON_START_CUSTOM_PUZZLE: 'ON_START_CUSTOM_PUZZLE',
    ON_CUSTOM_PUZZLE_HC_CLOSE: 'ON_CUSTOM_PUZZLE_HC_CLOSE',
    ON_OUT_OF_FOCUS: 'ON_OUT_OF_FOCUS',
    ON_IN_FOCUS: 'ON_IN_FOCUS',
    ON_HIDE_GAME_OVER_CARD: 'ON_HIDE_GAME_OVER_CARD',
    ON_NEW_GAME_MENU_CLOSE: 'ON_NEW_GAME_MENU_CLOSE',
    ON_GAME_OVER: 'ON_GAME_OVER',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_SHARE_CLICK]: handleSharePuzzle,
    [ACTION_TYPES.ON_INIT_SHARED_PUZZLE]: _handleInitSharedPuzzle,
    [ACTION_TYPES.ON_NEW_GAME_MENU_ITEM_PRESS]: handleMenuItemPress,
    [ACTION_TYPES.ON_CUSTOM_PUZZLE_HC_CLOSE]: handleCustomPuzzleHCClose,
    [ACTION_TYPES.ON_OUT_OF_FOCUS]: handleScreenOutOfFocus,
    [ACTION_TYPES.ON_IN_FOCUS]: handleScreenInFocus,
    [ACTION_TYPES.ON_HIDE_GAME_OVER_CARD]: handleHideGameOverCard,
    [ACTION_TYPES.ON_NEW_GAME_MENU_CLOSE]: handleNewGameMenuClose,
    [ACTION_TYPES.ON_GAME_OVER]: handleGameOver,
}

export { ACTION_TYPES, ACTION_HANDLERS }
