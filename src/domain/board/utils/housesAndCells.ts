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

export {
    isRowHouse,
    isColHouse,
    isBlockHouse,
    getHouseCells,
    getCellRowHouseInfo,
    getCellColHouseInfo,
    getCellBlockHouseInfo,
    getCellHouseForHouseType
}
