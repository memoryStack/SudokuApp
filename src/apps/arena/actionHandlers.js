import Share from 'react-native-share'
import {
    LEVEL_DIFFICULTIES,
    GAME_STATE,
    LEVELS_CLUES_INFO,
    CUSTOMIZED_PUZZLE_LEVEL_TITLE,
    DEEPLINK_HOST_NAME,
    EVENTS,
    PENCIL_STATE,
} from '../../resources/constants'
import { emit } from '../../utils/GlobalEventBus'
import { duplicatesInPuzzle, getNumberOfSolutions, initNotes } from './utils/util'
import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'
import { getKey } from '../../utils/storage'
import { GAME_DATA_KEYS, PREVIOUS_GAME_DATA_KEY } from './utils/cacheGameHandler'
import {
    INVALID_DEEPLINK_PUZZLE,
    LAUNCHING_DEFAULT_PUZZLE,
    DEEPLINK_PUZZLE_NO_SOLUTIONS,
    RESUME,
    CUSTOMIZE_YOUR_PUZZLE_TITLE,
} from '../../resources/stringLiterals'
import { updateGameState } from './store/actions/gameState.actions'
import { consoleLog, noOperationFunction } from '../../utils/util'
import {
    updateMainNumbers,
    updateMoves,
    updateNotes,
    updateSelectedCell,
    initPossibleNotes,
} from './store/actions/board.actions'
import { updateDifficultylevel, updateMistakes, updateTime } from './store/actions/refree.actions'
import { updatePencil } from './store/actions/boardController.actions'
import { SOMETHING_WENT_WRONG } from '../../resources/stringLiterals'
import { getMainNumbers } from './store/selectors/board.selectors'
import { getStoreState } from '../../redux/dispatch.helpers'

const getMainNumbersFromString = puzzle => {
    const result = new Array(9)

    let cellNo = 0
    for (let row = 0; row < 9; row++) {
        const rowData = new Array(9)
        for (let col = 0; col < 9; col++) {
            const clueIntValue = parseInt(puzzle[cellNo], 10)
            if (isNaN(clueIntValue)) {
                emit(EVENTS.SHOW_SNACK_BAR, { msg: `${INVALID_DEEPLINK_PUZZLE} ${LAUNCHING_DEFAULT_PUZZLE}` })
                throw 'invalid puzzle'
            }
            rowData[col] = {
                value: clueIntValue,
                solutionValue: '',
                isClue: clueIntValue !== 0,
            }
            cellNo++
        }
        result[row] = rowData
    }

    return result
}

const getUrlFormatError = url => {
    if (!url) return INVALID_DEEPLINK_PUZZLE
    const FORMAT_ERROR = `${INVALID_DEEPLINK_PUZZLE} ${LAUNCHING_DEFAULT_PUZZLE}`
    const startIndex = url.indexOf(DEEPLINK_HOST_NAME)
    if (startIndex === -1) return FORMAT_ERROR

    const puzzleNumbers = url.substring(DEEPLINK_HOST_NAME.length)
    if (puzzleNumbers.length !== 81) return FORMAT_ERROR

    for (let i = 0; i < puzzleNumbers.length; i++) {
        const clueIntValue = parseInt(puzzleNumbers[i], 10)
        if (isNaN(clueIntValue)) return FORMAT_ERROR
    }

    return ''
}

const handleBackPress = ({ getState }) => {
    const { navigation } = getState()
    navigation && navigation.goBack()
}

const startGame = ({ mainNumbers, notesInfo, selectedCell, moves, difficultyLevel, mistakes, time, pencilState }) => {
    // board state
    updateMainNumbers(mainNumbers)
    updateNotes(notesInfo)
    updateSelectedCell(selectedCell)
    updateMoves(moves)
    initPossibleNotes(mainNumbers)

    // refree state
    updateDifficultylevel(difficultyLevel)
    updateMistakes(mistakes)
    updateTime(time)

    // cell actions state. TODO: implement support for hints as well
    updatePencil(pencilState || PENCIL_STATE.INACTIVE)

    // game state
    updateGameState(GAME_STATE.ACTIVE)
}

const startNewGame = ({ mainNumbers, difficultyLevel }) => {
    const initRefereeData = () => {
        return {
            difficultyLevel,
            mistakes: 0,
            time: { hours: 0, minutes: 0, seconds: 0 },
        }
    }

    startGame({
        mainNumbers,
        notesInfo: initNotes(),
        selectedCell: { row: 0, col: 0 },
        moves: [],
        ...initRefereeData(),
    })
}

const handleInitSharedPuzzle = ({ params: puzzleUrl }) => {
    const urlFormatError = getUrlFormatError(puzzleUrl)
    if (urlFormatError) {
        emit(EVENTS.SHOW_SNACK_BAR, { msg: urlFormatError })
        generateNewPuzzle(LEVEL_DIFFICULTIES.EASY)
        return
    }

    const puzzleNumbers = puzzleUrl.substring(DEEPLINK_HOST_NAME.length)
    const mainNumbers = getMainNumbersFromString(puzzleNumbers)

    if (duplicatesInPuzzle(mainNumbers).present) {
        // TODO: give option to correct the puzzle if user can
        emit(EVENTS.SHOW_SNACK_BAR, { msg: `puzzle is invalid. ${LAUNCHING_DEFAULT_PUZZLE}` })
        generateNewPuzzle(LEVEL_DIFFICULTIES.EASY)
        return
    }

    const numberOfSolutions = getNumberOfSolutions(mainNumbers)
    switch (true) {
        case numberOfSolutions === 0:
            emit(EVENTS.SHOW_SNACK_BAR, { msg: `${DEEPLINK_PUZZLE_NO_SOLUTIONS} ${LAUNCHING_DEFAULT_PUZZLE}` })
            generateNewPuzzle(LEVEL_DIFFICULTIES.EASY)
            break
        case numberOfSolutions === 1:
            startNewGame({ difficultyLevel: 'Shared Puzzle', mainNumbers })
            break
        case numberOfSolutions >= 1:
        default:
            emit(EVENTS.SHOW_SNACK_BAR, { msg: `Puzzle has multiple solutions. ${LAUNCHING_DEFAULT_PUZZLE}` })
            generateNewPuzzle(LEVEL_DIFFICULTIES.EASY)
    }
}

