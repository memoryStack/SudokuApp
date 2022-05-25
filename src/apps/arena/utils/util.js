import { GAME_STATE } from '../../../resources/constants'
import { PREVIOUS_GAME_DATA_KEY, GAME_DATA_KEYS } from './cacheGameHandler'
import { getKey } from '../../../utils/storage'
import { consoleLog, getBlockAndBoxNum, getRowAndCol } from '../../../utils/util'
import { HOUSE_TYPE } from './smartHints/constants'
import { getHouseCells } from './houseCells'

const gameOverStates = [GAME_STATE.OVER.SOLVED, GAME_STATE.OVER.UNSOLVED]
let numOfSolutions = 0

export const isGameOver = gameState => {
    return gameOverStates.indexOf(gameState) !== -1
}

export const getTimeComponentString = value => {
    if (value > 9) return `${value}`
    else return `0${value}`
}

export const shouldSaveGameState = (currentGameState, previousGameState) => {
    return currentGameState !== GAME_STATE.ACTIVE && previousGameState === GAME_STATE.ACTIVE
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

const checkDuplicateSolutions = (mainNumbers, cell) => {
    const { row, col } = cell
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
    if (col === 9) return checkDuplicateSolutions(mainNumbers, { row: row + 1, col: 0 })
    if (mainNumbers[row][col].value) return checkDuplicateSolutions(mainNumbers, { row, col: col + 1 })

    for (let num = 1; num <= 9; num++) {
        if (numOfSolutions > 1) break
        if (!duplicacyPresent(num, mainNumbers, { row, col })) {
            mainNumbers[row][col].value = num
            checkDuplicateSolutions(mainNumbers, { row, col: col + 1 })
            mainNumbers[row][col].value = 0
        }
    }
}

// TODO: it's name should be changed. it is not returning number of solutions exactly
export const getNumberOfSolutions = mainNumbers => {
    numOfSolutions = 0
    checkDuplicateSolutions(mainNumbers, { row: 0, col: 0 })
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
        if ([GAME_STATE.INACTIVE, GAME_STATE.DISPLAY_HINT].includes(state)) result = true
    }
    return result
}

export const areSameCells = (cellA, cellB) => cellA.row === cellB.row && cellA.col === cellB.col

export const areSameBlockCells = cells => {
    const cellsBlockNum = cells.map(cell => {
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

export const isCellEmpty = ({ row, col }, mainNumbers) => {
    return mainNumbers[row][col].value === 0
}

export const isCellExists = (cell, store) => store.some(storedCell => areSameCells(storedCell, cell))

export const initNotes = () => {
    const notesInfo = new Array(9)
    for (let i = 0; i < 9; i++) {
        const rowNotes = []
        for (let j = 0; j < 9; j++) {
            const boxNotes = new Array(9)
            for (let k = 1; k <= 9; k++) {
                // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0]
                //  represenstion. but let's ignore it for now
                boxNotes[k - 1] = { noteValue: k, show: 0 }
            }
            rowNotes.push(boxNotes)
        }
        notesInfo[i] = rowNotes
    }
    return notesInfo
}

export const getCellRowHouseInfo = cell => {
    return {
        type: HOUSE_TYPE.ROW,
        num: cell.row,
    }
}

export const getCellColHouseInfo = cell => {
    return {
        type: HOUSE_TYPE.COL,
        num: cell.col,
    }
}

export const getCellBlockHouseInfo = cell => {
    return {
        type: HOUSE_TYPE.BLOCK,
        num: getBlockAndBoxNum(cell).blockNum,
    }
}

export const getCellHouseInfo = (type, cell) => {
    if (type === HOUSE_TYPE.ROW) return getCellRowHouseInfo(cell)
    if (type === HOUSE_TYPE.COL) return getCellColHouseInfo(cell)
    if (type === HOUSE_TYPE.BLOCK) return getCellBlockHouseInfo(cell)
    throw 'un-identified house'
}

export const getCellHousesInfo = cell => {
    const result = [getCellRowHouseInfo(cell), getCellColHouseInfo(cell), getCellBlockHouseInfo(cell)]
    return result
}

// TODO: merge duplicacyPresent and isDuplicateEntry functions into one
export const isDuplicateEntry = (mainNumbers, cell, number) => {
    const { row, col } = cell
    let houseCount = 0
    for (let col = 0; col < 9; col++) if (mainNumbers[row][col].value === number) houseCount++
    if (houseCount > 1) return true

    houseCount = 0
    for (let row = 0; row < 9; row++) if (mainNumbers[row][col].value === number) houseCount++
    if (houseCount > 1) return true

    houseCount = 0
    const { blockNum } = getBlockAndBoxNum(cell)
    for (let box = 0; box < 9; box++) {
        const { row, col } = getRowAndCol(blockNum, box)
        if (mainNumbers[row][col].value === number) houseCount++
    }
    return houseCount > 1
}

export const duplicatesInPuzzle = mainNumbers => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (isCellEmpty({ row, col }, mainNumbers)) continue
            if (isDuplicateEntry(mainNumbers, { row, col }, mainNumbers[row][col].value)) {
                return {
                    present: true,
                    cell: { row, col },
                }
            }
        }
    }
    return { present: false }
}

