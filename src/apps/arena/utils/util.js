import _isEmpty from '@lodash/isEmpty'
import _forEach from '@lodash/forEach'
import _every from '@lodash/every'
import _filter from '@lodash/filter'

import { getKey } from '@utils/storage'
import { GAME_STATE } from '@resources/constants'
import { onlyUnique } from '../../../utils/util'

import {
    BOARD_AXES_VALUES, CELLS_IN_HOUSE, HOUSES_COUNT, NUMBERS_IN_HOUSE, PUZZLE_SOLUTION_TYPES,
} from '../constants'

import { PREVIOUS_GAME_DATA_KEY, GAME_DATA_KEYS } from './cacheGameHandler'
import { HOUSE_TYPE } from './smartHints/constants'
import { getHouseCells } from './houseCells'
import { GameState } from './classes/gameState'

export const addLeadingZeroIfEligible = value => {
    if (value > 9) return `${value}`
    return `0${value}`
}

export const shouldSaveDataOnGameStateChange = (currentState, previousState) => new GameState(previousState).isGameActive() && !new GameState(currentState).isGameActive()

export const duplicacyPresent = (num, mainNumbers, cell) => isNumberPresentInAnyHouseOfCell(num, cell, mainNumbers)

const isNumberPresentInAnyHouseOfCell = (number, cell, mainNumbers) => [HOUSE_TYPE.ROW, HOUSE_TYPE.COL, HOUSE_TYPE.BLOCK].some(houseType => getHouseCells(getCellHouseInfo(houseType, cell)).some(({ row, col }) => mainNumbers[row][col].value === number))

const getSolutionsCountForPuzzleType = (mainNumbers, { row = 0, col = 0 } = {}) => {
    const isPuzzleSolved = row === CELLS_IN_HOUSE
    if (isPuzzleSolved) {
        forBoardEachCell(({ row, col }) => {
            const cellValue = mainNumbers[row][col].value
            mainNumbers[row][col].solutionValue = cellValue
        })
        return 1
    }

    const isRowComplete = col === CELLS_IN_HOUSE
    if (isRowComplete) return getSolutionsCountForPuzzleType(mainNumbers, { row: row + 1, col: 0 })

    if (!isCellEmpty({ row, col }, mainNumbers)) return getSolutionsCountForPuzzleType(mainNumbers, { row, col: col + 1 })

    let result = 0
    for (let num = 1; num <= NUMBERS_IN_HOUSE; num++) {
        if (result > 1) break
        if (!duplicacyPresent(num, mainNumbers, { row, col })) {
            mainNumbers[row][col].value = num
            result += getSolutionsCountForPuzzleType(mainNumbers, { row, col: col + 1 })
            mainNumbers[row][col].value = 0
        }
    }
    return result
}

export const getPuzzleSolutionType = mainNumbers => {
    const solutionsCount = getSolutionsCountForPuzzleType(mainNumbers)
    if (solutionsCount === 0) return PUZZLE_SOLUTION_TYPES.NO_SOLUTION
    if (solutionsCount === 1) return PUZZLE_SOLUTION_TYPES.UNIQUE_SOLUTION
    return PUZZLE_SOLUTION_TYPES.MULTIPLE_SOLUTIONS
}

export const previousInactiveGameExists = async () => {
    const previousGameData = await getKey(PREVIOUS_GAME_DATA_KEY)
    if (!previousGameData) return false

    return [GAME_STATE.INACTIVE, GAME_STATE.DISPLAY_HINT].includes(previousGameData[GAME_DATA_KEYS.STATE])
}

export const areSameCells = (cellA, cellB) => {
    if (_isEmpty(cellA) || _isEmpty(cellB)) return false
    return cellA.row === cellB.row && cellA.col === cellB.col
}

