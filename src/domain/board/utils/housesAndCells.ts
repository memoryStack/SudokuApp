import _isEmpty from "@lodash/isEmpty"
import _isEqual from "@lodash/isEqual"

import { CELLS_IN_A_HOUSE, HOUSE_TYPE } from "../board.constants"

import { blockCellToBoardCell, getBlockAndBoxNum } from "./cellsTransformers"

function isRowHouse(houseType: HouseType) {
    return houseType === HOUSE_TYPE.ROW
}

function isColHouse(houseType: HouseType) {
    return houseType === HOUSE_TYPE.COL
}

function isBlockHouse(houseType: HouseType) {
    return houseType === HOUSE_TYPE.BLOCK
}

const getRowHouseCells = (houseNum: HouseNum): Cell[] => {
    const result = []
    for (let col = 0; col < CELLS_IN_A_HOUSE; col++) {
        result.push({ row: houseNum, col })
    }
    return result
}

const getColHouseCells = (houseNum: HouseNum): Cell[] => {
    const result = []
    for (let row = 0; row < CELLS_IN_A_HOUSE; row++) {
        result.push({ row, col: houseNum })
    }
    return result
}

const getBlockHouseCells = (houseNum: HouseNum): Cell[] => {
    const result = []
    for (let box = 0; box < CELLS_IN_A_HOUSE; box++) {
        result.push(blockCellToBoardCell({ blockNum: houseNum, boxNum: box }))
    }
    return result
}

const getHouseCells = ({ type, num }: House) => {
    if (isRowHouse(type)) return getRowHouseCells(num)
    if (isColHouse(type)) return getColHouseCells(num)
    if (isBlockHouse(type)) return getBlockHouseCells(num)
    return []
}

const getCellRowHouseInfo = (cell: Cell): House => ({
    type: HOUSE_TYPE.ROW,
    num: cell.row,
})

const getCellColHouseInfo = (cell: Cell): House => ({
    type: HOUSE_TYPE.COL,
    num: cell.col,
})

const getCellBlockHouseInfo = (cell: Cell): House => ({
    type: HOUSE_TYPE.BLOCK,
    num: getBlockAndBoxNum(cell).blockNum,
})

const getCellHouseForHouseType = (houseType: HouseType, cell: Cell): House => {
    if (isRowHouse(houseType)) return getCellRowHouseInfo(cell)
    if (isColHouse(houseType)) return getCellColHouseInfo(cell)
    return getCellBlockHouseInfo(cell)
}

const getCellHousesInfo = (cell: Cell) => {
    const result = [
        getCellRowHouseInfo(cell),
        getCellColHouseInfo(cell),
        getCellBlockHouseInfo(cell)
    ]
    return result
}

const areSameCells = (cellA: Cell, cellB: Cell) => {
    if (_isEmpty(cellA) || _isEmpty(cellB)) return false
    return _isEqual(cellA, cellB)
}

const getPairCellsCommonHouses = (cellA: Cell, cellB: Cell) => {
    const cellAHouses = getCellHousesInfo(cellA)
    const cellBHouses = getCellHousesInfo(cellB)

    const result: { [key: string]: boolean } = {}
    for (let i = 0; i < cellAHouses.length; i++) {
        const houseType: HouseType = cellAHouses[i].type
        result[houseType] = cellAHouses[i].num === cellBHouses[i].num
    }

    return result
}

const areCommonHouseCells = (cellA: Cell, cellB: Cell) => {
    if (_isEmpty(cellA) || _isEmpty(cellB)) return false

    const cellsPairCommonHouses = getPairCellsCommonHouses(cellA, cellB)
    return Object.values(cellsPairCommonHouses).some(isCommonHouse => isCommonHouse)
}

// TODO: this will be removed anyway
const getCellAxesValues = (cell: Cell) => {
    const BOARD_AXES_VALUES = {
        Y_AXIS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        X_AXIS: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    }
    const yAxisTexts = BOARD_AXES_VALUES.Y_AXIS
    const xAxisTexts = BOARD_AXES_VALUES.X_AXIS
    return `${yAxisTexts[cell.row]}${xAxisTexts[cell.col]}`
}

export {
    isRowHouse,
    isColHouse,
    isBlockHouse,
    getHouseCells,
    getCellRowHouseInfo,
    getCellColHouseInfo,
    getCellBlockHouseInfo,
    getCellHouseForHouseType,
    getCellHousesInfo,
    areSameCells,
    areCommonHouseCells,
    getCellAxesValues,
}
