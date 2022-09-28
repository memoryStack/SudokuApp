import { useWindowDimensions } from 'react-native'
import { STATIC_BOARD_ELEMENTS_DIMENSIONS } from '../../apps/arena/constants'
import { roundToNearestPixel } from '../util'

const GRID_WINDOW_WIDTH_RATIO = 0.94
const CELLS_IN_HOUSE = 9
const BORDERS_TOTAL_THICKNESS = roundToNearestPixel(
    2 * STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH
    + 8 * STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH
)

const getGameBoardWidth = windowWidth => {
    return windowWidth * GRID_WINDOW_WIDTH_RATIO - STATIC_BOARD_ELEMENTS_DIMENSIONS.AXIS_WIDTH
}

export const useBoardElementsDimensions = () => {
    const { width: windowWidth } = useWindowDimensions()

    const rawGameBoardWidth = getGameBoardWidth(windowWidth)
    const cellWidth = roundToNearestPixel((rawGameBoardWidth - BORDERS_TOTAL_THICKNESS) / CELLS_IN_HOUSE)

    const pixelPerfectGameBoardWidth = cellWidth * CELLS_IN_HOUSE + BORDERS_TOTAL_THICKNESS
    return {
        GAME_BOARD_WIDTH: pixelPerfectGameBoardWidth,
        GAME_BOARD_HEIGHT: pixelPerfectGameBoardWidth,
        CELL_WIDTH: cellWidth,
        CELL_HEIGHT: cellWidth,
    }
}
