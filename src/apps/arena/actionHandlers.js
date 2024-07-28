import { Animated } from 'react-native'
import Share from 'react-native-share'

import _isEmpty from '@lodash/isEmpty'
import _findIndex from '@lodash/findIndex'
import _isInteger from '@lodash/isInteger'
import _noop from '@lodash/noop'

import {
    LAUNCHING_DEFAULT_PUZZLE,
    DEEPLINK_PUZZLE_NO_SOLUTIONS,
    SOMETHING_WENT_WRONG,
} from '@resources/stringLiterals'
import {
    GAME_STATE,
    DEEPLINK_HOST_NAME,
} from '@resources/constants'

import { convertBoardCellToNum } from '@domain/board/utils/cellsTransformers'

import { emit } from '../../utils/GlobalEventBus'
import {
    duplicatesInPuzzle,
    getPuzzleSolutionType,
} from './utils/util'

import { consoleLog } from '../../utils/util'

import { EVENTS } from '../../constants/events'
import { GameState } from '@application/utils/gameState'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import { handleMenuItemPress as handleMenuItemPressUseCase } from '@application/usecases/newGameMenu'

import {
    DEEPLINK_PUZZLE_URL_ERRORS, PUZZLE_SOLUTION_TYPES,
} from './constants'
import { BOARD_CELLS_COUNT, CELLS_IN_A_HOUSE } from '@domain/board/board.constants'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { startGameUseCase } from '@application/usecases/startGameUseCase'
import { generateAndStartNewGameUseCase } from '@application/usecases/generateAndStartNewGame'
import { LEVEL_DIFFICULTIES } from '@application/constants'

const getMainNumbersFromString = puzzle => {
    const result = []

    for (let row = 0; row < CELLS_IN_A_HOUSE; row++) {
        const rowData = []
        for (let col = 0; col < CELLS_IN_A_HOUSE; col++) {
            const cellNo = convertBoardCellToNum({ row, col })
            const clueIntValue = parseInt(puzzle[cellNo], 10)
            rowData.push({
                value: clueIntValue,
                solutionValue: 0,
                isClue: clueIntValue !== 0,
            })
        }
        result.push(rowData)
    }

    return result
}

const getSharedPuzzleNumbersFromUrl = url => {
    const firstNumberIndex = _findIndex(url, char => _isInteger(parseInt(char, 10)))
    return url.substring(firstNumberIndex)
}

const areInvalidNumbersCountInSharedPuzzle = url => getSharedPuzzleNumbersFromUrl(url).length !== BOARD_CELLS_COUNT

const areInvalidCharactersInSharedPuzzle = url => {
    const puzzleNumbers = getSharedPuzzleNumbersFromUrl(url)
    for (let i = 0; i < puzzleNumbers.length; i++) {
        if (!_isInteger(parseInt(puzzleNumbers[i], 10))) return true
    }
    return false
}

const getSharedPuzzleError = url => {
    if (_isEmpty(url)) return DEEPLINK_PUZZLE_URL_ERRORS.EMPTY_URL
    if (areInvalidNumbersCountInSharedPuzzle(url)) return DEEPLINK_PUZZLE_URL_ERRORS.INCOMPLETE_NUMBERS
    if (areInvalidCharactersInSharedPuzzle(url)) return DEEPLINK_PUZZLE_URL_ERRORS.INVALID_CHARACTERS
    return ''
}

/*
    steps in starting a shared puzzle
        1. extract the puzzle string
        2. puzzle validations
            a. string length
            b. invalid characters in string
            c. duplicates in puzzle
            d. duplicate solutions in puzzle
                if duplicate solutions exist then launch an easy level puzzle
        
        

*/

// TODO: take it out
const handleInitSharedPuzzle = async ({ params: { puzzleUrl, dependencies } }) => {
    const sharedPuzzleError = getSharedPuzzleError(puzzleUrl)
    if (sharedPuzzleError) {
        emit(EVENTS.LOCAL.SHOW_SNACK_BAR, { msg: `${sharedPuzzleError}. ${LAUNCHING_DEFAULT_PUZZLE}` })
        generateNewPuzzle(LEVEL_DIFFICULTIES.EASY, dependencies)
        return
    }

    const mainNumbers = getMainNumbersFromString(getSharedPuzzleNumbersFromUrl(puzzleUrl))

    if (duplicatesInPuzzle(mainNumbers).present) {
        emit(EVENTS.LOCAL.SHOW_SNACK_BAR, { msg: `puzzle is invalid. ${LAUNCHING_DEFAULT_PUZZLE}` })
        generateNewPuzzle(LEVEL_DIFFICULTIES.EASY, dependencies)
        return
    }

    switch (await getPuzzleSolutionType(mainNumbers)) {
        case PUZZLE_SOLUTION_TYPES.NO_SOLUTION:
            emit(EVENTS.LOCAL.SHOW_SNACK_BAR, { msg: `${DEEPLINK_PUZZLE_NO_SOLUTIONS} ${LAUNCHING_DEFAULT_PUZZLE}` })
            generateNewPuzzle(LEVEL_DIFFICULTIES.EASY, dependencies)
            break
        case PUZZLE_SOLUTION_TYPES.UNIQUE_SOLUTION:
            startGameUseCase({ difficultyLevel: 'Shared Puzzle', mainNumbers, dependencies })
            break
        case PUZZLE_SOLUTION_TYPES.MULTIPLE_SOLUTIONS:
        default:
            emit(EVENTS.LOCAL.SHOW_SNACK_BAR, { msg: `Puzzle has multiple solutions. ${LAUNCHING_DEFAULT_PUZZLE}` })
            generateNewPuzzle(LEVEL_DIFFICULTIES.EASY, dependencies)
    }
}

const generateNewPuzzle = (difficultyLevel, dependencies) => {
    if (!difficultyLevel) return
    // "minClues" becoz sometimes for the expert levels we get more than desired clues
    generateAndStartNewGameUseCase(difficultyLevel, dependencies)
        .catch(error => {
            consoleLog(error)
        })
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
    [ACTION_TYPES.ON_INIT_SHARED_PUZZLE]: handleInitSharedPuzzle,
    [ACTION_TYPES.ON_NEW_GAME_MENU_ITEM_PRESS]: handleMenuItemPress,
    [ACTION_TYPES.ON_CUSTOM_PUZZLE_HC_CLOSE]: handleCustomPuzzleHCClose,
    [ACTION_TYPES.ON_OUT_OF_FOCUS]: handleScreenOutOfFocus,
    [ACTION_TYPES.ON_IN_FOCUS]: handleScreenInFocus,
    [ACTION_TYPES.ON_HIDE_GAME_OVER_CARD]: handleHideGameOverCard,
    [ACTION_TYPES.ON_NEW_GAME_MENU_CLOSE]: handleNewGameMenuClose,
    [ACTION_TYPES.ON_GAME_OVER]: handleGameOver,
}

export { ACTION_TYPES, ACTION_HANDLERS }
