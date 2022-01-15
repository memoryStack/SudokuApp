import { GAME_STATE } from '../../../resources/constants'
import { PREVIOUS_GAME_DATA_KEY, GAME_DATA_KEYS } from './cacheGameHandler'
import { getKey } from '../../../utils/storage'
import { getBlockAndBoxNum } from '../../../utils/util'

const gameOverStates = [GAME_STATE.OVER_SOLVED, GAME_STATE.OVER_UNSOLVED]
let numOfSolutions = 0

export const isGameOver = gameState => {
    return gameOverStates.indexOf(gameState) !== -1
}

export const getTimeComponentString = value => {
    if (value > 9) return `${value}`
    else return `0${value}`
}

export const shouldSaveGameState = (currentGameState, previousGameState) => {
    if (isGameOver(currentGameState)) return true
    return currentGameState === GAME_STATE.INACTIVE && previousGameState === GAME_STATE.ACTIVE
}

export const duplicacyPresent = (num, mainNumbers, cell) => {
    const { row, col } = cell
    for (let col = 0; col < 9; col++) {
        if (mainNumbers[row][col].value === num) return 1 // check row
    }
    for (let row = 0; row < 9; row++) {
        if (mainNumbers[row][col].value === num) return 1 // check column
    }

    const blockRow = row - (row % 3)
    const blockColumn = col - (col % 3)
    for (let i = 0; i < 3; i++) {
        // check in block
        for (let j = 0; j < 3; j++) {
            if (mainNumbers[blockRow + i][blockColumn + j].value === num) return 1
        }
    }
    return 0
}

const checkDuplicateSolutions = (row, col, mainNumbers) => {
    if (row === 9) {
        if (++numOfSolutions > 1) return
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cellValue = mainNumbers[row][col].value
                mainNumbers[row][col].solutionValue = cellValue
            }
        }
        return
    }
    if (col === 9) return checkDuplicateSolutions(row + 1, 0, mainNumbers)
    if (mainNumbers[row][col].value) return checkDuplicateSolutions(row, col + 1, mainNumbers)

    for (let num = 1; num <= 9; num++) {
        if (numOfSolutions > 1) break
        if (!duplicacyPresent(num, mainNumbers, { row, col })) {
            mainNumbers[row][col].value = num
            checkDuplicateSolutions(row, col + 1, mainNumbers)
            mainNumbers[row][col].value = 0
        }
    }
}

// TODO: it's name should be changed. it is not returning number of solutions exactly
export const getNumberOfSolutions = mainNumbers => {
    numOfSolutions = 0
    checkDuplicateSolutions(0, 0, mainNumbers)
    if (numOfSolutions === 1) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                mainNumbers[row][col].isClue = mainNumbers[row][col].value !== 0
                delete mainNumbers[row][col].wronglyPlaced
            }
        }
    }
    return numOfSolutions
}

// how can i test this function's behaviour ??
export const previousInactiveGameExists = async () => {
    const previousGameData = await getKey(PREVIOUS_GAME_DATA_KEY)
    let result = false
    if (previousGameData) {
        const state = previousGameData[GAME_DATA_KEYS.STATE]
        if (state === GAME_STATE.INACTIVE) result = true
    }
    return result
}

export const areSameCells = (cellA, cellB) => cellA.row === cellB.row && cellA.col === cellB.col

export const areSameBlockCells = cells => {
    const cellsBlockNum = cells.map(cell => {
        const { row, col } = cell
        return getBlockAndBoxNum(cell).blockNum
    })
    return cellsBlockNum.allValuesSame()
}

export const areSameRowCells = cells => {
    const cellsRow = cells.map(({ row }) => row)
    return cellsRow.allValuesSame()
}

export const areSameColCells = cells => {
    const cellsCol = cells.map(({ col }) => col)
    return cellsCol.allValuesSame()
}
