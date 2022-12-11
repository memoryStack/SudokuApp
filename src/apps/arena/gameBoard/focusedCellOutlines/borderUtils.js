import _forEach from 'lodash/src/utils/forEach'

import { areSameCells, areSameColCells, areSameRowCells } from "../../utils/util"

import { BOARD_GRID_BORDERS_DIRECTION, STATIC_BOARD_ELEMENTS_DIMENSIONS } from "../../constants"

export const getVerticalBorderWidthBetweenCells = (...args) => {
    return getBordersWidthBetweenCells(...args)[BOARD_GRID_BORDERS_DIRECTION.VERTICAL]
}

export const getHorizontalBorderWidthBetweenCells = (...args) => {
    return getBordersWidthBetweenCells(...args)[BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL]
}

export const getBordersWidthBetweenCells = (cellA, cellB) => {
    if (areSameCells(cellA, cellB)) return 0

    const borderTypesBetweenCells = getBorderTypesBetweenCells(cellA, cellB)

    const result = {}

    // TODO: extract this function into a new one
    _forEach(borderTypesBetweenCells, (borderType) => {
        let smallerCrossHouseNum
        if (borderType === BOARD_GRID_BORDERS_DIRECTION.VERTICAL)
            smallerCrossHouseNum = Math.min(cellA.col, cellB.col)

        if (borderType === BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL)
            smallerCrossHouseNum = Math.min(cellA.row, cellB.row)

        if (smallerCrossHouseNum === 2 || smallerCrossHouseNum === 5) result[borderType] = STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH
        else result[borderType] = STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH
    })

    return result
}

export const getBorderTypesBetweenCells = (cellA, cellB) => {
    if (areSameRowCells([cellA, cellB])) return [BOARD_GRID_BORDERS_DIRECTION.VERTICAL]

    if (areSameColCells([cellA, cellB])) return [BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL]

    if (Math.abs(cellA.row - cellB.row) === 1 && Math.abs(cellA.col - cellB.col) === 1)
        return [BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL, BOARD_GRID_BORDERS_DIRECTION.VERTICAL]

    if (Math.abs(cellA.row - cellB.row) === 1)
        return [BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL]

    if (Math.abs(cellA.col - cellB.col) === 1)
        return [BOARD_GRID_BORDERS_DIRECTION.VERTICAL]
}