const transformNativeGeneratedPuzzle = (clues, solution) => {
    const mainNumbers = new Array(9)
    let cellNo = 0
    for (let row = 0; row < 9; row++) {
        const rowData = new Array(9)
        for (let col = 0; col < 9; col++) {
            const cellvalue = clues[cellNo]
            rowData[col] = {
                value: cellvalue,
                solutionValue: solution[cellNo],
                isClue: cellvalue !== 0,
            }
            cellNo++
        }
        mainNumbers[row] = rowData
    }
    return mainNumbers
}

const generateNewPuzzle = difficultyLevel => {
    consoleLog('@@@@@@ difficulty level', difficultyLevel)
    if (!difficultyLevel) return
    // "minClues" becoz sometimes for the expert type of levels we get more than desired clues
    const minClues = LEVELS_CLUES_INFO[difficultyLevel]
    RNSudokuPuzzle.getSudokuPuzzle(minClues)
        .then(({ clues, solution }) => {
            const mainNumbers = transformNativeGeneratedPuzzle(clues, solution)
            startNewGame({ difficultyLevel, mainNumbers })
        })
        .catch(error => {
            __DEV__ && console.log(error)
        })
}

// TODO: decide contract for the previous game
// TODO: test it once the game state caching logic is implemented
const resumePreviousGame = previousGameData => {
    // TODO: do all this only if the previous game is unsolved
    // if it's solved/failed then start a new game of same level and nudge the user as well
    startGame({
        ...previousGameData[GAME_DATA_KEYS.BOARD_DATA],
        ...previousGameData[GAME_DATA_KEYS.REFEREE],
        ...previousGameData[GAME_DATA_KEYS.CELL_ACTIONS],
    })
}

const handleMenuItemPress = ({ setState, params: menuItem }) => {
    updateGameState(GAME_STATE.GAME_SELECT)

    switch (menuItem) {
        case LEVEL_DIFFICULTIES.EASY:
        case LEVEL_DIFFICULTIES.MEDIUM:
        case LEVEL_DIFFICULTIES.HARD:
        case LEVEL_DIFFICULTIES.EXPERT:
            generateNewPuzzle(menuItem)
            break
        case RESUME:
            getKey(PREVIOUS_GAME_DATA_KEY)
                .then(previousGameData => {
                    resumePreviousGame(previousGameData)
                })
                .catch(error => {
                    __DEV__ && console.log(error)
                })
            break
        case CUSTOMIZE_YOUR_PUZZLE_TITLE:
            setState({ showCustomPuzzleHC: true })
            break
        default:
            consoleLog('@@@@ unidentified game menu item, starting easy puzzle')
            generateNewPuzzle(LEVEL_DIFFICULTIES.EASY)
    }
}

const handleStartCustomPuzzle = ({ params: mainNumbers }) => {
    startNewGame({ mainNumbers, difficultyLevel: CUSTOMIZED_PUZZLE_LEVEL_TITLE })
}

const handleCustomPuzzleHCClose = ({ setState, params: { puzzleFilled, previousGameState } }) => {
    setState({ showCustomPuzzleHC: false })
    if (!puzzleFilled) updateGameState(previousGameState)
}

const handleSharePuzzle = () => {
    const mainNumbers = getMainNumbers(getStoreState())

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
            consoleLog(error)
            emit(EVENTS.SHOW_SNACK_BAR, { msg: SOMETHING_WENT_WRONG })
        })
}

const ACTION_TYPES = {
    ON_INIT: 'ON_INIT',
    ON_BACK_PRESS: 'ON_BACK_PRESS',
    ON_SHARE_CLICK: 'ON_SHARE_CLICK',
    ON_INIT_SHARED_PUZZLE: 'ON_INIT_SHARED_PUZZLE',
    ON_NEW_GAME_MENU_ITEM_PRESS: 'ON_NEW_GAME_MENU_ITEM_PRESS',
    ON_START_CUSTOM_PUZZLE: 'ON_START_CUSTOM_PUZZLE',
    ON_CUSTOM_PUZZLE_HC_CLOSE: 'ON_CUSTOM_PUZZLE_HC_CLOSE',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_INIT]: () => {}, // most likely i won't use this action
    [ACTION_TYPES.ON_BACK_PRESS]: handleBackPress,
    [ACTION_TYPES.ON_SHARE_CLICK]: handleSharePuzzle,
    [ACTION_TYPES.ON_INIT_SHARED_PUZZLE]: handleInitSharedPuzzle,
    [ACTION_TYPES.ON_NEW_GAME_MENU_ITEM_PRESS]: handleMenuItemPress,
    [ACTION_TYPES.ON_START_CUSTOM_PUZZLE]: handleStartCustomPuzzle,
    [ACTION_TYPES.ON_CUSTOM_PUZZLE_HC_CLOSE]: handleCustomPuzzleHCClose,
}

export { ACTION_TYPES, ACTION_HANDLERS }
