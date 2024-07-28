import _isEmpty from "@lodash/isEmpty"
import _isInteger from '@lodash/isInteger'
import _findIndex from "@lodash/findIndex"

import { BOARD_CELLS_COUNT, CELLS_IN_A_HOUSE } from "@domain/board/board.constants"
import { convertBoardCellToNum } from "@domain/board/utils/cellsTransformers"

import { generateAndStartNewGameUseCase } from "./generateAndStartNewGame"
import { AUTO_GENERATED_NEW_GAME_IDS, NEW_GAME_IDS } from "./newGameMenu/constants"
import { duplicatesInPuzzle } from "@domain/board/utils/common"
import { startGameUseCase } from "./startGameUseCase"
import { Dependencies } from "@application/type"
import { BoardIterators } from "@domain/board/utils/boardIterators"

const LAUNCHING_DEFAULT_PUZZLE = 'Launching default puzzle'
const DEEPLINK_PUZZLE_NO_SOLUTIONS = 'Puzzle has no solutions.'

const DEEPLINK_PUZZLE_URL_ERRORS = {
    EMPTY_URL: 'Invaild Url',
    INCOMPLETE_NUMBERS: `Puzzle doesn't have ${BOARD_CELLS_COUNT} numbers`,
    INVALID_CHARACTERS: 'Puzzle has invalid characters other than 0-9',
}

const getMainNumbersFromString = (puzzle: string) => {
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

const areInvalidNumbersCountInSharedPuzzle = (url: string) =>
    getSharedPuzzleNumbersFromUrl(url).length !== BOARD_CELLS_COUNT

const areInvalidCharactersInSharedPuzzle = (url: string) => {
    const puzzleNumbers = getSharedPuzzleNumbersFromUrl(url)
    for (let i = 0; i < puzzleNumbers.length; i++) {
        if (!_isInteger(parseInt(puzzleNumbers[i], 10))) return true
    }
    return false
}

const getSharedPuzzleError = (url: string) => {
    if (_isEmpty(url)) return DEEPLINK_PUZZLE_URL_ERRORS.EMPTY_URL
    if (areInvalidNumbersCountInSharedPuzzle(url)) return DEEPLINK_PUZZLE_URL_ERRORS.INCOMPLETE_NUMBERS
    if (areInvalidCharactersInSharedPuzzle(url)) return DEEPLINK_PUZZLE_URL_ERRORS.INVALID_CHARACTERS
    return ''
}

const generateNewPuzzle = (difficultyLevel, dependencies) => {
    if (!difficultyLevel) return
    generateAndStartNewGameUseCase(difficultyLevel, dependencies)
        .catch(error => { })
}

// this is coupled with the shared puzzle URL format, handle it
const getSharedPuzzleNumbersFromUrl = url => {
    const firstNumberIndex = _findIndex(url, char => _isInteger(parseInt(char, 10)))
    return url.substring(firstNumberIndex)
}

const updatePuzzleSolution = (mainNumbers: MainNumbers, solution: number[]) => {
    BoardIterators.forBoardEachCell((cell: Cell) => {
        const cellNo = convertBoardCellToNum(cell)
        mainNumbers[cell.row][cell.col].solutionValue = solution[cellNo]
    })
}

export const handleInitSharedPuzzle = async (puzzleUrl, dependencies: Dependencies) => {
    const { snackBarAdapter, puzzle } = dependencies
    const sharedPuzzleError = getSharedPuzzleError(puzzleUrl)
    if (sharedPuzzleError) {
        snackBarAdapter.show({ msg: `${sharedPuzzleError}. ${LAUNCHING_DEFAULT_PUZZLE}` })
        generateNewPuzzle(AUTO_GENERATED_NEW_GAME_IDS.EASY, dependencies)
        return
    }

    const mainNumbers = getMainNumbersFromString(getSharedPuzzleNumbersFromUrl(puzzleUrl))

    if (duplicatesInPuzzle(mainNumbers).present) {
        snackBarAdapter.show({ msg: `puzzle is invalid. ${LAUNCHING_DEFAULT_PUZZLE}` })
        generateNewPuzzle(AUTO_GENERATED_NEW_GAME_IDS.EASY, dependencies)
        return
    }

    const { count, solution } = await puzzle.validatePuzzle(getSharedPuzzleNumbersFromUrl(puzzleUrl))

    switch (count) {
        case 0:
            snackBarAdapter.show({ msg: `${DEEPLINK_PUZZLE_NO_SOLUTIONS} ${LAUNCHING_DEFAULT_PUZZLE}` })
            generateNewPuzzle(AUTO_GENERATED_NEW_GAME_IDS.EASY, dependencies)
            break
        case 1:
            updatePuzzleSolution(mainNumbers, solution)
            startGameUseCase({ difficultyLevel: NEW_GAME_IDS.SHARED_PUZZLE, mainNumbers, dependencies })
            break
        default:
            snackBarAdapter.show({ msg: `Puzzle has multiple solutions. ${LAUNCHING_DEFAULT_PUZZLE}` })
            generateNewPuzzle(AUTO_GENERATED_NEW_GAME_IDS.EASY, dependencies)
    }
}
