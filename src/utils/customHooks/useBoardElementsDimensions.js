import { useWindowDimensions } from 'react-native'
import { roundToNearestPixel } from '../util'

// move these constants in constants file
// what to move from here
export const INNER_THICK_BORDER_WIDTH = roundToNearestPixel(3),
    GRID_THIN_BORDERS_WIDTH = roundToNearestPixel(1),
    BOARD_AXIS_WIDTH = roundToNearestPixel(20)

const GRID_WINDOW_WIDTH_RATIO = 0.94
const CELLS_IN_HOUSE = 9
const BORDERS_TOTAL_THICKNESS = roundToNearestPixel(2 * INNER_THICK_BORDER_WIDTH + 8 * GRID_THIN_BORDERS_WIDTH)

const getGameBoardWidth = windowWidth => {
    return windowWidth * GRID_WINDOW_WIDTH_RATIO - BOARD_AXIS_WIDTH
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
