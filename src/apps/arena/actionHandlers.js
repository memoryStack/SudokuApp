import { Animated } from 'react-native'
import Share from 'react-native-share'

import _isEmpty from '@lodash/isEmpty'
import _findIndex from '@lodash/findIndex'
import _isInteger from '@lodash/isInteger'
import _noop from '@lodash/noop'

import { getKey } from '@utils/storage'
import {
    LAUNCHING_DEFAULT_PUZZLE,
    DEEPLINK_PUZZLE_NO_SOLUTIONS,
    RESUME,
    CUSTOMIZE_YOUR_PUZZLE_TITLE,
    SOMETHING_WENT_WRONG,
} from '@resources/stringLiterals'
import {
    LEVEL_DIFFICULTIES,
    GAME_STATE,
    LEVELS_CLUES_INFO,
    CUSTOMIZED_PUZZLE_LEVEL_TITLE,
    DEEPLINK_HOST_NAME,
    PENCIL_STATE,
} from '@resources/constants'
import { Puzzle } from '@adapters/puzzle'

import { convertBoardCellToNum } from '@domain/board/utils/cellsTransformers'

import { emit } from '../../utils/GlobalEventBus'
import {
    duplicatesInPuzzle,
    getPuzzleSolutionType,
    isGenerateNewPuzzleItem,
} from './utils/util'

import { GAME_DATA_KEYS, PREVIOUS_GAME_DATA_KEY } from './utils/cacheGameHandler'
import { consoleLog } from '../../utils/util'

import { EVENTS } from '../../constants/events'
import { GameState } from './utils/classes/gameState'
import { MainNumbersRecord } from './RecordUtilities/boardMainNumbers'
import { NotesRecord } from './RecordUtilities/boardNotes'

import { BoardIterators } from '@domain/board/utils/boardIterators'

import {
    DEEPLINK_PUZZLE_URL_ERRORS, PUZZLE_SOLUTION_TYPES,
} from './constants'
import { MAX_AVAILABLE_HINTS } from './store/state/boardController.state'
import { BOARD_CELLS_COUNT, CELLS_IN_A_HOUSE } from '@domain/board/board.constants'

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

const startGame = ({
    mainNumbers,
    notes,
    selectedCell,
    moves,
    difficultyLevel,
    mistakes,
    time,
    pencilState,
    dependencies,
    hints: hintsLeft,
}) => {
    const {
        boardRepository, refreeRepository, gameStateRepository, boardControllerRepository,
    } = dependencies

    boardRepository.setState({
        mainNumbers, notes, selectedCell, moves,
    })

    // refree state
    refreeRepository.setGameLevel(difficultyLevel)
    refreeRepository.setGameMistakesCount(mistakes)
    refreeRepository.setTime(time)

    boardControllerRepository.setPencil(pencilState || PENCIL_STATE.INACTIVE)
    boardControllerRepository.setHintsLeftCount(hintsLeft)
    gameStateRepository.setGameState(GAME_STATE.ACTIVE)
}

const startNewGame = ({ mainNumbers, difficultyLevel, dependencies }) => {
    const initRefereeData = () => ({
        difficultyLevel,
        mistakes: 0,
        time: { hours: 0, minutes: 0, seconds: 0 },
    })

    startGame({
        mainNumbers,
        notes: NotesRecord.initNotes(),
        selectedCell: { row: 0, col: 0 },
        moves: [],
        ...initRefereeData(),
        hints: MAX_AVAILABLE_HINTS,
        dependencies,
    })
}

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
            startNewGame({ difficultyLevel: 'Shared Puzzle', mainNumbers, dependencies })
            break
        case PUZZLE_SOLUTION_TYPES.MULTIPLE_SOLUTIONS:
        default:
            emit(EVENTS.LOCAL.SHOW_SNACK_BAR, { msg: `Puzzle has multiple solutions. ${LAUNCHING_DEFAULT_PUZZLE}` })
            generateNewPuzzle(LEVEL_DIFFICULTIES.EASY, dependencies)
    }
}

