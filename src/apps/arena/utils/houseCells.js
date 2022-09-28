import { CELLS_IN_HOUSE } from '../constants'
import { HOUSE_TYPE } from './smartHints/constants'
import { getRowAndCol } from './util'

const getRowHouseCells = houseNum => {
    const result = []
    for (let col = 0; col < CELLS_IN_HOUSE; col++) {
        result.push({ row: houseNum, col })
    }
    return result
}

const getColHouseCells = houseNum => {
    const result = []
    for (let row = 0; row < CELLS_IN_HOUSE; row++) {
        result.push({ row, col: houseNum })
    }
    return result
}

const getBlockHouseCells = houseNum => {
    const result = []
    for (let box = 0; box < CELLS_IN_HOUSE; box++) {
        result.push(getRowAndCol(houseNum, box))
    }
    return result
}

const getHouseCells = (houseType, houseNum) => {
    if (houseType === HOUSE_TYPE.ROW) return getRowHouseCells(houseNum)
    if (houseType === HOUSE_TYPE.COL) return getColHouseCells(houseNum)
    if (houseType === HOUSE_TYPE.BLOCK) return getBlockHouseCells(houseNum)
    throw 'invalid house type'
}

export { getHouseCells }
