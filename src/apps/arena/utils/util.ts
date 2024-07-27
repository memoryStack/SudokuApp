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

import { GAME_STATE } from '@resources/constants'

import _sortBy from '@lodash/sortBy'
import { Puzzle } from '@adapters/puzzle'
import _intersection from '@lodash/intersection'
import {
    BOARD_AXES_VALUES, PUZZLE_SOLUTION_TYPES,
} from '../constants'

import { PREVIOUS_GAME_DATA_KEY, GAME_DATA_KEYS } from './cacheGameHandler'

import { HOUSES_COUNT_OF_A_TYPE, HOUSE_TYPE } from '@domain/board/board.constants'

import { getHouseCells } from '@domain/board/utils/housesAndCells'
import { GameState } from '@application/utils/gameState'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { NotesRecord } from '@domain/board/records/notesRecord'
import { BoardIterators } from '@domain/board/utils/boardIterators'

import { convertBoardCellNumToCell, convertBoardCellToNum, getBlockAndBoxNum } from '@domain/board/utils/cellsTransformers'

import {
    getCellRowHouseInfo, isBlockHouse,
    getCellHouseForHouseType, getCellColHouseInfo, getCellBlockHouseInfo
} from '@domain/board/utils/housesAndCells'
import { LEVEL_DIFFICULTIES } from '@application/constants'

export const addLeadingZeroIfEligible = (value: number) => {
    if (value > 9) return `${value}`
    return `0${value}`
}

export const shouldSaveDataOnGameStateChange = (currentState: GAME_STATE, previousState: GAME_STATE) =>
    new GameState(previousState).isGameActive() && !new GameState(currentState).isGameActive()

export const isMainNumberPresentInAnyHouseOfCell = (number: number, cell: Cell, mainNumbers: MainNumbers) =>
    mainNumberCountExccedsThresholdInAnyHouseOfCell(number, cell, mainNumbers, 0)

export const getPuzzleSolutionType = async (mainNumbers: MainNumbers) => {
    let puzzleStr = ''
    BoardIterators.forBoardEachCell(({ row: _row, col: _col }: Cell) => {
        puzzleStr += mainNumbers[_row][_col].value
    })

    // TODO: handle error case with msg separately
    return Puzzle.validatePuzzle(puzzleStr)
        .then(({ count, solution }: { count: number, solution: number[] }) => {
            if (count === 0) return PUZZLE_SOLUTION_TYPES.NO_SOLUTION
            if (count === 1) {
                BoardIterators.forBoardEachCell((cell: Cell) => {
                    const cellNo = convertBoardCellToNum(cell)
                    mainNumbers[cell.row][cell.col].solutionValue = solution[cellNo]
                })
                return PUZZLE_SOLUTION_TYPES.UNIQUE_SOLUTION
            }
            return PUZZLE_SOLUTION_TYPES.MULTIPLE_SOLUTIONS
        }).catch(() => PUZZLE_SOLUTION_TYPES.MULTIPLE_SOLUTIONS)
}

export const previousInactiveGameExists = async () => {
    const previousGameData = await getKey(PREVIOUS_GAME_DATA_KEY)
    if (!previousGameData) return false

    return [GAME_STATE.INACTIVE, GAME_STATE.DISPLAY_HINT].includes(previousGameData[GAME_DATA_KEYS.STATE])
}

// MOVE TO DOMAIN
export const areSameCells = (cellA: Cell, cellB: Cell) => {
    if (_isEmpty(cellA) || _isEmpty(cellB)) return false
    return _isEqual(cellA, cellB)
}

// MOVE TO DOMAIN
export const areSameBlockCells = (cells: Cell[]): boolean => _areSameValues(cells.map(cell => getBlockAndBoxNum(cell).blockNum))

// MOVE TO DOMAIN
export const areSameRowCells = (cells: Cell[]): boolean => _areSameValues(cells, 'row')

// MOVE TO DOMAIN
export const areSameColCells = (cells: Cell[]): boolean => _areSameValues(cells, 'col')

