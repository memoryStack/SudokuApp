import { useWindowDimensions } from 'react-native'
import {
    STATIC_BOARD_ELEMENTS_DIMENSIONS,
    CELLS_IN_HOUSE,
    BOARD_TO_WINDOW_WIDTH_RATIO,
    THICK_BORDER_COUNT,
    THIN_BORDER_COUNT,
} from '../../apps/arena/constants'
import { roundToNearestPixel } from '../util'

export const useBoardElementsDimensions = () => {
    const { width: windowWidth } = useWindowDimensions()
    const cellWidth = getCellWidth(windowWidth)
    const boardGridWidth = cellWidth * CELLS_IN_HOUSE + getAllBordersTotalSpace()
    return {
        BOARD_GRID_WIDTH: boardGridWidth,
        BOARD_GRID_HEIGHT: boardGridWidth,
        CELL_WIDTH: cellWidth,
        CELL_HEIGHT: cellWidth,
    }
}

const getCellWidth = windowWidth => {
    const cellWidth = (getBoardGridWidth(windowWidth) - getAllBordersTotalSpace()) / CELLS_IN_HOUSE
    return roundToNearestPixel(cellWidth)
}

const getAllBordersTotalSpace = () => {
    const thickBordersSpace = THICK_BORDER_COUNT * STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH
    const thinBordersSpace = THIN_BORDER_COUNT * STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH
    return roundToNearestPixel(thickBordersSpace + thinBordersSpace)
}

const getBoardGridWidth = windowWidth => {
    const boardWidth = windowWidth * BOARD_TO_WINDOW_WIDTH_RATIO
    return boardWidth - STATIC_BOARD_ELEMENTS_DIMENSIONS.AXIS_WIDTH
}
