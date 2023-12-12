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

import _sortBy from '@lodash/sortBy'
import { Puzzle } from '@adapters/puzzle'
import {
    BOARD_AXES_VALUES, HOUSES_COUNT, PUZZLE_SOLUTION_TYPES,
} from '../constants'

import { PREVIOUS_GAME_DATA_KEY, GAME_DATA_KEYS } from './cacheGameHandler'
import { HOUSE_TYPE } from './smartHints/constants'
import { getHouseCells } from './houseCells'
import { GameState } from './classes/gameState'
import { MainNumbersRecord } from '../RecordUtilities/boardMainNumbers'
import { NotesRecord } from '../RecordUtilities/boardNotes'
import { Houses } from './classes/houses'
import { BoardIterators } from './classes/boardIterators'

import { convertBoardCellNumToCell, convertBoardCellToNum, getBlockAndBoxNum } from './cellTransformers'

export const addLeadingZeroIfEligible = (value: number) => {
    if (value > 9) return `${value}`
    return `0${value}`
}

export const shouldSaveDataOnGameStateChange = (currentState: GAME_STATE, previousState: GAME_STATE) => new GameState(previousState).isGameActive() && !new GameState(currentState).isGameActive()

export const isMainNumberPresentInAnyHouseOfCell = (number: number, cell: Cell, mainNumbers: MainNumbers) => mainNumberCountExccedsThresholdInAnyHouseOfCell(number, cell, mainNumbers, 0)

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

export const areSameCells = (cellA: Cell, cellB: Cell) => {
    if (_isEmpty(cellA) || _isEmpty(cellB)) return false
    return _isEqual(cellA, cellB)
}

export const areSameBlockCells = (cells: Cell[]): boolean => _areSameValues(cells.map(cell => getBlockAndBoxNum(cell).blockNum))

export const areSameRowCells = (cells: Cell[]): boolean => _areSameValues(cells, 'row')

export const areSameColCells = (cells: Cell[]): boolean => _areSameValues(cells, 'col')

export const isCellExists = (cell: Cell, store: Cell[]) => store.some(storedCell => areSameCells(storedCell, cell))

export const getCellRowHouseInfo = (cell: Cell): House => ({
    type: HOUSE_TYPE.ROW,
    num: cell.row,
})

export const getCellColHouseInfo = (cell: Cell): House => ({
    type: HOUSE_TYPE.COL,
    num: cell.col,
})

export const getCellBlockHouseInfo = (cell: Cell): House => ({
    type: HOUSE_TYPE.BLOCK,
    num: getBlockAndBoxNum(cell).blockNum,
})

export const getCellHouseForHouseType = (houseType: HouseType, cell: Cell): House => {
    if (Houses.isRowHouse(houseType)) return getCellRowHouseInfo(cell)
    if (Houses.isColHouse(houseType)) return getCellColHouseInfo(cell)
    if (Houses.isBlockHouse(houseType)) return getCellBlockHouseInfo(cell)
    throw new Error('un-identified house')
}

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

export const duplicatesInPuzzle = (mainNumbers: MainNumbers) => {
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

export const areCommonHouseCells = (cellA: Cell, cellB: Cell) => {
    if (_isEmpty(cellA) || _isEmpty(cellB)) return false

    const cellsPairCommonHouses = getPairCellsCommonHouses(cellA, cellB)
    return Object.values(cellsPairCommonHouses).some(isCommonHouse => isCommonHouse)
}

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
    if (Houses.isBlockHouse(type)) return ''

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

export const getCellsSharingHousesWithCells = (cellA: Cell, cellB: Cell): Cell[] => {
    const cellAAllHousesCells = getCellAllHousesCells(cellA)
    const cellBAllHousesCells = getCellAllHousesCells(cellB)
    return _filter(cellBAllHousesCells, (cell: Cell) => isCellExists(cell, cellAAllHousesCells))
}

export const sortCells = (cells: Cell[]): Cell[] => _sortBy(cells, ['row', 'col'])

export const generateMainNumbersFromPuzzleString = (puzzle: {unsolved: string, solution: string}): MainNumbers => {
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
