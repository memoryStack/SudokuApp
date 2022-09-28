import { useWindowDimensions } from 'react-native'
import {
    STATIC_BOARD_ELEMENTS_DIMENSIONS,
    CELLS_IN_HOUSE,
    GRID_TO_WINDOW_WIDTH_RATIO,
    THICK_BORDER_COUNT,
    THIN_BORDER_COUNT,
} from '../../apps/arena/constants'
import { roundToNearestPixel } from '../util'

const getGameBoardWidth = windowWidth => {
    return windowWidth * GRID_TO_WINDOW_WIDTH_RATIO - STATIC_BOARD_ELEMENTS_DIMENSIONS.AXIS_WIDTH
}

const getAllBordersTotalSpace = () => {
    const thickBordersSpace = THICK_BORDER_COUNT * STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH
    const thinBordersSpace = THIN_BORDER_COUNT * STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH
    return roundToNearestPixel(thickBordersSpace + thinBordersSpace)
}

export const useBoardElementsDimensions = () => {
    const { width: windowWidth } = useWindowDimensions()

    const rawGameBoardWidth = getGameBoardWidth(windowWidth)
    const cellWidth = roundToNearestPixel((rawGameBoardWidth - getAllBordersTotalSpace()) / CELLS_IN_HOUSE)

    const pixelPerfectGameBoardWidth = cellWidth * CELLS_IN_HOUSE + getAllBordersTotalSpace()
    return {
        GAME_BOARD_WIDTH: pixelPerfectGameBoardWidth,
        GAME_BOARD_HEIGHT: pixelPerfectGameBoardWidth,
        CELL_WIDTH: cellWidth,
        CELL_HEIGHT: cellWidth,
    }
}
