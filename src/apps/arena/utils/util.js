import _isEmpty from '@lodash/isEmpty'
import _isEqual from '@lodash/isEqual'
import _forEach from '@lodash/forEach'
import _filter from '@lodash/filter'
import _includes from '@lodash/includes'
import _values from '@lodash/values'
import _unique from '@lodash/unique'
import _sortNumbers from '@lodash/sortNumbers'
import _areSameValues from '@lodash/areSameValues'

import { getKey } from '@utils/storage'

import { GAME_STATE, LEVEL_DIFFICULTIES } from '@resources/constants'

import {
    BOARD_AXES_VALUES, CELLS_IN_HOUSE, HOUSES_COUNT, NUMBERS_IN_HOUSE, PUZZLE_SOLUTION_TYPES,
} from '../constants'

import { PREVIOUS_GAME_DATA_KEY, GAME_DATA_KEYS } from './cacheGameHandler'
import { HOUSE_TYPE } from './smartHints/constants'
import { getHouseCells } from './houseCells'
import { GameState } from './classes/gameState'
import { MainNumbersRecord } from '../RecordUtilities/boardMainNumbers'
import { NotesRecord } from '../RecordUtilities/boardNotes'
import { Houses } from './classes/houses'
import { BoardIterators } from './classes/boardIterators'

export const addLeadingZeroIfEligible = value => {
    if (value > 9) return `${value}`
    return `0${value}`
}

export const shouldSaveDataOnGameStateChange = (currentState, previousState) => new GameState(previousState).isGameActive() && !new GameState(currentState).isGameActive()

export const isMainNumberPresentInAnyHouseOfCell = (number, cell, mainNumbers) => mainNumberCountExccedsThresholdInAnyHouseOfCell(number, cell, mainNumbers, 0)

const getSolutionsCountForPuzzleType = (mainNumbers, { row = 0, col = 0 } = {}) => {
    const isPuzzleSolved = row === CELLS_IN_HOUSE
    if (isPuzzleSolved) {
        BoardIterators.forBoardEachCell(({ row: _row, col: _col }) => {
            mainNumbers[_row][_col].solutionValue = MainNumbersRecord.getCellMainValue(mainNumbers, { row: _row, col: _col })
        })
        return 1
    }

    const isRowComplete = col === CELLS_IN_HOUSE
    if (isRowComplete) return getSolutionsCountForPuzzleType(mainNumbers, { row: row + 1, col: 0 })

    if (MainNumbersRecord.isCellFilled(mainNumbers, { row, col })) return getSolutionsCountForPuzzleType(mainNumbers, { row, col: col + 1 })

    let result = 0
    for (let num = 1; num <= NUMBERS_IN_HOUSE; num++) {
        if (result > 1) break
        if (!isMainNumberPresentInAnyHouseOfCell(num, { row, col }, mainNumbers)) {
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
    return _isEqual(cellA, cellB)
}

export const areSameBlockCells = cells => _areSameValues(cells.map(cell => getBlockAndBoxNum(cell).blockNum))

export const areSameRowCells = cells => _areSameValues(cells, 'row')

export const areSameColCells = cells => _areSameValues(cells, 'col')

export const isCellExists = (cell, store) => store.some(storedCell => areSameCells(storedCell, cell))

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

export const getCellHouseForHouseType = (houseType, cell) => {
    if (Houses.isRowHouse(houseType)) return getCellRowHouseInfo(cell)
    if (Houses.isColHouse(houseType)) return getCellColHouseInfo(cell)
    if (Houses.isBlockHouse(houseType)) return getCellBlockHouseInfo(cell)
    throw new Error('un-identified house')
}

export const getCellHousesInfo = cell => {
    const result = [getCellRowHouseInfo(cell), getCellColHouseInfo(cell), getCellBlockHouseInfo(cell)]
    return result
}

export const areMultipleMainNumbersInAnyHouseOfCell = (mainNumbers, cell, number) => mainNumberCountExccedsThresholdInAnyHouseOfCell(number, cell, mainNumbers, 1)

const mainNumberCountExccedsThresholdInAnyHouseOfCell = (number, cell, mainNumbers, threshold) => {
    const allHouses = [HOUSE_TYPE.ROW, HOUSE_TYPE.COL, HOUSE_TYPE.BLOCK]
    return allHouses.some(houseType => {
        const numberHostCellsInHouse = getHouseCells(getCellHouseForHouseType(houseType, cell))
            .filter(houseCell => MainNumbersRecord.isCellFilledWithNumber(mainNumbers, number, houseCell))
        return numberHostCellsInHouse.length > threshold
    })
}

export const duplicatesInPuzzle = mainNumbers => {
    for (let row = 0; row < HOUSES_COUNT; row++) {
        for (let col = 0; col < HOUSES_COUNT; col++) {
            if (!MainNumbersRecord.isCellFilled(mainNumbers, { row, col })) continue

            if (areMultipleMainNumbersInAnyHouseOfCell(
                mainNumbers,
                { row, col },
                MainNumbersRecord.getCellMainValue(mainNumbers, { row, col }),
            )) {
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
        result.push(...NotesRecord.getCellVisibleNotesList(notesData, cell))
    })

    return _sortNumbers(_unique(result))
}

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
        _forEach(Object.keys(result), houseType => {
            result[houseType] = result[houseType] && pairCommonHouses[houseType]
        })
    }

    return result
}

export const areSameCellsSets = (setA, setB) => {
    if (setA.length !== setB.length) return false
    return setA.every(cell => isCellExists(cell, setB))
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

export const getHousesCellsSharedByCells = cells => {
    const result = []

    const commonHouses = getCellsCommonHouses(cells)
    Object.keys(commonHouses).filter(houseType => commonHouses[houseType])
        .forEach(houseType => {
            const commonHouseCells = getHouseCells(getCellHouseForHouseType(houseType, cells[0]))
            _forEach(commonHouseCells, cell => {
                if (!isCellExists(cell, result)) result.push(cell)
            })
        })

    return result
}

export const filterEmptyCells = (cells, mainNumbers) => _filter(cells, cell => !MainNumbersRecord.isCellFilled(mainNumbers, cell))

export const isGenerateNewPuzzleItem = item => _includes(_values(LEVEL_DIFFICULTIES), item)

export const getBlockStartCell = blockNum => ({
    row: blockNum - (blockNum % 3),
    col: (blockNum % 3) * 3,
})

export const getHousesCommonCells = (houseA, houseB) => {
    const firstHouseCells = getHouseCells(houseA)
    return getHouseCells(houseB)
        .filter(secondHouseCell => isCellExists(secondHouseCell, firstHouseCells))
}
