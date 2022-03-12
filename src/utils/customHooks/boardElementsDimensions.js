import { useWindowDimensions } from 'react-native'

const INNER_THICK_BORDER_WIDTH = 3,
OUTER_THIN_BORDER_WIDTH = 1,
CELL_BORDER_WIDTH = 1,
CELLS_IN_HOUSE = 9,
GRID_WINDOW_WIDTH_RATIO = 0.94

const getGameBoardWidth = (windowWidth) => {
    let result = Math.floor(windowWidth * GRID_WINDOW_WIDTH_RATIO)
    const extraPixels = (result - (2 * INNER_THICK_BORDER_WIDTH + 2 * OUTER_THIN_BORDER_WIDTH)) % CELLS_IN_HOUSE
    result -= extraPixels
    return result
}

export const useBoardElementsDimensions = () => {
    const { width: windowWidth } = useWindowDimensions()

    const GAME_BOARD_WIDTH = getGameBoardWidth(windowWidth)
    const CELL_WIDTH = (GAME_BOARD_WIDTH - (2 * INNER_THICK_BORDER_WIDTH + 2 * OUTER_THIN_BORDER_WIDTH)) / CELLS_IN_HOUSE
    return {
        GAME_BOARD_WIDTH,
        GAME_BOARD_HEIGHT: GAME_BOARD_WIDTH,
        CELL_WIDTH,
        CELL_HEIGHT: CELL_WIDTH,
    }
}