export const getPairCellsCommonHouses = (cellA, cellB) => {
    const cellAHouses = getCellHousesInfo(cellA)
    const cellBHouses = getCellHousesInfo(cellB)

    const result = {}
    for (let i = 0; i < cellAHouses.length; i++) {
        const houseType = cellAHouses[i].type
        result[houseType] = cellAHouses[i].num === cellBHouses[i].num
    }

    return result
}

export const getCellVisibleNotes = notes => {
    const result = []
    notes.forEach(({ noteValue, show }) => {
        if (show) result.push(noteValue)
    })
    return result
}

export const getCellVisibleNotesCount = notes => {
    return getCellVisibleNotes(notes).length
}

export const isCellNoteVisible = (note, cellNotes) => {
    return cellNotes[note - 1].show
}

export const convertBoardCellToNum = ({ row, col }) => {
    return row * 9 + col
}

export const convertBoardCellNumToCell = cellNum => {
    return {
        row: Math.floor(cellNum / 9),
        col: cellNum % 9,
    }
}

export const getCellsCommonHouses = cells => {
    const result = {
        [HOUSE_TYPE.BLOCK]: true,
        [HOUSE_TYPE.ROW]: true,
        [HOUSE_TYPE.COL]: true,
    }
    for (let i = 1; i < cells.length; i++) {
        const pairCommonHouses = getPairCellsCommonHouses(cells[i - 1], cells[i])
        for (let key in result) {
            result[key] = result[key] && pairCommonHouses[key]
        }
    }

    return result
}

export const areSameCellsSets = (setA, setB) => {
    if (setA.length !== setB.length) return false
    return setA.every(cell => {
        return isCellExists(cell, setB)
    })
}

export const getHousePossibleNotes = (house, mainNumbers) => {
    const houseCells = getHouseCells(house.type, house.num)

    const possibleNotes = new Array(10).fill(true)
    possibleNotes[0] = false
    houseCells.forEach(cell => {
        const cellValue = mainNumbers[cell.row][cell.col].value
        if (cellValue) possibleNotes[cellValue] = false
    })

    const result = []
    for (let num = 1; num <= 9; num++) {
        if (possibleNotes[num]) result.push(num)
    }
    return result
}

/* Board Iterators */

export const forEachCell = callback => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            callback({ row, col })
        }
    }
}

export const forCellEachNote = callback => {
    for (let note = 1; note <= 9; note++) {
        const noteValue = note
        const noteIndx = note - 1
        callback(noteValue, noteIndx)
    }
}

export const forHouseEachCell = ({ type, num }, callback) => {
    getHouseCells(type, num).forEach(cell => {
        callback(cell)
    })
}

export const filterHouseCells = ({ type, num }, filterCallback) => {
    return getHouseCells(type, num).filter(cell => {
        return filterCallback(cell)
    })
}