export const areSameBlockCells = cells => {
    const cellsBlockNum = cells.map(cell => getBlockAndBoxNum(cell).blockNum)
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

export const isCellEmpty = ({ row, col }, mainNumbers) => mainNumbers[row][col].value === 0

export const isCellExists = (cell, store) => store.some(storedCell => areSameCells(storedCell, cell))

export const initNotes = () => {
    const notes = []
    // BOARD_LOOPER: 12
    for (let row = 0; row < HOUSES_COUNT; row++) {
        const rowNotes = []
        for (let col = 0; col < HOUSES_COUNT; col++) {
            const boxNotes = []
            for (let note = 1; note <= NUMBERS_IN_HOUSE; note++) {
                // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0]
                //  represenstion. but let's ignore it for now
                boxNotes.push({ noteValue: note, show: 0 })
            }
            rowNotes.push(boxNotes)
        }
        notes.push(rowNotes)
    }
    return notes
}

export const getCellRowHouseInfo = cell => ({
    type: HOUSE_TYPE.ROW,
    num: cell.row,
})

export const getCellColHouseInfo = cell => ({
    type: HOUSE_TYPE.COL,
    num: cell.col,
})

export const getCellBlockHouseInfo = cell => ({
    type: HOUSE_TYPE.BLOCK,
    num: getBlockAndBoxNum(cell).blockNum,
})

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
export const isDuplicateEntry = (mainNumbers, cell, number) => multipleNumberInstancesExistInAnyHouseOfCell(number, cell, mainNumbers)

const multipleNumberInstancesExistInAnyHouseOfCell = (number, cell, mainNumbers) => [HOUSE_TYPE.ROW, HOUSE_TYPE.COL, HOUSE_TYPE.BLOCK].some(houseType => {
    const numberHostCellsInHouse = getHouseCells(getCellHouseInfo(houseType, cell)).filter(({ row, col }) => mainNumbers[row][col].value === number)
    return numberHostCellsInHouse.length > 1
})

export const duplicatesInPuzzle = mainNumbers => {
    for (let row = 0; row < HOUSES_COUNT; row++) {
        for (let col = 0; col < HOUSES_COUNT; col++) {
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
    if (_isEmpty(cellA) || _isEmpty(cellB)) return false

    const cellsPairCommonHouses = getPairCellsCommonHouses(cellA, cellB)
    return Object.values(cellsPairCommonHouses).some(isCommonHouse => isCommonHouse)
}

export const getUniqueNotesFromCells = (cells, notesData) => {
    const result = []
    _forEach(cells, cell => {
        result.push(...getCellVisibleNotes(notesData[cell.row][cell.col]))
    })

    return result.filter(onlyUnique).sortNumbers()
}

export const getCellVisibleNotes = notes => {
    const result = []
    notes.forEach(({ noteValue, show }) => {
        if (show) result.push(noteValue)
    })
    return result
}

export const getCellVisibleNotesCount = notes => getCellVisibleNotes(notes).length

export const isCellNoteVisible = (note, cellNotes) => cellNotes[note - 1].show

export const convertBoardCellToNum = ({ row, col }) => row * HOUSES_COUNT + col

export const convertBoardCellNumToCell = cellNum => ({
    row: Math.floor(cellNum / HOUSES_COUNT),
    col: cellNum % HOUSES_COUNT,
})

export const getCellsCommonHouses = cells => {
    const result = {
        [HOUSE_TYPE.BLOCK]: true,
        [HOUSE_TYPE.ROW]: true,
        [HOUSE_TYPE.COL]: true,
    }
    for (let i = 1; i < cells.length; i++) {
        const pairCommonHouses = getPairCellsCommonHouses(cells[i - 1], cells[i])
        for (const key in result) {
            result[key] = result[key] && pairCommonHouses[key]
        }
    }

    return result
}

export const areSameCellsSets = (setA, setB) => {
    if (setA.length !== setB.length) return false
    return setA.every(cell => isCellExists(cell, setB))
}

export const getHousePossibleNotes = (house, mainNumbers) => {
    const possibleNotes = new Array(10).fill(true)
    possibleNotes[0] = false
    getHouseCells(house).forEach(cell => {
        const cellValue = mainNumbers[cell.row][cell.col].value
        if (cellValue) possibleNotes[cellValue] = false
    })

    const result = []
    for (let num = 1; num <= NUMBERS_IN_HOUSE; num++) {
        if (possibleNotes[num]) result.push(num)
    }
    return result
}

/* Board Iterators */

export const forBoardEachCell = callback => {
    for (let row = 0; row < HOUSES_COUNT; row++) {
        for (let col = 0; col < CELLS_IN_HOUSE; col++) {
            callback({ row, col })
        }
    }
}

export const forCellEachNote = callback => {
    for (let note = 1; note <= NUMBERS_IN_HOUSE; note++) {
        const noteValue = note
        const noteIndx = note - 1
        callback(noteValue, noteIndx)
    }
}

export const forHouseEachCell = (house, callback) => {
    getHouseCells(house).forEach(cell => {
        callback(cell)
    })
}

export const filterHouseCells = (house, filterCallback) => getHouseCells(house).filter(cell => filterCallback(cell))

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
    for (let houseNum = 0; houseNum < HOUSES_COUNT; houseNum++) callback(houseNum)
}

export const isCellCorrectlyFilled = ({ solutionValue = 0, value = 0 } = {}) => {
    if (solutionValue === 0 || value === 0) return false
    return value === solutionValue
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
    const result = []
    for (let i = 0; i < HOUSES_COUNT; i++) {
        const rowData = []
        for (let j = 0; j < CELLS_IN_HOUSE; j++) {
            rowData.push(getCellMainNumberDefaultValue())
        }
        result.push(rowData)
    }
    return result
}

const getCellMainNumberDefaultValue = () => ({ value: 0, solutionValue: 0, isClue: false })

export const getHousesCellsSharedByCells = cells => {
    const result = []

    const commonHouses = getCellsCommonHouses(cells)
    for (const houseType in commonHouses) {
        if (!commonHouses[houseType]) continue
        const commonHouseCells = getHouseCells(getCellHouseInfo(houseType, cells[0]))
        _forEach(commonHouseCells, cell => {
            if (!isCellExists(cell, result)) result.push(cell)
        })
    }

    return result
}

export const areSameNotesInCells = (cells, notes) => {
    const cellsNotes = cells.map(cell => getCellVisibleNotes(notes[cell.row][cell.col]))
    return _every(cellsNotes, aCellNotes => aCellNotes.sameArrays(cellsNotes[0]))
}

export const filterEmptyCells = (cells, mainNumbers) => _filter(cells, cell => isCellEmpty(cell, mainNumbers))
