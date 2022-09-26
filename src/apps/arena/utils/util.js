import _isEmpty from 'lodash/src/utils/isEmpty'

import { GAME_STATE } from '../../../resources/constants'
import { PREVIOUS_GAME_DATA_KEY, GAME_DATA_KEYS } from './cacheGameHandler'
import { getKey } from '../../../utils/storage'
import { HOUSE_TYPE } from './smartHints/constants'
import { getHouseCells } from './houseCells'
import { BOARD_AXES_VALUES, PUZZLE_SOLUTION_TYPES } from '../constants'
import { GameState } from './classes/gameState'
import { consoleLog } from '../../../utils/util'

export const getTimeComponentString = value => {
    if (value > 9) return `${value}`
    else return `0${value}`
}

export const shouldSaveGameState = (currentGameState, previousGameState) => {
    const wasPreviousStateActive = new GameState(previousGameState).isGameActive()
    const isCurrentStateNotActive = !new GameState(currentGameState).isGameActive()
    return wasPreviousStateActive && isCurrentStateNotActive
}

export const duplicacyPresent = (num, mainNumbers, cell) => {
    return isNumberPresentInAnyHouseOfCell(num, cell, mainNumbers)
}

const isNumberPresentInAnyHouseOfCell = (number, cell, mainNumbers) => {
    return [HOUSE_TYPE.ROW, HOUSE_TYPE.COL, HOUSE_TYPE.BLOCK].some(houseType => {
        const { num: houseNum } = getCellHouseInfo(houseType, cell)
        return getHouseCells(houseType, houseNum).some(({ row, col }) => {
            return mainNumbers[row][col].value === number
        })
    })
}

const getSolutionsCountForPuzzleType = (mainNumbers, { row = 0, col = 0 } = {}) => {
    const isPuzzleSolved = row === 9
    if (isPuzzleSolved) {
        forBoardEachCell(({ row, col }) => {
            const cellValue = mainNumbers[row][col].value
            mainNumbers[row][col].solutionValue = cellValue
        })
        return 1
    }

    const isRowComplete = col === 9
    if (isRowComplete) return getSolutionsCountForPuzzleType(mainNumbers, { row: row + 1, col: 0 })

    if (!isCellEmpty({ row, col }, mainNumbers)) return getSolutionsCountForPuzzleType(mainNumbers, { row, col: col + 1 })

    let result = 0
    for (let num = 1; num <= 9; num++) {
        if (result > 1) break
        if (!duplicacyPresent(num, mainNumbers, { row, col })) {
            mainNumbers[row][col].value = num
            result += getSolutionsCountForPuzzleType(mainNumbers, { row, col: col + 1 })
            mainNumbers[row][col].value = 0
        }
    }
    return result
}

export const getPuzzleSolutionType = (mainNumbers) => {
    const solutionsCount = getSolutionsCountForPuzzleType(mainNumbers)

    if (solutionsCount === 0) return PUZZLE_SOLUTION_TYPES.UNIQUE_SOLUTION
    if (solutionsCount > 1) return PUZZLE_SOLUTION_TYPES.MULTIPLE_SOLUTIONS

    forBoardEachCell(({ row, col }) => {
        mainNumbers[row][col].isClue = !isCellEmpty({ row, col }, mainNumbers)
        delete mainNumbers[row][col].wronglyPlaced
    })
    return PUZZLE_SOLUTION_TYPES.UNIQUE_SOLUTION
}

// how can i test this function's behaviour ??
export const previousInactiveGameExists = async () => {
    const previousGameData = await getKey(PREVIOUS_GAME_DATA_KEY)
    if (!previousGameData) return false

    return [GAME_STATE.INACTIVE, GAME_STATE.DISPLAY_HINT].includes(previousGameData[GAME_DATA_KEYS.STATE])
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
    // BOARD_LOOPER: 12
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
    return multipleNumberInstancesExistInAnyHouseOfCell(number, cell, mainNumbers)
}

const multipleNumberInstancesExistInAnyHouseOfCell = (number, cell, mainNumbers) => {
    return [HOUSE_TYPE.ROW, HOUSE_TYPE.COL, HOUSE_TYPE.BLOCK].some(houseType => {
        const { num: houseNum } = getCellHouseInfo(houseType, cell)
        const numberHostCellsInHouse = getHouseCells(houseType, houseNum).filter(({ row, col }) => {
            return mainNumbers[row][col].value === number
        })
        return numberHostCellsInHouse.length > 1
    })
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

export const areCommonHouseCells = (cellA, cellB) => {
    const cellsPairCommonHouses = getPairCellsCommonHouses(cellA, cellB)
    return Object.values(cellsPairCommonHouses).some(isCommonHouse => isCommonHouse)
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

export const forBoardEachCell = callback => {
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

export const getCellAxesValues = cell => {
    const yAxisTexts = BOARD_AXES_VALUES.Y_AXIS
    const xAxisTexts = BOARD_AXES_VALUES.X_AXIS
    return `${yAxisTexts[cell.row]}${xAxisTexts[cell.col]}`
}

export const getHouseAxesValue = ({ type, num }) => {
    const HOUSE_TYPE_VS_AXES_VALUES = {
        [HOUSE_TYPE.ROW]: BOARD_AXES_VALUES.Y_AXIS,
        [HOUSE_TYPE.COL]: BOARD_AXES_VALUES.X_AXIS,
    }
    return HOUSE_TYPE_VS_AXES_VALUES[type][num]
}

export const forEachHouse = callback => {
    for (let houseNum = 0; houseNum < 9; houseNum++) callback(houseNum)
}

export const isCellCorrectlyFilled = ({ solutionValue, value } = {}) => {
    if (_isEmpty(value) || _isEmpty(solutionValue) || solutionValue === 0 || value === 0) return false
    return value === solutionValue
}

export const sameHouseAsSelected = (cell, selectedCell) => {
    if (cell.row === selectedCell.row || cell.col === selectedCell.col) return true
    const normalBoxBlockInfo = getBlockAndBoxNum(cell)
    const selectedBoxBlockInfo = getBlockAndBoxNum(selectedCell)
    return normalBoxBlockInfo.blockNum === selectedBoxBlockInfo.blockNum
}

export const getRowAndCol = (blockNum, boxNum) => {
    const addToRow = (boxNum - (boxNum % 3)) / 3
    const row = blockNum - (blockNum % 3) + addToRow
    const col = (blockNum % 3) * 3 + (boxNum % 3)
    return { row, col }
}

export const getBlockAndBoxNum = cell => {
    const { row, col } = cell
    const blockNum = row - (row % 3) + (col - (col % 3)) / 3
    const boxNum = (row % 3) * 3 + (col % 3)
    return { blockNum, boxNum }
}

export const initMainNumbers = () => {
    const result = new Array(9)
    for (let i = 0; i < 9; i++) {
        const rowData = new Array(9)
        for (let j = 0; j < 9; j++) {
            rowData[j] = getCellMainNumberDefaultValue()
        }
        result[i] = rowData
    }
    return result
}

const getCellMainNumberDefaultValue = () => ({ value: 0, solutionValue: '', isClue: false })
