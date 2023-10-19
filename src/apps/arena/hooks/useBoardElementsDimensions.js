import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { roundToNearestPixel } from '../../../utils/util'

import {
    STATIC_BOARD_ELEMENTS_DIMENSIONS,
    CELLS_IN_HOUSE,
    BOARD_TO_WINDOW_WIDTH_RATIO,
    THICK_BORDER_COUNT,
    THIN_BORDER_COUNT,
} from '../constants'

export const useBoardElementsDimensions = () => {
    const { width: windowWidth } = useWindowDimensions()

    const cellWidth = getCellWidth(windowWidth)
    const boardGridWidth = cellWidth * CELLS_IN_HOUSE + getAllBordersTotalSpace()

    const boardElementsDimensions = useMemo(() => ({
        BOARD_GRID_WIDTH: boardGridWidth,
        BOARD_GRID_HEIGHT: boardGridWidth,
        CELL_WIDTH: cellWidth,
        CELL_HEIGHT: cellWidth,
    }), [boardGridWidth, cellWidth])

    return boardElementsDimensions
}

const getCellWidth = windowWidth => {
    const cellWidth = (getBoardGridWidth(windowWidth) - getAllBordersTotalSpace()) / CELLS_IN_HOUSE
    return roundToNearestPixel(cellWidth)
}

const getAllBordersTotalSpace = () => {
    const thickBordersSpace = THICK_BORDER_COUNT * STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH
    const thinBordersSpace = THIN_BORDER_COUNT * STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH
    const boardBorderWidth = 2 * STATIC_BOARD_ELEMENTS_DIMENSIONS.BOARD_BORDER_WIDTH
    return roundToNearestPixel(thickBordersSpace + thinBordersSpace + boardBorderWidth)
}

const getBoardGridWidth = windowWidth => {
    const boardWidth = roundToNearestPixel(windowWidth * BOARD_TO_WINDOW_WIDTH_RATIO)
    return boardWidth - STATIC_BOARD_ELEMENTS_DIMENSIONS.AXIS_WIDTH
}