// what about this ??
export const isCellExists = (cell: Cell, store: Cell[]) => store.some(storedCell => areSameCells(storedCell, cell))

// MOVE TO DOMAIN, ALREADY MOVED
export const getCellHousesInfo = (cell: Cell) => {
    const result = [getCellRowHouseInfo(cell), getCellColHouseInfo(cell), getCellBlockHouseInfo(cell)]
    return result
}

export const areMultipleMainNumbersInAnyHouseOfCell = (mainNumbers: MainNumbers, cell: Cell, number: number) => mainNumberCountExccedsThresholdInAnyHouseOfCell(number, cell, mainNumbers, 1)

const mainNumberCountExccedsThresholdInAnyHouseOfCell = (number: number, cell: Cell, mainNumbers: MainNumbers, threshold: number) => {
    const allHouses = [HOUSE_TYPE.ROW, HOUSE_TYPE.COL, HOUSE_TYPE.BLOCK]
    return allHouses.some(houseType => {
        const numberHostCellsInHouse = getHouseCells(getCellHouseForHouseType(houseType, cell))
            .filter((houseCell: Cell) => MainNumbersRecord.isCellFilledWithNumber(mainNumbers, number, houseCell))
        return numberHostCellsInHouse.length > threshold
    })
}

// MOVE TO DOMAIN
export const duplicatesInPuzzle = (mainNumbers: MainNumbers) => {
    for (let row = 0; row < HOUSES_COUNT_OF_A_TYPE; row++) {
        for (let col = 0; col < HOUSES_COUNT_OF_A_TYPE; col++) {
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

// MOVE IT
export const getPairCellsCommonHouses = (cellA: Cell, cellB: Cell) => {
    const cellAHouses = getCellHousesInfo(cellA)
    const cellBHouses = getCellHousesInfo(cellB)

    const result: { [key: string]: boolean } = {}
    for (let i = 0; i < cellAHouses.length; i++) {
        const houseType: HouseType = cellAHouses[i].type
        result[houseType] = cellAHouses[i].num === cellBHouses[i].num
    }

    return result
}

// MOVE IT
export const areCommonHouseCells = (cellA: Cell, cellB: Cell) => {
    if (_isEmpty(cellA) || _isEmpty(cellB)) return false

    const cellsPairCommonHouses = getPairCellsCommonHouses(cellA, cellB)
    return Object.values(cellsPairCommonHouses).some(isCommonHouse => isCommonHouse)
}

// MOVE IT
export const areCellsFromSameHouse = (cells: Cell[]) => areSameRowCells(cells) || areSameColCells(cells) || areSameBlockCells(cells)

export const getUniqueNotesFromCells = (cells: Cell[], notesData: Notes): NoteValue[] => {
    const result: NoteValue[] = []
    _forEach(cells, (cell: Cell) => {
        result.push(...NotesRecord.getCellVisibleNotesList(notesData, cell))
    })

    return _sortNumbers(_unique(result))
}

export const getCellsCommonHouses = (cells: Cell[]) => {
    const result = {
        [HOUSE_TYPE.BLOCK]: true,
        [HOUSE_TYPE.ROW]: true,
        [HOUSE_TYPE.COL]: true,
    }

    for (let i = 1; i < cells.length; i++) {
        const pairCommonHouses = getPairCellsCommonHouses(cells[i - 1], cells[i])
        _forEach(Object.keys(result), (houseType: HouseType) => {
            result[houseType] = result[houseType] && pairCommonHouses[houseType]
        })
    }

    return result
}

export const getCellsCommonHousesInfo = (cells: Cell[]) => {
    const commonHouses = getCellsCommonHouses(cells)
    const allHouses = [HOUSE_TYPE.ROW, HOUSE_TYPE.COL, HOUSE_TYPE.BLOCK]
    return allHouses.filter(houseType => commonHouses[houseType])
        .map(commonHouseType => getCellHouseForHouseType(commonHouseType, cells[0]))
}

export const areSameCellsSets = (setA: Cell[], setB: Cell[]) => {
    if (setA.length !== setB.length) return false
    return setA.every(cell => isCellExists(cell, setB))
}

export const filterHouseCells = (house: House, filterCallback: (cell: Cell) => boolean) => getHouseCells(house).filter((cell: Cell) => filterCallback(cell))

export const getCellAxesValues = (cell: Cell) => {
    const yAxisTexts = BOARD_AXES_VALUES.Y_AXIS
    const xAxisTexts = BOARD_AXES_VALUES.X_AXIS
    return `${yAxisTexts[cell.row]}${xAxisTexts[cell.col]}`
}

export const getHouseAxesValue = ({ type, num }: House) => {
    if (isBlockHouse(type)) return ''

    const HOUSE_TYPE_VS_AXES_VALUES = {
        [HOUSE_TYPE.ROW]: BOARD_AXES_VALUES.Y_AXIS,
        [HOUSE_TYPE.COL]: BOARD_AXES_VALUES.X_AXIS,
    }
    return HOUSE_TYPE_VS_AXES_VALUES[type][num]
}

export const getHousesCellsSharedByCells = (cells: Cell[]) => {
    const result: Cell[] = []

    const commonHouses = getCellsCommonHouses(cells)
    Object.keys(commonHouses).filter(houseType => commonHouses[houseType])
        .forEach(houseType => {
            const commonHouseCells = getHouseCells(getCellHouseForHouseType(houseType, cells[0]))
            _forEach(commonHouseCells, (cell: Cell) => {
                if (!isCellExists(cell, result)) result.push(cell)
            })
        })

    return result
}

export const filterEmptyCells = (cells: Cell[], mainNumbers: MainNumbers) => _filter(cells, (cell: Cell) => !MainNumbersRecord.isCellFilled(mainNumbers, cell))

export const isGenerateNewPuzzleItem = (item: LEVEL_DIFFICULTIES) => _includes(_values(LEVEL_DIFFICULTIES), item)

export const getBlockStartCell = (blockIndex: number) => ({
    row: blockIndex - (blockIndex % 3),
    col: (blockIndex % 3) * 3,
})

export const getHousesCommonCells = (houseA: House, houseB: House) => {
    const firstHouseCells = getHouseCells(houseA)
    return getHouseCells(houseB)
        .filter((secondHouseCell: Cell) => isCellExists(secondHouseCell, firstHouseCells))
}

export const areSameHouses = (houseA: House, houseB: House) => houseA.type === houseB.type && houseA.num === houseB.num

export const getCellAllHousesCells = (cell: Cell) => getHousesCellsSharedByCells([cell, cell])

const isRowPartOfBlock = (rowNum: number, blockNum: number) => Math.floor(rowNum / 3) === Math.floor(blockNum / 3)

const isColPartOfBlock = (colNum: number, blockNum: number) => Math.floor(colNum / 3) === blockNum % 3

export const getCellsSharingHousesWithCells = (cellA: Cell, cellB: Cell): Cell[] => {
    const cellsCommonHouses = getPairCellsCommonHouses(cellA, cellB)

    if (cellsCommonHouses[HOUSE_TYPE.BLOCK]) {
        const commonLinearHouse = {
            type: cellsCommonHouses[HOUSE_TYPE.ROW] ? HOUSE_TYPE.ROW
                : cellsCommonHouses[HOUSE_TYPE.COL] ? HOUSE_TYPE.COL : null,
            num: cellsCommonHouses[HOUSE_TYPE.ROW] ? cellA.row
                : cellsCommonHouses[HOUSE_TYPE.COL] ? cellA.col : -1,
        }
        const blockCells = getHouseCells({ type: HOUSE_TYPE.BLOCK, num: getBlockAndBoxNum(cellA).blockNum })
            .filter(cell => cell[commonLinearHouse.type] !== commonLinearHouse.num)
        return [...getHouseCells(commonLinearHouse as House), ...blockCells]
    }

    if (cellsCommonHouses[HOUSE_TYPE.ROW] || cellsCommonHouses[HOUSE_TYPE.COL]) {
        const house = {
            type: cellsCommonHouses[HOUSE_TYPE.ROW] ? HOUSE_TYPE.ROW : HOUSE_TYPE.COL,
            num: cellsCommonHouses[HOUSE_TYPE.ROW] ? cellA.row : cellA.col,
        }
        return getHouseCells(house)
    }

    const result: Cell[] = []

    const cellABlockHouseNum = getBlockAndBoxNum(cellA).blockNum
    const cellBBlockHouseNum = getBlockAndBoxNum(cellB).blockNum

    const cellARowInBBlock = isRowPartOfBlock(cellA.row, cellBBlockHouseNum)
    const cellAColInBBlock = isColPartOfBlock(cellA.col, cellBBlockHouseNum)

    const cellBRowInABlock = isRowPartOfBlock(cellB.row, cellABlockHouseNum)
    const cellBColInABlock = isColPartOfBlock(cellB.col, cellABlockHouseNum)

    if (cellARowInBBlock || cellAColInBBlock || cellBRowInABlock || cellBColInABlock) {
        const blockACells = getHouseCells({ type: HOUSE_TYPE.BLOCK, num: cellABlockHouseNum })
        const blockBCells = getHouseCells({ type: HOUSE_TYPE.BLOCK, num: cellBBlockHouseNum })
        if (cellARowInBBlock) {
            blockBCells.forEach(cell => {
                cell.row === cellA.row && result.push(cell)
            })
            blockACells.forEach(cell => {
                cell.row === cellB.row && result.push(cell)
            })
        }
        if (cellAColInBBlock) {
            blockBCells.forEach(cell => {
                cell.col === cellA.col && result.push(cell)
            })
            blockACells.forEach(cell => {
                cell.col === cellB.col && result.push(cell)
            })
        }
    }

    if (_isEmpty(result)) {
        result.push(
            { row: cellA.row, col: cellB.col },
            { row: cellB.row, col: cellA.col },
        )
    }

    return result
}

export const sortCells = (cells: Cell[]): Cell[] => _sortBy(cells, ['row', 'col'])

export const generateMainNumbersFromPuzzleString = (puzzle: { unsolved: string, solution: string }): MainNumbers => {
    const mainNumbers = MainNumbersRecord.initMainNumbers()

    for (let i = 0; i < puzzle.unsolved.length; i++) {
        const { row, col } = convertBoardCellNumToCell(i)
        const cellValue = parseInt(puzzle.unsolved[i], 10)
        mainNumbers[row][col].value = cellValue
        if (cellValue) mainNumbers[row][col].isClue = true
        mainNumbers[row][col].solutionValue = parseInt(puzzle.solution[i], 10)
    }

    return mainNumbers
}

export const sameValueInCells = (cellA: Cell, cellB: Cell, mainNumbers: MainNumbers) => {
    const cellAValue = MainNumbersRecord.getCellMainValue(mainNumbers, cellA) || 0
    const cellBValue = MainNumbersRecord.getCellMainValue(mainNumbers, cellB) || 0
    return cellAValue !== 0 && cellAValue === cellBValue
}

export const isGameActive = (gameState: GAME_STATE) => new GameState(gameState).isGameActive()

export const getNoteHostCellsInHouse = (note: NoteValue, house: House, notes: Notes) => {
    const result: Cell[] = []
    BoardIterators.forHouseEachCell(house, cell => {
        if (NotesRecord.isNotePresentInCell(notes, note, cell)) {
            result.push(cell)
        }
    })
    return result
}

export const areAdjacentCells = (cellA: Cell, cellB: Cell) => {
    const cellsPair = [cellA, cellB]
    if (areSameRowCells(cellsPair)) {
        return Math.abs(cellA.col - cellB.col) === 1
    }

    if (areSameColCells(cellsPair)) {
        return Math.abs(cellA.row - cellB.row) === 1
    }

    return false
}

export const getCommonNoteInCells = (cellA: Cell, cellB: Cell, notes: Notes) => {
    const cellANotes = NotesRecord.getCellVisibleNotesList(notes, cellA)
    const cellBNotes = NotesRecord.getCellVisibleNotesList(notes, cellB)
    return _intersection(cellANotes, cellBNotes)
}