const transformNativeGeneratedPuzzle = (clues, solution) => {
    const mainNumbers = []
    for (let row = 0; row < CELLS_IN_A_HOUSE; row++) {
        const rowData = []
        for (let col = 0; col < CELLS_IN_A_HOUSE; col++) {
            const cellNo = convertBoardCellToNum({ row, col })
            const cellvalue = clues[cellNo]
            rowData.push({
                value: cellvalue,
                solutionValue: solution[cellNo],
                isClue: cellvalue !== 0,
            })
        }
        mainNumbers.push(rowData)
    }
    return mainNumbers
}

const generateNewPuzzle = (difficultyLevel, dependencies) => {
    if (!difficultyLevel) return
    // "minClues" becoz sometimes for the expert levels we get more than desired clues
    const minClues = LEVELS_CLUES_INFO[difficultyLevel]

    Puzzle.getSudokuPuzzle(minClues)
        .then(({ clues, solution }) => {
            const mainNumbers = transformNativeGeneratedPuzzle(clues, solution)
            startNewGame({ difficultyLevel, mainNumbers, dependencies })
        })
        .catch(error => {
            consoleLog(error)
        })
}

const resumePreviousGame = dependencies => {
    getKey(PREVIOUS_GAME_DATA_KEY)
        .then(previousGameData => {
            startGame({
                ...previousGameData[GAME_DATA_KEYS.BOARD_DATA],
                ...previousGameData[GAME_DATA_KEYS.REFEREE],
                ...previousGameData[GAME_DATA_KEYS.CELL_ACTIONS],
                dependencies,
            })
        })
        .catch(error => {
            consoleLog(error)
        })
}

const handleMenuItemPress = ({ setState, params: { selectedGameMenuItem, dependencies } }) => {
    if (isGenerateNewPuzzleItem(selectedGameMenuItem)) {
        generateNewPuzzle(selectedGameMenuItem, dependencies)
        return
    }

    if (selectedGameMenuItem === RESUME) {
        resumePreviousGame(dependencies)
        return
    }

    if (selectedGameMenuItem === CUSTOMIZE_YOUR_PUZZLE_TITLE) {
        setState({ showCustomPuzzleHC: true })
        return
    }

    generateNewPuzzle(LEVEL_DIFFICULTIES.EASY, dependencies)
}

const handleStartCustomPuzzle = ({ params: { mainNumbers, dependencies } }) => {
    startNewGame({ mainNumbers, difficultyLevel: CUSTOMIZED_PUZZLE_LEVEL_TITLE, dependencies })
}

const handleCustomPuzzleHCClose = ({ setState }) => {
    setState({ showCustomPuzzleHC: false })
}

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

const handleScreenOutOfFocus = ({ params: { gameState, dependencies } }) => {
    if (!new GameState(gameState).isGameActive()) return

    const { gameStateRepository } = dependencies
    gameStateRepository.setGameState(GAME_STATE.INACTIVE)
}

const handleScreenInFocus = ({ params: { gameState, dependencies } }) => {
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
    [ACTION_TYPES.ON_START_CUSTOM_PUZZLE]: handleStartCustomPuzzle,
    [ACTION_TYPES.ON_CUSTOM_PUZZLE_HC_CLOSE]: handleCustomPuzzleHCClose,
    [ACTION_TYPES.ON_OUT_OF_FOCUS]: handleScreenOutOfFocus,
    [ACTION_TYPES.ON_IN_FOCUS]: handleScreenInFocus,
    [ACTION_TYPES.ON_HIDE_GAME_OVER_CARD]: handleHideGameOverCard,
    [ACTION_TYPES.ON_NEW_GAME_MENU_CLOSE]: handleNewGameMenuClose,
    [ACTION_TYPES.ON_GAME_OVER]: handleGameOver,
}

export { ACTION_TYPES, ACTION_HANDLERS }
