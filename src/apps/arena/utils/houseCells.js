import { CELLS_IN_HOUSE } from '../constants'
import { getRowAndCol } from './cellTransformers'
import { Houses } from './classes/houses'

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

const getHouseCells = ({ type, num }) => {
    if (Houses.isRowHouse(type)) return getRowHouseCells(num)
    if (Houses.isColHouse(type)) return getColHouseCells(num)
    if (Houses.isBlockHouse(type)) return getBlockHouseCells(num)
    return []
}

export { getHouseCells }
